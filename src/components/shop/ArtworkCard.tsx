import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/stripe'
import type { ArtworkWithOrders } from '@/types'

interface Props {
  artwork: ArtworkWithOrders
}

export function ArtworkCard({ artwork }: Props) {
  const lowestPrice = Math.min(
    ...[artwork.digitalPriceCents, artwork.physicalPriceCents].filter(Boolean) as number[]
  )

  return (
    <Link href={`/shop/${artwork.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-[#E8D5B7] aspect-[4/5] relative mb-4">
        {artwork.imageUrl ? (
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* REPLACE: artwork.imageUrl with actual image */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8B7D6B] text-sm text-center p-6">
            <div className="w-16 h-16 border-2 border-[#8B7D6B] rounded-full flex items-center justify-center mb-4 opacity-40">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="opacity-60">[ Artwork image placeholder ]</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {artwork.hasDigital && (
            <span className="bg-[#3D3B7A] text-white text-xs px-2.5 py-1 rounded-full">
              Digital
            </span>
          )}
          {artwork.hasPhysical && (
            <span className="bg-[#7A8C6E] text-white text-xs px-2.5 py-1 rounded-full">
              Print
            </span>
          )}
        </div>
      </div>

      <div>
        <h3
          className="text-lg text-[#2C2C2C] mb-1 group-hover:text-[#C4714A] transition-colors"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {artwork.title}
        </h3>
        {artwork.medium && (
          <p className="text-xs text-[#8B7D6B] mb-2 tracking-wide">{artwork.medium}</p>
        )}
        <p className="text-[#C4714A] font-medium">
          {lowestPrice ? `From ${formatPrice(lowestPrice)}` : 'Price on request'}
        </p>
      </div>
    </Link>
  )
}
