'use client'

import { useEffect, useState } from 'react'
import { Users, CheckCircle, Phone, DollarSign } from 'lucide-react'

interface Stats {
  totalLeads: number
  verifiedLeads: number
  qualifiedCalls: number
  deliveredLeads: number
  estimatedRevenue: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    verifiedLeads: 0,
    qualifiedCalls: 0,
    deliveredLeads: 0,
    estimatedRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalLeads: data.totalLeads || 0,
          verifiedLeads: data.verifiedLeads || 0,
          qualifiedCalls: data.qualifiedCalls || 0,
          deliveredLeads: data.deliveredLeads || 0,
          estimatedRevenue: data.estimatedRevenue || 0,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const cards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Verified Leads',
      value: stats.verifiedLeads,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Qualified Calls',
      value: stats.qualifiedCalls,
      icon: Phone,
      color: 'bg-purple-500',
    },
    {
      title: 'Estimated Revenue',
      value: `$${stats.estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-primary-500',
    },
  ]

  if (loading) {
    return <div className="text-center py-8">Loading stats...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
