import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const isRead = searchParams.get('isRead')

    const alerts = await prisma.alert.findMany({
      where: {
        vehicle: { userId: session.user.id },
        ...(vehicleId && { vehicleId }),
        ...(isRead !== null && { isRead: isRead === 'true' })
      },
      include: {
        vehicle: {
          select: { name: true, plate: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      vehicleId,
      type,
      message,
      severity = 'MEDIUM',
      latitude,
      longitude,
      metadata
    } = await request.json()

    if (!vehicleId || !type || !message) {
      return NextResponse.json(
        { error: 'VehicleId, type e message são obrigatórios' },
        { status: 400 }
      )
    }

    const alert = await prisma.alert.create({
      data: {
        vehicleId,
        type,
        message,
        severity,
        latitude,
        longitude,
        metadata
      }
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar alerta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}