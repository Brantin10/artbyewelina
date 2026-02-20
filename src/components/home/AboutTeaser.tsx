import Link from 'next/link'

export function AboutTeaser() {
  return (
    <section className="py-24 px-6" style={{ background: '#3D3B7A' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] text-[#E8D5B7] uppercase mb-6">The Artist</p>
        <h2
          className="text-4xl md:text-5xl text-[#FAF6F0] mb-8 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Art born from wandering,<br />
          <span className="text-[#E8D5B7] italic">made from the soul</span>
        </h2>
        <p className="text-[#E8D5B7] text-lg leading-relaxed max-w-2xl mx-auto mb-4">
          {/* REPLACE: Ewelina's short bio */}
          Ewelina is a mixed media artist whose work is shaped by spiritual practice and a life spent in motion.
          From the temples of Asia to the markets of Morocco, each journey leaves its mark on her canvas.
        </p>
        <p className="text-[#E8D5B7] text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          Her art is an invitation — to slow down, to feel, to remember what matters.
        </p>
        <Link
          href="/about"
          className="inline-block bg-[#E8D5B7] text-[#3D3B7A] px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#FAF6F0] transition-colors"
        >
          Read Ewelina&apos;s Story
        </Link>
      </div>
    </section>
  )
}
