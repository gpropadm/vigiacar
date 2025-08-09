import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { isBlocked } = await request.json()
    const { id: vehicleId } = await params

    // Verifica se o veículo pertence ao usuário
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: session.user.id
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }

    // Atualiza o status de bloqueio
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isBlocked }
    })

    // Registra o evento
    await prisma.vehicleEvent.create({
      data: {
        vehicleId,
        type: isBlocked ? 'LOCK_VEHICLE' : 'UNLOCK_VEHICLE',
        data: JSON.stringify({
          previousState: vehicle.isBlocked,
          newState: isBlocked,
          triggeredBy: session.user.id,
          timestamp: new Date()
        })
      }
    })

    // Cria alerta
    await prisma.alert.create({
      data: {
        vehicleId,
        type: isBlocked ? 'UNAUTHORIZED_ACCESS' : 'MOVEMENT',
        message: isBlocked 
          ? `Veículo ${vehicle.name} foi bloqueado remotamente`
          : `Veículo ${vehicle.name} foi desbloqueado remotamente`,
        severity: 'MEDIUM'
      }
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Erro ao bloquear/desbloquear veículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}