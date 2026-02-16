import { PrismaClient } from '@prisma/client'

/**
 * Singleton PrismaClient for serverless environments (Vercel).
 *
 * In development the client is stored on `globalThis` so hot-reload
 * doesn't create a new connection every time.
 * In production each serverless function cold-start gets exactly one client.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
