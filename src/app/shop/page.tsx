import { prisma } from '@/lib/prisma'
import { ArtworkCard } from '@/components/shop/ArtworkCard'

export const metadata = {
  title: 'Shop — Art by Ewelina',
  description: 'Browse the full collection of original mixed media artworks by Ewelina.',
}

export default async function ShopPage() {
  const artworks = await prisma.artwork.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center py-16">
          <p className="text-xs tracking-[0.3em] text-[#7A8C6E] uppercase mb-4">The Collection</p>
          <h1
            className="text-5xl md:text-6xl text-[#2C2C2C] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Original Works
          </h1>
          <p className="text-[#8B7D6B] max-w-xl mx-auto leading-relaxed">
            Each piece is available as a high-resolution digital download (PDF) or as a printed original
            shipped directly to your door.
          </p>
        </div>

        {/* Filter info */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#E8D5B7]">
          <p className="text-sm text-[#8B7D6B]">{artworks.length} works</p>
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 text-xs text-[#8B7D6B]">
              <span className="w-3 h-3 rounded-full bg-[#3D3B7A] inline-block" />
              Digital download
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#8B7D6B]">
              <span className="w-3 h-3 rounded-full bg-[#7A8C6E] inline-block" />
              Printed & shipped
            </span>
          </div>
        </div>

        {/* Grid */}
        {artworks.length === 0 ? (
          <div className="text-center py-24 text-[#8B7D6B]">
            <p className="text-lg mb-2">No artworks published yet.</p>
            <p className="text-sm">Check back soon — new works are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
