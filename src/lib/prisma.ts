import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
  const raw = process.env.DATABASE_URL || ''
  const connectionString = raw
    .replace(/[?&]sslmode=require/g, '')
    .replace(/[?&]channel_binding=require/g, '')
  const ssl = raw.includes('neon.tech') || raw.includes('sslmode=require')
  const adapter = new PrismaPg({ connectionString, ssl })
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
