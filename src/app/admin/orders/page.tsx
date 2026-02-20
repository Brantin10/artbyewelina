import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/stripe'
import Link from 'next/link'

interface OrderWithArtwork {
  id: string; type: string; status: string; amountPaidCents: number
  buyerEmail: string; createdAt: Date
  artwork: { title: string }
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: 'PENDING' } },
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>Orders</h1>
          <p className="text-[#8B7D6B] mt-1">{orders.length} total orders</p>
        </div>
        <a
          href="/api/admin/orders/export"
          className="bg-[#7A8C6E] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#627057] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-[#8B7D6B]">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EEE3]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Artwork</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Type</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Status</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Amount</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Buyer</th>
                  <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order: OrderWithArtwork) => (
                  <tr key={order.id} className="border-b border-[#F5EEE3] hover:bg-[#FAF6F0]">
                    <td className="px-6 py-4 font-medium text-[#2C2C2C]">{order.artwork.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${order.type === 'DIGITAL' ? 'bg-[#3D3B7A]/10 text-[#3D3B7A]' : 'bg-[#7A8C6E]/10 text-[#7A8C6E]'}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'FULFILLED' || order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PAID' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#2C2C2C]">{formatPrice(order.amountPaidCents)}</td>
                    <td className="px-6 py-4 text-[#8B7D6B]">{order.buyerEmail}</td>
                    <td className="px-6 py-4 text-[#8B7D6B]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#C4714A] hover:underline text-xs">
                        View
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
