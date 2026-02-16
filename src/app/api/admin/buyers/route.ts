import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const buyerSchema = z.object({
  name: z.string().min(1),
  deliveryType: z.enum(['WEBHOOK', 'EMAIL']),
  webhookUrl: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  pricePerLead: z.number().min(0),
  coverage: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const buyers = await prisma.buyer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    })

    return NextResponse.json({ buyers })
  } catch (error) {
    console.error('Admin buyers fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = buyerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Validate delivery type specific fields
    if (data.deliveryType === 'WEBHOOK' && !data.webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL is required for WEBHOOK delivery type' },
        { status: 400 }
      )
    }

    if (data.deliveryType === 'EMAIL' && !data.email) {
      return NextResponse.json(
        { error: 'Email is required for EMAIL delivery type' },
        { status: 400 }
      )
    }

    const buyer = await prisma.buyer.create({
      data: {
        name: data.name,
        deliveryType: data.deliveryType,
        webhookUrl: data.webhookUrl || null,
        email: data.email || null,
        pricePerLead: data.pricePerLead,
        coverage: data.coverage,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({ buyer }, { status: 201 })
  } catch (error) {
    console.error('Admin buyer create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
