import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
      include: {
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        alerts: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    const vehiclesWithLocation = vehicles.map(vehicle => ({
      ...vehicle,
      lastLocation: vehicle.locations[0] ? {
        latitude: vehicle.locations[0].latitude,
        longitude: vehicle.locations[0].longitude,
        address: vehicle.locations[0].address,
        timestamp: vehicle.locations[0].timestamp.toISOString()
      } : null,
      unreadAlerts: vehicle.alerts.length
    }))

    return NextResponse.json({ vehicles: vehiclesWithLocation })
  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { name, plate, brand, model, year, color, hasCamera } = await request.json()

    if (!name || !plate) {
      return NextResponse.json(
        { error: 'Nome e placa são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se a placa já existe
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: plate.toUpperCase() }
    })

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Placa já cadastrada' },
        { status: 409 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        plate: plate.toUpperCase(),
        brand,
        model,
        year: year ? parseInt(year) : null,
        color,
        hasCamera: hasCamera || false,
        userId: session.user.id,
        deviceId: `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar veículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}