import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deliverLead } from '@/lib/delivery'

const QUALIFIED_CALL_DURATION = 60 // seconds

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const callStatus = formData.get('CallStatus') as string
    const callDuration = formData.get('CallDuration') as string
    const recordingUrl = formData.get('RecordingUrl') as string | null

    // Update call record
    const call = await prisma.call.update({
      where: { sid: callSid },
      data: {
        duration: parseInt(callDuration || '0', 10),
        status: callStatus,
        recordingUrl: recordingUrl || null,
      },
    })

    // If call is completed and duration >= 60 seconds, create qualified lead
    if (
      callStatus === 'completed' &&
      parseInt(callDuration || '0', 10) >= QUALIFIED_CALL_DURATION
    ) {
      // Check if lead already exists for this call
      let lead = await prisma.lead.findFirst({
        where: { calls: { some: { sid: callSid } } },
      })

      if (!lead) {
        // Create new lead from call
        lead = await prisma.lead.create({
          data: {
            type: 'CALL',
            status: 'QUALIFIED_CALL',
            firstName: 'Call',
            lastName: 'Lead',
            phone: call.fromNumber,
            zip: '00000', // Unknown ZIP for call leads
            homeowner: true,
            utmSource: call.utmSource,
            utmCampaign: call.utmCampaign,
            utmContent: call.utmContent,
            utmTerm: call.utmTerm,
            campaignId: call.campaignId,
            landingPage: 'call-tracking',
            consentTimestamp: new Date(),
            consentVersion: '1.0',
          },
        })

        // Link call to lead
        await prisma.call.update({
          where: { id: call.id },
          data: { leadId: lead.id },
        })
      } else {
        // Update existing lead status
        await prisma.lead.update({
          where: { id: lead.id },
          data: { status: 'QUALIFIED_CALL' },
        })
      }

      // Attempt to deliver lead
      await deliverLead(lead)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Twilio status webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
