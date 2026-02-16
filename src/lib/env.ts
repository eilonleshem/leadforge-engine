import { z } from 'zod'

/**
 * Server-side environment variable validation.
 *
 * Validates at runtime (not build time) to avoid breaking Vercel builds
 * when env vars are only set in the Vercel dashboard.
 *
 * Call `getServerEnv()` inside API routes / server components.
 */
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  // Auth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  TWILIO_TRACKING_NUMBER: z.string().optional(),
  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // App
  APP_BASE_URL: z.string().url().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let _cachedEnv: ServerEnv | null = null

/**
 * Returns validated server environment variables.
 * Throws with a descriptive error if required vars are missing.
 */
export function getServerEnv(): ServerEnv {
  if (_cachedEnv) return _cachedEnv

  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    console.error(`❌ Invalid server environment variables:\n${formatted}`)
    throw new Error(`Invalid server environment variables:\n${formatted}`)
  }

  _cachedEnv = parsed.data
  return _cachedEnv
}

/**
 * Safe check for whether the database is configured.
 * Does NOT throw — suitable for conditional logic at the module level.
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

/**
 * Safe check for whether Redis is configured.
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Safe check for whether Twilio is configured.
 */
export function isTwilioConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
}
