import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/stripe'
import { PurchaseOptions } from '@/components/shop/PurchaseOptions'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const artworks = await prisma.artwork.findMany({ where: { isPublished: true }, select: { slug: true } })
  return artworks.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const artwork = await prisma.artwork.findUnique({ where: { slug } })
  if (!artwork) return {}
  return {
    title: `${artwork.title} — Art by Ewelina`,
    description: artwork.description,
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = await prisma.artwork.findUnique({ where: { slug, isPublished: true } })
  if (!artwork) notFound()

  return (
    <div className="pt-24 min-h-screen bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="sticky top-24">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#E8D5B7] relative">
              {artwork.imageUrl ? (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                /* REPLACE: artwork.imageUrl with actual image */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8B7D6B] text-sm text-center p-8">
                  <div className="w-24 h-24 border-2 border-[#8B7D6B] rounded-full flex items-center justify-center mb-6 opacity-40">
                    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="opacity-60 text-lg">[ {artwork.title} ]</p>
                  <p className="opacity-40 text-xs mt-2">Artwork image placeholder</p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Meta */}
            <div className="flex gap-3 mb-4">
              {artwork.hasDigital && (
                <span className="bg-[#3D3B7A] text-white text-xs px-3 py-1 rounded-full">Digital PDF</span>
              )}
              {artwork.hasPhysical && (
                <span className="bg-[#7A8C6E] text-white text-xs px-3 py-1 rounded-full">Printed & Shipped</span>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl text-[#2C2C2C] mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {artwork.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#8B7D6B]">
              {artwork.medium && <span>{artwork.medium}</span>}
              {artwork.year && <span>{artwork.year}</span>}
            </div>

            <p className="text-[#555] leading-relaxed mb-6 text-lg">{artwork.description}</p>

            {artwork.story && (
              <div className="border-l-2 border-[#C4714A] pl-5 mb-8">
                <p className="text-[#8B7D6B] leading-relaxed italic">{artwork.story}</p>
              </div>
            )}

            {/* Pricing summary */}
            <div className="bg-[#F5EEE3] rounded-lg p-5 mb-8">
              <div className="flex flex-col gap-2">
                {artwork.digitalPriceCents && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#8B7D6B]">Digital Download</span>
                    <span className="text-[#2C2C2C] font-medium">{formatPrice(artwork.digitalPriceCents)}</span>
                  </div>
                )}
                {artwork.physicalPriceCents && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#8B7D6B]">Printed & Shipped</span>
                    <span className="text-[#2C2C2C] font-medium">{formatPrice(artwork.physicalPriceCents)}</span>
                  </div>
                )}
              </div>
            </div>

            <PurchaseOptions
              artworkId={artwork.id}
              artworkTitle={artwork.title}
              hasDigital={artwork.hasDigital}
              hasPhysical={artwork.hasPhysical}
              digitalPriceCents={artwork.digitalPriceCents}
              physicalPriceCents={artwork.physicalPriceCents}
              printSizes={artwork.printSizes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
