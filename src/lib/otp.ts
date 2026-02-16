import { redis } from './redis'
import crypto from 'crypto'

const OTP_TTL_SECONDS = 600 // 10 minutes

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

export async function storeOTP(phone: string, otp: string): Promise<void> {
  const key = `otp:${phone}`
  const hashedOtp = hashOTP(otp)
  await redis.setex(key, OTP_TTL_SECONDS, hashedOtp)
}

export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const key = `otp:${phone}`
  const storedHash = await redis.get<string>(key)
  
  if (!storedHash) return false
  
  const inputHash = hashOTP(otp)
  if (storedHash === inputHash) {
    await redis.del(key)
    return true
  }
  
  return false
}
