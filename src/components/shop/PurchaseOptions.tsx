'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/stripe'
import type { PrintSize } from '@/types'

interface Props {
  artworkId: string
  artworkTitle: string
  hasDigital: boolean
  hasPhysical: boolean
  digitalPriceCents?: number | null
  physicalPriceCents?: number | null
  printSizes?: string | null
}

export function PurchaseOptions({
  artworkId,
  hasDigital,
  hasPhysical,
  digitalPriceCents,
  physicalPriceCents,
  printSizes,
}: Props) {
  const [type, setType] = useState<'DIGITAL' | 'PHYSICAL'>(hasDigital ? 'DIGITAL' : 'PHYSICAL')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sizes: PrintSize[] = printSizes ? JSON.parse(printSizes) : []

  async function handlePurchase() {
    setError('')
    if (type === 'PHYSICAL' && sizes.length > 0 && !selectedSize) {
      setError('Please select a print size.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId, type, printSize: selectedSize || undefined }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Type selector */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#8B7D6B] mb-3">Choose Format</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hasDigital && digitalPriceCents && (
            <button
              onClick={() => setType('DIGITAL')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                type === 'DIGITAL'
                  ? 'border-[#3D3B7A] bg-[#3D3B7A]/5'
                  : 'border-[#E8D5B7] hover:border-[#3D3B7A]/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#3D3B7A]" />
                <span className="text-sm font-medium text-[#2C2C2C]">Digital PDF</span>
              </div>
              <p className="text-xs text-[#8B7D6B] mb-2">High-res file, print at home</p>
              <p className="text-[#C4714A] font-semibold">{formatPrice(digitalPriceCents)}</p>
            </button>
          )}

          {hasPhysical && physicalPriceCents && (
            <button
              onClick={() => setType('PHYSICAL')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                type === 'PHYSICAL'
                  ? 'border-[#7A8C6E] bg-[#7A8C6E]/5'
                  : 'border-[#E8D5B7] hover:border-[#7A8C6E]/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#7A8C6E]" />
                <span className="text-sm font-medium text-[#2C2C2C]">Printed & Shipped</span>
              </div>
              <p className="text-xs text-[#8B7D6B] mb-2">Museum-quality print, shipped to you</p>
              <p className="text-[#C4714A] font-semibold">{formatPrice(physicalPriceCents)}</p>
            </button>
          )}
        </div>
      </div>

      {/* Size selector (physical only) */}
      {type === 'PHYSICAL' && sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-[#8B7D6B] mb-3">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  selectedSize === size.label
                    ? 'border-[#7A8C6E] bg-[#7A8C6E] text-white'
                    : 'border-[#E8D5B7] text-[#2C2C2C] hover:border-[#7A8C6E]'
                }`}
              >
                {size.label}
                <span className="text-xs ml-1 opacity-70">
                  ({size.widthCm}×{size.heightCm}cm)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Digital info */}
      {type === 'DIGITAL' && (
        <div className="bg-[#F5EEE3] rounded-lg p-4 text-sm text-[#8B7D6B]">
          <p>📥 You will receive a secure download link by email immediately after purchase.</p>
          <p className="mt-1">The link is valid for 72 hours and can be used 3 times.</p>
        </div>
      )}

      {/* Physical info */}
      {type === 'PHYSICAL' && (
        <div className="bg-[#F5EEE3] rounded-lg p-4 text-sm text-[#8B7D6B]">
          <p>🖼️ Printed on premium museum-quality paper and shipped within 3–5 business days.</p>
          <p className="mt-1">Each print is personally packaged by Ewelina with care.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {/* Buy button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-[#C4714A] text-white py-4 rounded-full text-sm tracking-wide hover:bg-[#A85D38] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting to payment...' : 'Purchase Now'}
      </button>

      <p className="text-xs text-center text-[#8B7D6B]">
        Secure payment via Stripe. All major cards accepted.
      </p>
    </div>
  )
}
