'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/stripe'

interface Order {
  id: string
  type: string
  status: string
  amountPaidCents: number
  buyerEmail: string
  buyerName?: string
  printSize?: string
  shippingName?: string
  shippingLine1?: string
  shippingLine2?: string
  shippingCity?: string
  shippingPostal?: string
  shippingCountry?: string
  trackingNumber?: string
  shippedAt?: string
  createdAt: string
  artwork: { title: string; slug: string }
}

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(setOrder)
  }, [id])

  async function markShipped() {
    setLoading(true)
    setMsg('')
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber: tracking }),
    })
    if (res.ok) {
      setMsg('Order marked as shipped! Shipping email sent.')
      const updated = await fetch(`/api/admin/orders/${id}`).then(r => r.json())
      setOrder(updated)
    } else {
      setMsg('Something went wrong.')
    }
    setLoading(false)
  }

  if (!order) return <div className="p-8 text-[#8B7D6B]">Loading...</div>

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="text-sm text-[#8B7D6B] hover:text-[#C4714A] mb-6 flex items-center gap-2">
        ← Back to Orders
      </button>

      <h1 className="text-3xl text-[#2C2C2C] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Order Details
      </h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest mb-4">Order Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#8B7D6B]">Order ID:</span> <span className="text-[#2C2C2C] font-mono text-xs">{order.id}</span></div>
            <div><span className="text-[#8B7D6B]">Artwork:</span> <span className="text-[#2C2C2C]">{order.artwork.title}</span></div>
            <div><span className="text-[#8B7D6B]">Type:</span> <span className={`text-xs px-2 py-1 rounded-full ${order.type === 'DIGITAL' ? 'bg-[#3D3B7A]/10 text-[#3D3B7A]' : 'bg-[#7A8C6E]/10 text-[#7A8C6E]'}`}>{order.type}</span></div>
            <div><span className="text-[#8B7D6B]">Status:</span> <span className="text-[#2C2C2C] font-medium">{order.status}</span></div>
            <div><span className="text-[#8B7D6B]">Amount:</span> <span className="text-[#2C2C2C]">{formatPrice(order.amountPaidCents)}</span></div>
            <div><span className="text-[#8B7D6B]">Date:</span> <span className="text-[#2C2C2C]">{new Date(order.createdAt).toLocaleDateString()}</span></div>
            {order.printSize && <div><span className="text-[#8B7D6B]">Print size:</span> <span className="text-[#2C2C2C]">{order.printSize}</span></div>}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest mb-4">Buyer</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-[#8B7D6B]">Name:</span> {order.buyerName || '—'}</p>
            <p><span className="text-[#8B7D6B]">Email:</span> {order.buyerEmail}</p>
          </div>
        </div>

        {order.type === 'PHYSICAL' && (
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest mb-4">Shipping Address</h2>
            <address className="text-sm text-[#2C2C2C] not-italic space-y-1">
              <p>{order.shippingName}</p>
              <p>{order.shippingLine1}</p>
              {order.shippingLine2 && <p>{order.shippingLine2}</p>}
              <p>{order.shippingPostal} {order.shippingCity}</p>
              <p>{order.shippingCountry}</p>
            </address>

            {order.status === 'PAID' && (
              <div className="mt-6 border-t border-[#E8D5B7] pt-6">
                <h3 className="text-sm text-[#8B7D6B] mb-3">Mark as Shipped</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Tracking number"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    className="flex-1 border border-[#E8D5B7] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#7A8C6E]"
                  />
                  <button
                    onClick={markShipped}
                    disabled={loading || !tracking}
                    className="bg-[#7A8C6E] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#627057] transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Saving...' : 'Mark Shipped'}
                  </button>
                </div>
                {msg && <p className="text-sm mt-2 text-[#7A8C6E]">{msg}</p>}
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-4">
                <p className="text-sm text-[#8B7D6B]">Tracking: <span className="text-[#2C2C2C] font-medium">{order.trackingNumber}</span></p>
                {order.shippedAt && <p className="text-xs text-[#8B7D6B]">Shipped: {new Date(order.shippedAt).toLocaleDateString()}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
