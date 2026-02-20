'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/orders', label: 'Orders', icon: '◎' },
  { href: '/admin/artworks', label: 'Artworks', icon: '✦' },
]

export function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-[#3D3B7A] flex flex-col">
      <div className="p-6 border-b border-[#E8D5B7]/20">
        <h2
          className="text-[#FAF6F0] text-lg tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          art by ewelina
        </h2>
        <p className="text-[#E8D5B7] text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = item.href === '/admin' ? path === '/admin' : path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#FAF6F0]/15 text-[#FAF6F0]'
                  : 'text-[#E8D5B7] hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#E8D5B7]/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-[#E8D5B7] hover:text-[#FAF6F0] text-sm transition-colors mb-1"
        >
          <span>↗</span> View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 text-[#E8D5B7] hover:text-[#FAF6F0] text-sm transition-colors w-full text-left"
        >
          <span>→</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
