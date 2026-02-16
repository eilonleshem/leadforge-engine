import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    if (status) where.status = status
    if (type) where.type = type
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = [
      'ID',
      'Created At',
      'Type',
      'Status',
      'First Name',
      'Last Name',
      'Phone',
      'Email',
      'ZIP',
      'City',
      'State',
      'Homeowner',
      'Issue Type',
      'Urgency',
      'UTM Source',
      'UTM Campaign',
      'Landing Page',
    ]

    const rows = leads.map((lead) => [
      lead.id,
      lead.createdAt.toISOString(),
      lead.type,
      lead.status,
      lead.firstName,
      lead.lastName,
      lead.phone,
      lead.email || '',
      lead.zip,
      lead.city || '',
      lead.state || '',
      lead.homeowner ? 'Yes' : 'No',
      lead.issueType || '',
      lead.urgency || '',
      lead.utmSource || '',
      lead.utmCampaign || '',
      lead.landingPage || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Admin export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
