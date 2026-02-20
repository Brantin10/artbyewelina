import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toCSV } from '@/lib/csv'

type OrderWithArtwork = Prisma.OrderGetPayload<{ include: { artwork: true } }>

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { status: { not: 'PENDING' } },
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  })

  const rows = orders.map((o: OrderWithArtwork) => ({
    id: o.id,
    type: o.type,
    status: o.status,
    artwork: o.artwork.title,
    buyer_email: o.buyerEmail,
    buyer_name: o.buyerName,
    amount_eur: (o.amountPaidCents / 100).toFixed(2),
    print_size: o.printSize,
    tracking_number: o.trackingNumber,
    shipped_at: o.shippedAt?.toISOString(),
    created_at: o.createdAt.toISOString(),
    shipping_country: o.shippingCountry,
  }))

  const csv = toCSV(rows)
  const date = new Date().toISOString().split('T')[0]

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="orders-${date}.csv"`,
    },
  })
}
