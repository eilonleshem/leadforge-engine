import { z } from 'zod'

export const phoneSchema = z
  .string()
  .regex(/^\+?1?\d{10,11}$/, 'Invalid US phone number')
  .transform((val) => {
    const cleaned = val.replace(/\D/g, '')
    return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`
  })

export const zipSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
  .transform((val) => val.slice(0, 5))

export const leadFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  phone: phoneSchema,
  zip: zipSchema,
  city: z.string().max(100).optional(),
  state: z.string().length(2).optional(),
  homeowner: z.boolean(),
  issueType: z.enum(['STORM', 'LEAK', 'REPLACE', 'OTHER']),
  urgency: z.enum(['TODAY', 'THIS_WEEK', 'THIS_MONTH']),
  email: z.string().email().optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to be contacted' }),
  }),
  // UTM tracking
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  landingPage: z.string().optional(),
  // Anti-fraud
  honeypot: z.string().max(0).optional(),
  formLoadTime: z.number().optional(),
})

export const otpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
  leadId: z.string(),
})

export type LeadFormData = z.infer<typeof leadFormSchema>
export type OTPData = z.infer<typeof otpSchema>
