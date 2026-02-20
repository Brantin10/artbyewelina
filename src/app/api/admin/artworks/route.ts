import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const artworks = await prisma.artwork.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(artworks)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()

  // Generate slug from title
  const slug = data.slug || data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const artwork = await prisma.artwork.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      story: data.story,
      medium: data.medium,
      year: data.year ? Number(data.year) : null,
      imageUrl: data.imageUrl || '',
      hasDigital: Boolean(data.hasDigital),
      hasPhysical: Boolean(data.hasPhysical),
      digitalPriceCents: data.digitalPriceCents ? Number(data.digitalPriceCents) : null,
      physicalPriceCents: data.physicalPriceCents ? Number(data.physicalPriceCents) : null,
      printSizes: data.printSizes,
      digitalFileUrl: data.digitalFileUrl,
      digitalFilename: data.digitalFilename,
      isFeatured: Boolean(data.isFeatured),
      isPublished: Boolean(data.isPublished),
    },
  })

  return NextResponse.json(artwork)
}
