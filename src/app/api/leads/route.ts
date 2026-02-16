import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadFormSchema } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendOTPSms } from '@/lib/twilio'
import crypto from 'crypto'

const MIN_FORM_SUBMISSION_TIME = 3000 // 3 seconds minimum

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Rate limit by IP
    const ipLimit = await checkRateLimit(ip, 'ip')
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate form data
    const result = leadFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Anti-bot: honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // Anti-bot: timing check
    if (data.formLoadTime && Date.now() - data.formLoadTime < MIN_FORM_SUBMISSION_TIME) {
      return NextResponse.json(
        { error: 'Form submitted too quickly' },
        { status: 400 }
      )
    }

    // Rate limit by phone
    const phoneLimit = await checkRateLimit(data.phone, 'phone')
    if (!phoneLimit.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests for this phone. Try again in an hour.' },
        { status: 429 }
      )
    }

    // Check for duplicates within 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: data.phone,
        zip: data.zip,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['VERIFIED', 'DELIVERED', 'QUALIFIED_CALL'] },
      },
    })

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || null,
        zip: data.zip,
        city: data.city,
        state: data.state,
        homeowner: data.homeowner,
        issueType: data.issueType,
        urgency: data.urgency,
        utmSource: data.utmSource,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        landingPage: data.landingPage,
        ipHash,
        userAgent,
        consentTimestamp: new Date(),
        consentVersion: '1.0',
        status: existingLead ? 'DUPLICATE' : 'PENDING_OTP',
        duplicateOfLeadId: existingLead?.id || null,
      },
    })

    // If duplicate, return early
    if (existingLead) {
      return NextResponse.json(
        { error: 'A lead with this phone and ZIP already exists', leadId: lead.id },
        { status: 400 }
      )
    }

    // Generate and send OTP
    const otp = generateOTP()
    await storeOTP(data.phone, otp)
    
    const smsSent = await sendOTPSms(data.phone, otp)
    if (!smsSent) {
      return NextResponse.json(
        { error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Verification code sent to your phone',
    })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
