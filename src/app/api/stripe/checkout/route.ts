import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  artworkId: z.string(),
  type: z.enum(['DIGITAL', 'PHYSICAL']),
  printSize: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { artworkId, type, printSize } = schema.parse(body)

    const artwork = await prisma.artwork.findUnique({ where: { id: artworkId, isPublished: true } })
    if (!artwork) return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })

    const priceCents =
      type === 'DIGITAL' ? artwork.digitalPriceCents : artwork.physicalPriceCents

    if (!priceCents) {
      return NextResponse.json({ error: 'This artwork is not available in that format' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        stripeSessionId: 'pending',
        type,
        status: 'PENDING',
        artworkId,
        printSize: printSize || null,
        amountPaidCents: priceCents,
        buyerEmail: '',
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      currency: 'eur',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: priceCents,
            product_data: {
              name: `${artwork.title} — ${type === 'DIGITAL' ? 'Digital PDF' : `Printed & Shipped${printSize ? ` (${printSize})` : ''}`}`,
              description: artwork.description.slice(0, 255),
              images: artwork.imageUrl ? [artwork.imageUrl] : [],
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        artworkId,
        type,
        printSize: printSize || '',
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/${artwork.slug}`,
      billing_address_collection: type === 'PHYSICAL' ? 'required' : 'auto',
      shipping_address_collection: type === 'PHYSICAL'
        ? { allowed_countries: ['SE', 'NO', 'DK', 'FI', 'GB', 'DE', 'FR', 'NL', 'BE', 'AT', 'CH', 'US', 'CA', 'AU'] }
        : undefined,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
