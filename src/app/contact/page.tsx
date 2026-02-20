'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-24 min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[#7A8C6E] uppercase mb-4">Get in Touch</p>
          <h1
            className="text-5xl text-[#2C2C2C] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Say Hello
          </h1>
          <p className="text-[#8B7D6B] leading-relaxed">
            Questions about a piece, custom commissions, or just want to connect — I&apos;d love to hear from you.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-6">✦</div>
            <h2 className="text-2xl text-[#2C2C2C] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Thank you for reaching out
            </h2>
            <p className="text-[#8B7D6B]">
              I&apos;ll be in touch soon. In the meantime, feel free to browse the collection.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Smith"
                className="w-full bg-white border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] placeholder-[#C5B8A8] focus:outline-none focus:border-[#C4714A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className="w-full bg-white border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] placeholder-[#C5B8A8] focus:outline-none focus:border-[#C4714A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me what's on your mind..."
                className="w-full bg-white border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] placeholder-[#C5B8A8] focus:outline-none focus:border-[#C4714A] transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#C4714A] text-white py-4 rounded-full text-sm tracking-wide hover:bg-[#A85D38] transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
