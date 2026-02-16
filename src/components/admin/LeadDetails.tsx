'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatPhone } from '@/lib/utils'
import { LeadWithRelations } from '@/types'

interface LeadDetailsProps {
  leadId: string
}

export function LeadDetails({ leadId }: LeadDetailsProps) {
  const [lead, setLead] = useState<LeadWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/leads/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data.lead)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [leadId])

  if (loading) {
    return <div className="text-center py-8">Loading lead details...</div>
  }

  if (!lead) {
    return <div className="text-center py-8">Lead not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Lead Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Name</p>
            <p className="font-semibold">{lead.firstName} {lead.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Phone</p>
            <p className="font-semibold">{formatPhone(lead.phone)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Email</p>
            <p className="font-semibold">{lead.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">ZIP Code</p>
            <p className="font-semibold">{lead.zip}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">City/State</p>
            <p className="font-semibold">
              {lead.city || 'N/A'}, {lead.state || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Homeowner</p>
            <p className="font-semibold">{lead.homeowner ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Issue Type</p>
            <p className="font-semibold">{lead.issueType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Urgency</p>
            <p className="font-semibold">{lead.urgency || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Type</p>
            <Badge>{lead.type}</Badge>
          </div>
          <div>
            <p className="text-sm text-slate-600">Status</p>
            <Badge variant={lead.status === 'VERIFIED' ? 'success' : 'warning'}>
              {lead.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-600">Created At</p>
            <p className="font-semibold">{formatDate(lead.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Landing Page</p>
            <p className="font-semibold">{lead.landingPage || 'N/A'}</p>
          </div>
        </div>
      </div>

      {(lead.utmSource || lead.utmCampaign) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">UTM Tracking</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">UTM Source</p>
              <p className="font-semibold">{lead.utmSource || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">UTM Campaign</p>
              <p className="font-semibold">{lead.utmCampaign || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">UTM Content</p>
              <p className="font-semibold">{lead.utmContent || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">UTM Term</p>
              <p className="font-semibold">{lead.utmTerm || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {lead.deliveries && lead.deliveries.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Delivery History</h3>
          <div className="space-y-4">
            {lead.deliveries.map((delivery) => (
              <div key={delivery.id} className="border-l-4 border-primary-500 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{delivery.buyer.name}</p>
                    <p className="text-sm text-slate-600">
                      {formatDate(delivery.createdAt)} - Attempt {delivery.attempt}
                    </p>
                  </div>
                  <Badge
                    variant={
                      delivery.status === 'SENT' ? 'success' : 'error'
                    }
                  >
                    {delivery.status}
                  </Badge>
                </div>
                {delivery.responseCode && (
                  <p className="text-sm text-slate-600 mt-1">
                    Response: {delivery.responseCode}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
