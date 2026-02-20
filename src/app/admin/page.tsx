import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/stripe'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [totalOrders, pendingPhysical, totalRevenue, artworkCount] = await Promise.all([
    prisma.order.count({ where: { status: { not: 'PENDING' } } }),
    prisma.order.count({ where: { type: 'PHYSICAL', status: 'PAID' } }),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'FULFILLED', 'SHIPPED'] } },
      _sum: { amountPaidCents: true },
    }),
    prisma.artwork.count({ where: { isPublished: true } }),
  ])

  const recentOrders = await prisma.order.findMany({
    where: { status: { not: 'PENDING' } },
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    { label: 'Total Orders', value: totalOrders, color: '#3D3B7A' },
    { label: 'Pending Shipments', value: pendingPhysical, color: '#C4714A', urgent: pendingPhysical > 0 },
    { label: 'Total Revenue', value: formatPrice(totalRevenue._sum.amountPaidCents || 0), color: '#7A8C6E' },
    { label: 'Published Artworks', value: artworkCount, color: '#3D3B7A' },
  ]

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>
          Dashboard
        </h1>
        <p className="text-[#8B7D6B] mt-1">Welcome back, Ewelina.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl p-6 border-l-4 ${stat.urgent ? 'border-[#C4714A]' : 'border-transparent'}`}
          >
            <p className="text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">{stat.label}</p>
            <p className="text-3xl font-semibold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            {stat.urgent && (
              <p className="text-xs text-[#C4714A] mt-1">Requires action</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link href="/admin/artworks/new" className="bg-[#3D3B7A] text-[#FAF6F0] rounded-xl p-6 hover:bg-[#2E2C60] transition-colors">
          <div className="text-2xl mb-3">✦</div>
          <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Add New Artwork</h3>
          <p className="text-sm text-[#E8D5B7]">Upload a new painting to the shop</p>
        </Link>
        <Link href="/admin/orders?filter=PHYSICAL" className="bg-[#C4714A] text-white rounded-xl p-6 hover:bg-[#A85D38] transition-colors">
          <div className="text-2xl mb-3">📦</div>
          <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Ship Pending Orders</h3>
          <p className="text-sm text-white/80">
            {pendingPhysical} order{pendingPhysical !== 1 ? 's' : ''} awaiting shipment
          </p>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D5B7]">
          <h2 className="text-lg text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-sm text-[#C4714A] hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-[#8B7D6B]">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EEE3]">
              <tr>
                <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Artwork</th>
                <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Type</th>
                <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Amount</th>
                <th className="text-left px-6 py-3 text-xs text-[#8B7D6B] uppercase tracking-widest">Buyer</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#F5EEE3] hover:bg-[#FAF6F0]">
                  <td className="px-6 py-4 text-[#2C2C2C] font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-[#C4714A]">
                      {order.artwork.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${order.type === 'DIGITAL' ? 'bg-[#3D3B7A]/10 text-[#3D3B7A]' : 'bg-[#7A8C6E]/10 text-[#7A8C6E]'}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'FULFILLED' || order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' : order.status === 'PAID' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#2C2C2C]">{formatPrice(order.amountPaidCents)}</td>
                  <td className="px-6 py-4 text-[#8B7D6B]">{order.buyerEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
