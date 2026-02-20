import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArtworkForm } from '@/components/admin/ArtworkForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params
  const artwork = await prisma.artwork.findUnique({ where: { id } })
  if (!artwork) notFound()

  const initial = {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    description: artwork.description,
    story: artwork.story || '',
    medium: artwork.medium || '',
    year: artwork.year?.toString() || '',
    imageUrl: artwork.imageUrl,
    hasDigital: artwork.hasDigital,
    hasPhysical: artwork.hasPhysical,
    digitalPriceCents: artwork.digitalPriceCents ? (artwork.digitalPriceCents / 100).toFixed(2) : '',
    physicalPriceCents: artwork.physicalPriceCents ? (artwork.physicalPriceCents / 100).toFixed(2) : '',
    printSizes: artwork.printSizes || '[]',
    digitalFileUrl: artwork.digitalFileUrl || '',
    digitalFilename: artwork.digitalFilename || '',
    isFeatured: artwork.isFeatured,
    isPublished: artwork.isPublished,
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl text-[#2C2C2C] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Edit Artwork
      </h1>
      <ArtworkForm initial={initial} />
    </div>
  )
}
