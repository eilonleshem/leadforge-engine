import { NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/env'
import { prisma } from '@/lib/prisma'

/**
 * Health-check endpoint.
 * Returns 200 + JSON payload confirming the app is alive.
 * Checks database connectivity if DATABASE_URL is configured.
 */
export async function GET() {
  const health: {
    status: string
    timestamp: string
    version: string
    database?: string
    uptime: number
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  }

  // Check database connection if configured
  if (isDatabaseConfigured()) {
    try {
      await prisma.$queryRaw`SELECT 1`
      health.database = 'connected'
    } catch (error) {
      health.database = 'disconnected'
      health.status = 'degraded'
      return NextResponse.json(health, { status: 503 })
    }
  } else {
    health.database = 'not_configured'
  }

  return NextResponse.json(health)
}
