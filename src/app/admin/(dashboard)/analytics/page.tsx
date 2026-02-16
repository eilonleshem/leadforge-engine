'use client'

import { StatsCards } from '@/components/admin/StatsCards'

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <StatsCards />
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <p className="text-slate-600">
          Detailed analytics and charts coming soon. Currently showing 30-day summary statistics.
        </p>
      </div>
    </div>
  )
}
