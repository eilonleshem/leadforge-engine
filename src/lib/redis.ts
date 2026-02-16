import { Redis } from '@upstash/redis'

/**
 * Lazy-initialized Redis client.
 * Doesn't crash at import time if env vars are missing,
 * only when actually used.
 */
function createRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.warn('⚠ Upstash Redis credentials are missing. Redis features will not work.')
    // Return a mock-like Redis that will throw on use
    return new Proxy({} as Redis, {
      get(_, prop) {
        if (typeof prop === 'string') {
          return (..._args: unknown[]) => {
            throw new Error(`Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.`)
          }
        }
      },
    })
  }

  return new Redis({ url, token })
}

export const redis = createRedis()
