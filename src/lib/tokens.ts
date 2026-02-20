import { randomBytes } from 'crypto'
import { prisma } from './prisma'

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createDownloadToken(orderId: string) {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours

  return prisma.downloadToken.create({
    data: { token, orderId, expiresAt, maxDownloads: 3 },
  })
}

export async function validateToken(token: string) {
  const record = await prisma.downloadToken.findUnique({
    where: { token },
    include: { order: { include: { artwork: true } } },
  })

  if (!record) return { valid: false, reason: 'Token not found' }
  if (record.isRevoked) return { valid: false, reason: 'Token has been revoked' }
  if (record.expiresAt < new Date()) return { valid: false, reason: 'Token has expired' }
  if (record.downloadCount >= record.maxDownloads)
    return { valid: false, reason: 'Download limit reached' }

  return { valid: true, record }
}
