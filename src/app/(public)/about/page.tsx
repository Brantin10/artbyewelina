import Link from 'next/link'

export const metadata = {
  title: 'About — Art by Ewelina',
  description: 'Meet Ewelina — a spiritual, travel-inspired mixed media artist.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#FAF6F0]">
      {/* Hero */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #F5EEE3, #FAF6F0)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-[#7A8C6E] uppercase mb-4">The Artist</p>
          <h1
            className="text-5xl md:text-6xl text-[#2C2C2C] mb-8"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Meet Ewelina
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-20">
          {/* Portrait placeholder */}
          <div>
            {/* REPLACE: Add portrait photo of Ewelina here */}
            <div className="aspect-[3/4] bg-[#E8D5B7] rounded-lg flex items-center justify-center text-[#8B7D6B] text-sm text-center p-8">
              <div>
                <div className="w-20 h-20 border-2 border-[#8B7D6B] rounded-full mx-auto mb-4 flex items-center justify-center opacity-40">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="opacity-60">[ Portrait photo of Ewelina ]</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6 text-[#555] leading-relaxed">
            {/* REPLACE: Ewelina's full bio */}
            <p className="text-xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>
              &ldquo;Art is how I make sense of the world I travel through.&rdquo;
            </p>
            <p>
              Ewelina is a Polish-born mixed media artist currently based wherever the road takes her.
              Her work blends watercolour, ink, acrylic, and found materials into pieces that feel both
              ancient and immediate.
            </p>
            <p>
              {/* REPLACE: Add more of Ewelina's personal story */}
              Her spiritual practice — rooted in mindfulness, astrology, and a deep connection to
              the natural world — infuses every brushstroke with intention. She believes that art
              should feel like something: a memory, an emotion, a breath.
            </p>
            <p>
              {/* REPLACE: Travel background */}
              Over the past several years, she has painted in Morocco, Indonesia, Japan, and across
              Europe — collecting experiences and textures that find their way into her work.
            </p>
            <p>
              {/* REPLACE: What drives her */}
              Each piece she creates is an act of gratitude — for beauty, for travel, for the people
              and places that have shaped her.
            </p>
          </div>
        </div>

        {/* Values section */}
        <div className="border-t border-[#E8D5B7] pt-16 mb-16">
          <h2
            className="text-3xl text-[#2C2C2C] mb-12 text-center"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            What drives the work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✦',
                title: 'Spirituality',
                text: 'A deep belief that art is a spiritual practice — both for the creator and the viewer.',
              },
              {
                icon: '◎',
                title: 'Travel',
                text: 'Every journey leaves its mark. Every place visited lives somewhere in the work.',
              },
              {
                icon: '◈',
                title: 'Intention',
                text: 'Each piece is made with purpose — to evoke feeling, not just to decorate.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-[#F5EEE3] rounded-lg">
                <div className="text-3xl text-[#C4714A] mb-4">{item.icon}</div>
                <h3
                  className="text-xl text-[#2C2C2C] mb-3"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#8B7D6B] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2
            className="text-3xl text-[#2C2C2C] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Bring a piece home
          </h2>
          <p className="text-[#8B7D6B] mb-8">
            Browse the full collection and find a piece that speaks to you.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#C4714A] text-white px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#A85D38] transition-colors"
          >
            View the Collection
          </Link>
        </div>
      </div>
    </div>
  )
}
