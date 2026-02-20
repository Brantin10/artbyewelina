import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { createDownloadToken } from '@/lib/tokens'
import { sendDigitalPurchaseEmail, sendPhysicalOrderEmail } from '@/lib/email'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    const buf = Buffer.from(await req.arrayBuffer())
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge
      if (charge.payment_intent) {
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: String(charge.payment_intent) },
          data: { status: 'REFUNDED' },
        })
      }
    }
  } catch (err) {
    console.error('[webhook] Handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    include: { artwork: true },
  })

  if (!order) {
    console.error('[webhook] Order not found for session:', session.id)
    return
  }

  // Idempotency guard
  if (order.status !== 'PENDING') {
    console.log('[webhook] Order already processed, skipping:', order.id)
    return
  }

  const buyerEmail = session.customer_details?.email || ''
  const buyerName = session.customer_details?.name

  // Collect shipping if physical
  const shipping = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string | null; line2?: string | null; city?: string | null; postal_code?: string | null; country?: string | null } } }).shipping_details
  const updateData: Record<string, unknown> = {
    status: 'PAID',
    buyerEmail,
    buyerName,
    stripePaymentIntentId: session.payment_intent ? String(session.payment_intent) : null,
  }

  if (shipping?.address) {
    updateData.shippingName = shipping.name
    updateData.shippingLine1 = shipping.address.line1
    updateData.shippingLine2 = shipping.address.line2
    updateData.shippingCity = shipping.address.city
    updateData.shippingPostal = shipping.address.postal_code
    updateData.shippingCountry = shipping.address.country
  }

  await prisma.order.update({ where: { id: order.id }, data: updateData })

  if (order.type === 'DIGITAL') {
    const tokenRecord = await createDownloadToken(order.id)
    await prisma.order.update({ where: { id: order.id }, data: { status: 'FULFILLED' } })
    await sendDigitalPurchaseEmail({
      to: buyerEmail,
      buyerName,
      artworkTitle: order.artwork.title,
      token: tokenRecord.token,
    })
  } else {
    await sendPhysicalOrderEmail({
      to: buyerEmail,
      buyerName,
      artworkTitle: order.artwork.title,
      printSize: order.printSize,
      orderId: order.id,
    })
  }
}
