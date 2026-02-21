import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function createPrismaClient() {
  // Use unpooled for migrations/transactions; fall back to pooler for normal queries
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''

  // Strip params that cause issues — we pass SSL via pool config instead
  const cleanUrl = connectionString
    .replace(/[?&]sslmode=\w+/g, '')
    .replace(/[?&]channel_binding=\w+/g, '')
    .replace(/\?$/, '')
    .replace(/\?&/, '?')

  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 10000,
    max: 3,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
