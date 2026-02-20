import type { ArtworkWithOrders } from '@/types'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/stripe'
import Link from 'next/link'

export default async function ArtworksPage() {
  const artworks = await prisma.artwork.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>Artworks</h1>
          <p className="text-[#8B7D6B] mt-1">{artworks.length} total artworks</p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="bg-[#3D3B7A] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#2E2C60] transition-colors"
        >
          + Add Artwork
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {artworks.length === 0 ? (
          <div className="text-center py-20 text-[#8B7D6B]">
            <p className="text-lg mb-4">No artworks yet.</p>
            <Link href="/admin/artworks/new" className="text-[#C4714A] hover:underline">Add your first artwork →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EEE3]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Title</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Formats</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Price (Digital)</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Price (Print)</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork: ArtworkWithOrders) => (
                  <tr key={artwork.id} className="border-b border-[#F5EEE3] hover:bg-[#FAF6F0]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#2C2C2C]">{artwork.title}</p>
                        {artwork.medium && <p className="text-xs text-[#8B7D6B]">{artwork.medium}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {artwork.hasDigital && <span className="text-xs bg-[#3D3B7A]/10 text-[#3D3B7A] px-2 py-0.5 rounded-full">Digital</span>}
                        {artwork.hasPhysical && <span className="text-xs bg-[#7A8C6E]/10 text-[#7A8C6E] px-2 py-0.5 rounded-full">Print</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#2C2C2C]">
                      {artwork.digitalPriceCents ? formatPrice(artwork.digitalPriceCents) : '—'}
                    </td>
                    <td className="px-6 py-4 text-[#2C2C2C]">
                      {artwork.physicalPriceCents ? formatPrice(artwork.physicalPriceCents) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${artwork.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {artwork.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {artwork.isFeatured && <span className="text-xs px-2 py-1 rounded-full bg-[#C4714A]/10 text-[#C4714A]">Featured</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/artworks/${artwork.id}`} className="text-[#C4714A] hover:underline text-xs">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
