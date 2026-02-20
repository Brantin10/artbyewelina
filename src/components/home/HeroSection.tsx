'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EEE3 40%, #E8D5B7 100%)',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #3D3B7A, transparent)' }} />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #C4714A, transparent)' }} />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #7A8C6E, transparent)' }} />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.3em] text-[#7A8C6E] uppercase mb-6">
          Mixed Media Art
        </p>

        {/* Main heading */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl mb-8 text-[#2C2C2C] leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Art that carries
          <br />
          <span className="text-[#C4714A] italic">a soul</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-[#8B7D6B] max-w-2xl mx-auto mb-10 leading-relaxed">
          Original mixed media pieces inspired by spiritual journeys and travels around the world.
          Available as high-resolution digital downloads or printed originals.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-[#C4714A] text-white px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#A85D38] transition-colors"
          >
            Explore the Collection
          </Link>
          <Link
            href="/about"
            className="border border-[#2C2C2C] text-[#2C2C2C] px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#2C2C2C] hover:text-[#FAF6F0] transition-colors"
          >
            Meet Ewelina
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-[#8B7D6B]">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-[#8B7D6B] animate-pulse" />
        </div>
      </div>

      {/* Hero placeholder image area */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center">
        {/* REPLACE: Add artist portrait or featured artwork here */}
        <div className="w-80 h-96 bg-[#E8D5B7] rounded-l-full flex items-center justify-center text-[#8B7D6B] text-sm text-center px-8">
          [ Artist portrait or<br />featured artwork<br />placeholder ]
        </div>
      </div>
    </section>
  )
}
