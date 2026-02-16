import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { prisma } from '@/lib/prisma'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fromNumber = formData.get('From') as string
    const toNumber = formData.get('To') as string
    const callSid = formData.get('CallSid') as string
    const campaignId = formData.get('cid') as string | null
    const utmSource = formData.get('utm_source') as string | null
    const utmCampaign = formData.get('utm_campaign') as string | null
    const utmContent = formData.get('utm_content') as string | null
    const utmTerm = formData.get('utm_term') as string | null

    // Store call record
    await prisma.call.create({
      data: {
        sid: callSid,
        fromNumber,
        toNumber,
        duration: 0,
        status: 'ringing',
        campaignId: campaignId || null,
        utmSource: utmSource || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmTerm: utmTerm || null,
      },
    })

    // Create TwiML response
    const response = new VoiceResponse()

    // For now, forward to a placeholder number or IVR
    // In production, this would forward to buyer's number or IVR system
    const trackingNumber = process.env.TWILIO_TRACKING_NUMBER
    if (trackingNumber) {
      response.dial(trackingNumber)
    } else {
      response.say('Thank you for calling. Please hold while we connect you.')
      response.pause({ length: 5 })
      response.say('If you are calling about a roofing issue, please call back during business hours.')
    }

    // Return TwiML
    return new NextResponse(response.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  } catch (error) {
    console.error('Twilio voice webhook error:', error)
    const response = new VoiceResponse()
    response.say('We are experiencing technical difficulties. Please try again later.')
    return new NextResponse(response.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}
