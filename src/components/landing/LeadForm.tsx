'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OTPModal } from './OTPModal'
import { useUTM } from '@/hooks/useUTM'

interface LeadFormProps {
  landingPage: string
  onSuccess?: () => void
}

export function LeadForm({ landingPage, onSuccess }: LeadFormProps) {
  const utm = useUTM()
  const [formLoadTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    zip: '',
    city: '',
    state: '',
    homeowner: true,
    issueType: 'STORM' as const,
    urgency: 'THIS_WEEK' as const,
    email: '',
    consent: false,
    utmSource: undefined as string | undefined,
    utmCampaign: undefined as string | undefined,
    utmContent: undefined as string | undefined,
    utmTerm: undefined as string | undefined,
    landingPage: undefined as string | undefined,
    formLoadTime: undefined as number | undefined,
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      utmSource: utm.utm_source,
      utmCampaign: utm.utm_campaign,
      utmContent: utm.utm_content,
      utmTerm: utm.utm_term,
      landingPage,
      formLoadTime,
    }))
  }, [utm, landingPage, formLoadTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          consent: true,
          honeypot: '', // Honeypot field
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details.fieldErrors || {})
        } else {
          setErrors({ submit: data.error || 'Failed to submit form' })
        }
        setIsSubmitting(false)
        return
      }

      setLeadId(data.leadId)
      setPhone(formData.phone || '')
      setShowOTP(true)
      setIsSubmitting(false)
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            error={errors.firstName}
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            error={errors.lastName}
          />
        </div>

        <Input
          label="Phone Number *"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
          required
          error={errors.phone}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="ZIP Code *"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            maxLength={5}
            required
            error={errors.zip}
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={errors.city}
          />
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
            maxLength={2}
            placeholder="CA"
            error={errors.state}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Are you the homeowner? *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.homeowner === true}
                onChange={() => setFormData({ ...formData, homeowner: true })}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.homeowner === false}
                onChange={() => setFormData({ ...formData, homeowner: false })}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Issue Type *
          </label>
          <select
            value={formData.issueType}
            onChange={(e) => setFormData({ ...formData, issueType: e.target.value as any })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          >
            <option value="STORM">Storm Damage</option>
            <option value="LEAK">Leak</option>
            <option value="REPLACE">Replacement</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Urgency *
          </label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            required
          >
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
          </select>
        </div>

        <Input
          label="Email (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent || false}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 mr-2"
            required
          />
          <label htmlFor="consent" className="text-sm text-slate-600">
            By submitting this form, I consent to be contacted by phone, SMS, and email regarding my roofing inquiry. 
            Message and data rates may apply. You are not required to agree as a condition of purchase.
          </label>
        </div>
        {errors.consent && (
          <p className="text-sm text-red-600">{errors.consent}</p>
        )}

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Get Free Quote'}
        </Button>
      </form>

      {showOTP && leadId && (
        <OTPModal
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          phone={phone}
          leadId={leadId}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
