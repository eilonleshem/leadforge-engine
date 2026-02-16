import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { otpSchema } from '@/lib/validation'
import { verifyOTP } from '@/lib/otp'
import { deliverLead } from '@/lib/delivery'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = otpSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { phone, otp, leadId } = result.data

    // Verify OTP
    const isValid = await verifyOTP(phone, otp)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Update lead status
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'VERIFIED' },
    })

    // Attempt to deliver lead
    await deliverLead(lead)

    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully',
      leadId: lead.id,
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
