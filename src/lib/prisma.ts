import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
  const raw = process.env.DATABASE_URL || ''
  // PrismaPg does not support sslmode/channel_binding URL params — strip them
  const connectionString = raw
    .replace(/[?&]sslmode=[^&]*/g, '')
    .replace(/[?&]channel_binding=[^&]*/g, '')
    // Clean up trailing ? or & if params were the only ones
    .replace(/[?&]$/, '')
  const useSSL = raw.includes('neon.tech') || raw.includes('sslmode=require')
  const adapter = new PrismaPg({
    connectionString,
    ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  })
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
