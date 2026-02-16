import twilio from 'twilio'

/**
 * Lazy-initialized Twilio client.
 * Doesn't crash at import time if env vars are missing.
 */
function createTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    console.warn('⚠ Twilio credentials are missing. SMS/call features will not work.')
    return null
  }

  return twilio(accountSid, authToken)
}

export const twilioClient = createTwilioClient()

export async function sendOTPSms(to: string, otp: string): Promise<boolean> {
  const fromNumber = process.env.TWILIO_FROM_NUMBER

  if (!twilioClient || !fromNumber) {
    console.error('Twilio not configured. Cannot send SMS.')
    return false
  }

  try {
    await twilioClient.messages.create({
      body: `Your LeadForge verification code is: ${otp}. Expires in 10 minutes.`,
      from: fromNumber,
      to,
    })
    return true
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return false
  }
}

export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) return false
  return twilio.validateRequest(authToken, signature, url, params)
}
