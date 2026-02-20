import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = (process.env.DATABASE_URL || '').replace('?sslmode=require', '').replace('&sslmode=require', '').replace('?channel_binding=require', '').replace('&channel_binding=require', '')
const adapter = new PrismaPg({ connectionString, ssl: true })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@artbyewelina.com'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: 'Ewelina' },
  })

  // Seed placeholder artworks
  const artworks = [
    {
      slug: 'mystic-horizon',
      title: 'Mystic Horizon',
      description: 'A journey into the unknown, where sky meets earth in a dance of light and shadow.',
      story: 'This piece was inspired by a sunrise in the Sahara desert, where the world felt both infinite and intimate.',
      medium: 'Watercolour & Ink on Paper',
      year: 2024,
      imageUrl: '',
      hasDigital: true,
      hasPhysical: true,
      digitalPriceCents: 3500,
      physicalPriceCents: 9500,
      printSizes: JSON.stringify([
        { label: 'A4', widthCm: 21, heightCm: 29.7 },
        { label: 'A3', widthCm: 29.7, heightCm: 42 },
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'wandering-soul',
      title: 'Wandering Soul',
      description: 'Every road leads somewhere. Every journey begins with a single step into the unknown.',
      story: 'Created during a month of travel through Southeast Asia, this piece captures the restless spirit of exploration.',
      medium: 'Mixed Media on Canvas',
      year: 2024,
      imageUrl: '',
      hasDigital: true,
      hasPhysical: true,
      digitalPriceCents: 4500,
      physicalPriceCents: 12000,
      printSizes: JSON.stringify([
        { label: 'A4', widthCm: 21, heightCm: 29.7 },
        { label: 'A3', widthCm: 29.7, heightCm: 42 },
        { label: 'A2', widthCm: 42, heightCm: 59.4 },
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'celestial-garden',
      title: 'Celestial Garden',
      description: 'Where flowers bloom in moonlight and stars grow like seeds in the cosmic soil.',
      medium: 'Acrylic & Gold Leaf',
      year: 2025,
      imageUrl: '',
      hasDigital: true,
      hasPhysical: true,
      digitalPriceCents: 5500,
      physicalPriceCents: 15000,
      printSizes: JSON.stringify([
        { label: 'A4', widthCm: 21, heightCm: 29.7 },
        { label: 'A3', widthCm: 29.7, heightCm: 42 },
        { label: 'A2', widthCm: 42, heightCm: 59.4 },
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'sacred-waters',
      title: 'Sacred Waters',
      description: 'The river remembers every stone it has touched, every shore it has kissed.',
      medium: 'Watercolour on Paper',
      year: 2025,
      imageUrl: '',
      hasDigital: true,
      hasPhysical: false,
      digitalPriceCents: 2800,
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'golden-hour',
      title: 'Golden Hour',
      description: 'That magical moment when everything is bathed in amber light and the world holds its breath.',
      medium: 'Oil on Canvas',
      year: 2025,
      imageUrl: '',
      hasDigital: false,
      hasPhysical: true,
      physicalPriceCents: 18000,
      printSizes: JSON.stringify([
        { label: 'A3', widthCm: 29.7, heightCm: 42 },
        { label: 'A2', widthCm: 42, heightCm: 59.4 },
        { label: 'A1', widthCm: 59.4, heightCm: 84.1 },
      ]),
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'spirit-of-the-east',
      title: 'Spirit of the East',
      description: 'Ancient wisdom meets modern longing in this exploration of spiritual heritage.',
      medium: 'Ink & Watercolour',
      year: 2025,
      imageUrl: '',
      hasDigital: true,
      hasPhysical: true,
      digitalPriceCents: 4000,
      physicalPriceCents: 11000,
      printSizes: JSON.stringify([
        { label: 'A4', widthCm: 21, heightCm: 29.7 },
        { label: 'A3', widthCm: 29.7, heightCm: 42 },
      ]),
      isFeatured: false,
      isPublished: true,
    },
  ]

  for (const artwork of artworks) {
    await prisma.artwork.upsert({
      where: { slug: artwork.slug },
      update: {},
      create: artwork,
    })
  }

  console.log('✅ Seed complete')
  console.log(`   Admin: ${email} / ${password}`)
  console.log(`   Artworks: ${artworks.length} placeholder artworks created`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
