import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Art by Ewelina — Original Mixed Media Art',
  description:
    'Spiritual, travel-inspired mixed media art by Ewelina. Available as high-resolution digital downloads and printed originals.',
  keywords: ['art', 'mixed media', 'spiritual art', 'travel art', 'prints', 'digital download'],
  openGraph: {
    title: 'Art by Ewelina',
    description: 'Spiritual, travel-inspired mixed media art. Digital downloads & printed originals.',
    type: 'website',
    locale: 'en_EU',
    siteName: 'Art by Ewelina',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
