'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF6F0]/90 backdrop-blur-sm border-b border-[#E8D5B7]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair)] text-xl text-[#3D3B7A] tracking-widest uppercase"
        >
          art by ewelina
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A] transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A] transition-colors">
            Contact
          </Link>
          <Link
            href="/shop"
            className="bg-[#C4714A] text-white text-sm px-5 py-2 rounded-full hover:bg-[#A85D38] transition-colors tracking-wide"
          >
            View Collection
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#2C2C2C] transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#2C2C2C] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#2C2C2C] transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#FAF6F0] border-t border-[#E8D5B7] px-6 py-6 flex flex-col gap-4">
          <Link href="/shop" onClick={() => setOpen(false)} className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A]">Shop</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A]">About</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-sm tracking-wide text-[#2C2C2C] hover:text-[#C4714A]">Contact</Link>
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="bg-[#C4714A] text-white text-sm px-5 py-2.5 rounded-full text-center hover:bg-[#A85D38] transition-colors"
          >
            View Collection
          </Link>
        </div>
      )}
    </header>
  )
}
