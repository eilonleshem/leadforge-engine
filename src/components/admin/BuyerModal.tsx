'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Buyer } from '@prisma/client'

interface BuyerModalProps {
  isOpen: boolean
  onClose: () => void
  buyer?: Buyer | null
}

export function BuyerModal({ isOpen, onClose, buyer }: BuyerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    deliveryType: 'WEBHOOK' as 'WEBHOOK' | 'EMAIL',
    webhookUrl: '',
    email: '',
    pricePerLead: 0,
    coverage: [] as string[],
    isActive: true,
  })
  const [coverageInput, setCoverageInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (buyer) {
      setFormData({
        name: buyer.name,
        deliveryType: buyer.deliveryType,
        webhookUrl: buyer.webhookUrl || '',
        email: buyer.email || '',
        pricePerLead: buyer.pricePerLead,
        coverage: (buyer.coverage as string[]) || [],
        isActive: buyer.isActive,
      })
    } else {
      setFormData({
        name: '',
        deliveryType: 'WEBHOOK',
        webhookUrl: '',
        email: '',
        pricePerLead: 0,
        coverage: [],
        isActive: true,
      })
    }
    setCoverageInput('')
    setError('')
  }, [buyer, isOpen])

  const handleAddCoverage = () => {
    if (coverageInput.trim()) {
      setFormData({
        ...formData,
        coverage: [...formData.coverage, coverageInput.trim()],
      })
      setCoverageInput('')
    }
  }

  const handleRemoveCoverage = (index: number) => {
    setFormData({
      ...formData,
      coverage: formData.coverage.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const url = buyer ? `/api/admin/buyers/${buyer.id}` : '/api/admin/buyers'
      const method = buyer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save buyer')
        setIsSubmitting(false)
        return
      }

      onClose()
    } catch (error) {
      setError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={buyer ? 'Edit Buyer' : 'Add Buyer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Type *
          </label>
          <select
            value={formData.deliveryType}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryType: e.target.value as 'WEBHOOK' | 'EMAIL',
              })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            required
          >
            <option value="WEBHOOK">Webhook</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>

        {formData.deliveryType === 'WEBHOOK' ? (
          <Input
            label="Webhook URL *"
            type="url"
            value={formData.webhookUrl}
            onChange={(e) =>
              setFormData({ ...formData, webhookUrl: e.target.value })
            }
            required
          />
        ) : (
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        )}

        <Input
          label="Price Per Lead *"
          type="number"
          step="0.01"
          min="0"
          value={formData.pricePerLead}
          onChange={(e) =>
            setFormData({
              ...formData,
              pricePerLead: parseFloat(e.target.value) || 0,
            })
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Coverage (ZIP codes or State codes, one per line)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={coverageInput}
              onChange={(e) => setCoverageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCoverage())}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="Enter ZIP or State code"
            />
            <Button type="button" onClick={handleAddCoverage}>
              Add
            </Button>
          </div>
          {formData.coverage.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.coverage.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveCoverage(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Leave empty to accept all leads
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm text-slate-700">
            Active
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : buyer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
