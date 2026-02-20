'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#3D3B7A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1
            className="text-3xl text-[#FAF6F0] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            art by ewelina
          </h1>
          <p className="text-[#E8D5B7] text-sm mt-2 tracking-widest">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#FAF6F0] rounded-2xl p-8 space-y-6">
          <h2 className="text-xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Sign In
          </h2>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] focus:outline-none focus:border-[#3D3B7A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] focus:outline-none focus:border-[#3D3B7A] transition-colors"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3D3B7A] text-white py-3 rounded-lg hover:bg-[#2E2C60] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
