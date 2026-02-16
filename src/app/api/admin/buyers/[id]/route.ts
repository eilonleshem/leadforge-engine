import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const buyerUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  deliveryType: z.enum(['WEBHOOK', 'EMAIL']).optional(),
  webhookUrl: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  pricePerLead: z.number().min(0).optional(),
  coverage: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    })

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error('Admin buyer fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = buyerUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Validate delivery type specific fields if deliveryType is being updated
    if (data.deliveryType === 'WEBHOOK' && !data.webhookUrl) {
      const existing = await prisma.buyer.findUnique({
        where: { id: params.id },
      })
      if (!existing?.webhookUrl && !data.webhookUrl) {
        return NextResponse.json(
          { error: 'Webhook URL is required for WEBHOOK delivery type' },
          { status: 400 }
        )
      }
    }

    if (data.deliveryType === 'EMAIL' && !data.email) {
      const existing = await prisma.buyer.findUnique({
        where: { id: params.id },
      })
      if (!existing?.email && !data.email) {
        return NextResponse.json(
          { error: 'Email is required for EMAIL delivery type' },
          { status: 400 }
        )
      }
    }

    const buyer = await prisma.buyer.update({
      where: { id: params.id },
      data: {
        ...data,
        webhookUrl: data.webhookUrl === undefined ? undefined : data.webhookUrl,
        email: data.email === undefined ? undefined : data.email,
      },
    })

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error('Admin buyer update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.buyer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin buyer delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
