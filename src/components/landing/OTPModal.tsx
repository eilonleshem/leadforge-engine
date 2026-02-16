'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  phone: string
  leadId: string
  onSuccess?: () => void
}

export function OTPModal({ isOpen, onClose, phone, leadId, onSuccess }: OTPModalProps) {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/leads/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, leadId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        setIsVerifying(false)
        return
      }

      onSuccess?.()
      onClose()
      // Show success message or redirect
      alert('Phone verified successfully! We will contact you soon.')
    } catch (error) {
      setError('Network error. Please try again.')
      setIsVerifying(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Phone">
      <div className="space-y-4">
        <p className="text-slate-600">
          We sent a verification code to <strong>{phone}</strong>. 
          Please enter the 6-digit code below.
        </p>

        <Input
          label="Verification Code"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            setError('')
          }}
          placeholder="000000"
          maxLength={6}
          error={error}
          autoFocus
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            className="flex-1"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
