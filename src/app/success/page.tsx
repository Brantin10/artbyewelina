import Link from 'next/link'

export const metadata = { title: 'Order Confirmed — Art by Ewelina' }

export default function SuccessPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
      <div className="max-w-xl text-center py-20">
        <div className="text-6xl mb-8 text-[#C4714A]">✦</div>
        <h1
          className="text-4xl md:text-5xl text-[#2C2C2C] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Thank you for your purchase
        </h1>
        <p className="text-[#8B7D6B] text-lg leading-relaxed mb-4">
          Your order is confirmed and I am so grateful you chose to bring this piece into your life.
        </p>
        <div className="bg-[#F5EEE3] rounded-lg p-6 mb-10 text-left space-y-3">
          <div className="flex gap-3">
            <span className="text-[#C4714A]">📧</span>
            <p className="text-sm text-[#555]">
              <strong>Digital download:</strong> Check your email — your secure download link has been sent.
              The link is valid for 72 hours and can be used 3 times.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-[#7A8C6E]">🖼️</span>
            <p className="text-sm text-[#555]">
              <strong>Physical print:</strong> I will personally prepare and ship your order within 3–5
              business days. You will receive a tracking number by email.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-[#C4714A] text-white px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#A85D38] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-[#2C2C2C] text-[#2C2C2C] px-8 py-4 rounded-full text-sm tracking-wide hover:bg-[#2C2C2C] hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
