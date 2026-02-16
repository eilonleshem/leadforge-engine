'use client'

import { Phone } from 'lucide-react'
import { useUTM } from '@/hooks/useUTM'

interface StickyCallButtonProps {
  campaignId?: string
  trackingNumber?: string
}

/**
 * Mobile-only sticky Call Now button.
 * `trackingNumber` is passed from the server component (landing page)
 * to avoid accessing server env vars in client code.
 */
export function StickyCallButton({ campaignId, trackingNumber }: StickyCallButtonProps) {
  const utm = useUTM()

  // Use NEXT_PUBLIC_ env var as fallback (safe for client bundle)
  const phoneNumber = trackingNumber || process.env.NEXT_PUBLIC_TRACKING_NUMBER || ''

  if (!phoneNumber) return null

  const buildCallUrl = () => {
    const params = new URLSearchParams()
    if (campaignId) params.set('cid', campaignId)
    if (utm.utm_source) params.set('utm_source', utm.utm_source)
    if (utm.utm_campaign) params.set('utm_campaign', utm.utm_campaign)
    if (utm.utm_content) params.set('utm_content', utm.utm_content)
    if (utm.utm_term) params.set('utm_term', utm.utm_term)

    return `tel:${phoneNumber}${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <a
      href={buildCallUrl()}
      className="fixed bottom-4 right-4 md:hidden z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
    >
      <Phone className="w-5 h-5" />
      <span className="font-semibold">Call Now</span>
    </a>
  )
}
