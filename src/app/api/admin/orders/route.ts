import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { status: { not: 'PENDING' } },
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
