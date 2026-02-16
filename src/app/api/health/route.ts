import { NextResponse } from 'next/server'
import packageJson from '../../../../package.json'

/**
 * Health-check endpoint.
 * Returns 200 + JSON payload confirming the app is alive.
 * Use to verify deployment on Vercel.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  })
}
