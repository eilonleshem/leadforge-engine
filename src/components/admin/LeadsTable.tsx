'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatPhone } from '@/lib/utils'
import { Lead } from '@prisma/client'

interface LeadsTableProps {
  initialLeads?: Lead[]
}

export function LeadsTable({ initialLeads = [] }: LeadsTableProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [loading, setLoading] = useState(!initialLeads.length)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    zip: '',
    page: 1,
  })

  useEffect(() => {
    if (!initialLeads.length) {
      fetchLeads()
    }
  }, [filters])

  const fetchLeads = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.type) params.set('type', filters.type)
    if (filters.zip) params.set('zip', filters.zip)
    params.set('page', filters.page.toString())

    try {
      const res = await fetch(`/api/admin/leads?${params}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      VERIFIED: 'success',
      QUALIFIED_CALL: 'success',
      DELIVERED: 'success',
      PENDING_OTP: 'warning',
      DUPLICATE: 'error',
      FAILED: 'error',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="PENDING_OTP">Pending OTP</option>
            <option value="VERIFIED">Verified</option>
            <option value="QUALIFIED_CALL">Qualified Call</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DUPLICATE">Duplicate</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="FORM">Form</option>
            <option value="CALL">Call</option>
          </select>
          <input
            type="text"
            placeholder="ZIP Code"
            value={filters.zip}
            onChange={(e) => setFilters({ ...filters, zip: e.target.value, page: 1 })}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => {
              const params = new URLSearchParams()
              Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== 'page') params.set(key, value.toString())
              })
              window.open(`/api/admin/export?${params}`, '_blank')
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">ZIP</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="px-4 py-3">{formatPhone(lead.phone)}</td>
                <td className="px-4 py-3">{lead.zip}</td>
                <td className="px-4 py-3">{lead.type}</td>
                <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-center py-8 text-slate-500">No leads found</div>
        )}
      </div>
    </div>
  )
}
