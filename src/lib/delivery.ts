import { prisma } from './prisma'
import { Lead, Buyer, DeliveryStatus } from '@prisma/client'

interface LeadPayload {
  leadId: string
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  zip: string
  city?: string | null
  state?: string | null
  homeowner: boolean
  issueType?: string | null
  urgency?: string | null
  type: string
  createdAt: Date
  utmSource?: string | null
  utmCampaign?: string | null
  landingPage?: string | null
}

export async function findMatchingBuyer(lead: Lead): Promise<Buyer | null> {
  const buyers = await prisma.buyer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }, // First buyer first
  })

  for (const buyer of buyers) {
    const coverage = buyer.coverage as string[]
    
    // If no coverage specified, accept all
    if (coverage.length === 0) {
      return buyer
    }
    
    // Check if ZIP or state matches coverage
    if (
      coverage.includes(lead.zip) ||
      (lead.state && coverage.includes(lead.state))
    ) {
      return buyer
    }
  }
  
  return null
}

export async function deliverLead(lead: Lead): Promise<boolean> {
  const buyer = await findMatchingBuyer(lead)
  
  if (!buyer) {
    console.log(`No matching buyer for lead ${lead.id}`)
    return false
  }

  const payload: LeadPayload = {
    leadId: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    phone: lead.phone,
    email: lead.email,
    zip: lead.zip,
    city: lead.city,
    state: lead.state,
    homeowner: lead.homeowner,
    issueType: lead.issueType,
    urgency: lead.urgency,
    type: lead.type,
    createdAt: lead.createdAt,
    utmSource: lead.utmSource,
    utmCampaign: lead.utmCampaign,
    landingPage: lead.landingPage,
  }

  let status: DeliveryStatus = 'PENDING'
  let responseCode: number | null = null
  let responseBody: string | null = null

  try {
    if (buyer.deliveryType === 'WEBHOOK' && buyer.webhookUrl) {
      const response = await fetch(buyer.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
      
      responseCode = response.status
      responseBody = await response.text().catch(() => 'Unable to read response')
      status = response.ok ? 'SENT' : 'FAILED'
    } else if (buyer.deliveryType === 'EMAIL' && buyer.email) {
      // Placeholder for email delivery - in production, use Resend or similar
      console.log(`Would send email to ${buyer.email} with lead ${lead.id}`)
      // TODO: Implement email delivery
      status = 'SENT'
    }
  } catch (error) {
    status = 'FAILED'
    responseBody = error instanceof Error ? error.message : 'Unknown error'
  }

  // Record delivery attempt
  await prisma.delivery.create({
    data: {
      leadId: lead.id,
      buyerId: buyer.id,
      status,
      responseCode,
      responseBody,
    },
  })

  // Update lead status
  if (status === 'SENT') {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'DELIVERED' },
    })
  } else if (status === 'FAILED') {
    // Retry once after 5 minutes (could be implemented with a queue)
    // For now, just mark as failed
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'FAILED' },
    })
  }

  return status === 'SENT'
}
