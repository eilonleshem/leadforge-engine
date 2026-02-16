import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'
import { isRedisConfigured } from './env'

/**
 * Lazy-initialized rate limiters.
 * In environments where Redis is not configured (e.g. during build or
 * when Upstash creds are missing), rate limiting is a no-op.
 */

let _ipRateLimiter: Ratelimit | null = null
let _phoneRateLimiter: Ratelimit | null = null

function getIpRateLimiter(): Ratelimit | null {
  if (!isRedisConfigured()) return null
  if (!_ipRateLimiter) {
    _ipRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      prefix: 'ratelimit:ip',
    })
  }
  return _ipRateLimiter
}

function getPhoneRateLimiter(): Ratelimit | null {
  if (!isRedisConfigured()) return null
  if (!_phoneRateLimiter) {
    _phoneRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'ratelimit:phone',
    })
  }
  return _phoneRateLimiter
}

export async function checkRateLimit(
  identifier: string,
  type: 'ip' | 'phone'
): Promise<{ success: boolean; remaining: number }> {
  const limiter = type === 'ip' ? getIpRateLimiter() : getPhoneRateLimiter()

  // If Redis is not configured, allow all requests (dev / build)
  if (!limiter) {
    return { success: true, remaining: 99 }
  }

  const result = await limiter.limit(identifier)
  return { success: result.success, remaining: result.remaining }
}
