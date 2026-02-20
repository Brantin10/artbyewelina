import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { status: { not: 'PENDING' } },
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
