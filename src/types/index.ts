import { Lead, Call, Buyer, Delivery } from '@prisma/client'

export type LeadWithRelations = Lead & {
  calls?: Call[]
  deliveries?: (Delivery & { buyer: Buyer })[]
}

export interface UTMParams {
  utm_source?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export interface AnalyticsData {
  totalLeads: number
  verifiedLeads: number
  qualifiedCalls: number
  deliveredLeads: number
  estimatedRevenue: number
  leadsByDay: { date: string; count: number }[]
  leadsByStatus: { status: string; count: number }[]
  leadsByType: { type: string; count: number }[]
}

declare module 'next-auth' {
  interface User {
    id: string
  }
  interface Session {
    user: User & {
      id: string
      email: string
    }
  }
}
