import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = subDays(new Date(), days)

    // Total leads
    const totalLeads = await prisma.lead.count({
      where: { createdAt: { gte: startDate } },
    })

    // Verified leads
    const verifiedLeads = await prisma.lead.count({
      where: {
        createdAt: { gte: startDate },
        status: 'VERIFIED',
      },
    })

    // Qualified calls
    const qualifiedCalls = await prisma.lead.count({
      where: {
        createdAt: { gte: startDate },
        status: 'QUALIFIED_CALL',
      },
    })

    // Delivered leads
    const deliveredLeads = await prisma.lead.count({
      where: {
        createdAt: { gte: startDate },
        status: 'DELIVERED',
      },
    })

    // Estimated revenue (sum of pricePerLead for delivered leads)
    const deliveries = await prisma.delivery.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'SENT',
      },
      include: { buyer: true },
    })

    const estimatedRevenue = deliveries.reduce(
      (sum, delivery) => sum + delivery.buyer.pricePerLead,
      0
    )

    // Leads by day — use Prisma column name "createdAt" (quoted for Postgres)
    const leadsByDay = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "Lead"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // Leads by status
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    })

    // Leads by type
    const leadsByType = await prisma.lead.groupBy({
      by: ['type'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    })

    return NextResponse.json({
      totalLeads,
      verifiedLeads,
      qualifiedCalls,
      deliveredLeads,
      estimatedRevenue,
      leadsByDay: leadsByDay.map((item) => ({
        date: format(new Date(item.date), 'yyyy-MM-dd'),
        count: Number(item.count),
      })),
      leadsByStatus: leadsByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      leadsByType: leadsByType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    })
  } catch (error) {
    console.error('Admin analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
