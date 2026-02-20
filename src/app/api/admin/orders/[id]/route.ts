import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { sendShippingEmail } from '@/lib/email'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { artwork: true } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { trackingNumber, adminNotes } = await req.json()

  const order = await prisma.order.findUnique({ where: { id }, include: { artwork: true } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...(trackingNumber && { trackingNumber, status: 'SHIPPED', shippedAt: new Date() }),
      ...(adminNotes !== undefined && { adminNotes }),
    },
    include: { artwork: true },
  })

  if (trackingNumber && order.buyerEmail) {
    await sendShippingEmail({
      to: order.buyerEmail,
      buyerName: order.buyerName,
      artworkTitle: order.artwork.title,
      trackingNumber,
    })
  }

  return NextResponse.json(updated)
}
