import Link from 'next/link'
import { ArtworkCard } from '@/components/shop/ArtworkCard'
import type { ArtworkWithOrders } from '@/types'

interface Props {
  artworks: ArtworkWithOrders[]
}

export function FeaturedGrid({ artworks }: Props) {
  return (
    <section className="py-24 px-6 bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#7A8C6E] uppercase mb-4">Featured Works</p>
          <h2
            className="text-4xl md:text-5xl text-[#2C2C2C]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Recent Collection
          </h2>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center text-[#8B7D6B] py-12">
            <p>No featured artworks yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-block border border-[#C4714A] text-[#C4714A] px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#C4714A] hover:text-white transition-colors"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
