import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const artwork = await prisma.artwork.findUnique({ where: { id } })
  if (!artwork) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(artwork)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()

  const artwork = await prisma.artwork.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.story !== undefined && { story: data.story }),
      ...(data.medium !== undefined && { medium: data.medium }),
      ...(data.year !== undefined && { year: data.year ? Number(data.year) : null }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.hasDigital !== undefined && { hasDigital: Boolean(data.hasDigital) }),
      ...(data.hasPhysical !== undefined && { hasPhysical: Boolean(data.hasPhysical) }),
      ...(data.digitalPriceCents !== undefined && { digitalPriceCents: data.digitalPriceCents ? Number(data.digitalPriceCents) : null }),
      ...(data.physicalPriceCents !== undefined && { physicalPriceCents: data.physicalPriceCents ? Number(data.physicalPriceCents) : null }),
      ...(data.printSizes !== undefined && { printSizes: data.printSizes }),
      ...(data.digitalFileUrl !== undefined && { digitalFileUrl: data.digitalFileUrl }),
      ...(data.digitalFilename !== undefined && { digitalFilename: data.digitalFilename }),
      ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
      ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
    },
  })

  return NextResponse.json(artwork)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.artwork.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
