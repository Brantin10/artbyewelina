import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedGrid } from '@/components/home/FeaturedGrid'
import { AboutTeaser } from '@/components/home/AboutTeaser'

export default async function HomePage() {
  const featured = await prisma.artwork.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <>
      <HeroSection />
      <FeaturedGrid artworks={featured} />
      <AboutTeaser />
    </>
  )
}
