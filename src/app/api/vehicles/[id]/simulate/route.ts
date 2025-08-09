import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GPSSimulator } from '@/lib/gps-simulator'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { action } = await request.json()
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

    const simulator = GPSSimulator.getInstance()

    if (action === 'start') {
      // Inicia simulação GPS
      simulator.startSimulation(vehicleId)
      simulator.toggleMovement(vehicleId, true)

      // Simula algumas localizações iniciais
      setTimeout(async () => {
        const location = simulator.getCurrentLocation(vehicleId)
        if (location) {
          await prisma.vehicleLocation.create({
            data: {
              vehicleId,
              latitude: location.latitude,
              longitude: location.longitude,
              speed: location.speed,
              heading: location.heading,
              address: location.address || 'Localização simulada',
              timestamp: location.timestamp
            }
          })

          // Cria evento
          await prisma.vehicleEvent.create({
            data: {
              vehicleId,
              type: 'ENGINE_ON',
              data: JSON.stringify({
                simulationStarted: true,
                location: {
                  lat: location.latitude,
                  lng: location.longitude
                }
              })
            }
          })

          // Cria alerta de movimento
          await prisma.alert.create({
            data: {
              vehicleId,
              type: 'MOVEMENT',
              message: `Simulação GPS iniciada para ${vehicle.name}`,
              severity: 'LOW',
              latitude: location.latitude,
              longitude: location.longitude
            }
          })
        }
      }, 1000)

    } else if (action === 'stop') {
      simulator.stopSimulation(vehicleId)
      
      await prisma.vehicleEvent.create({
        data: {
          vehicleId,
          type: 'ENGINE_OFF',
          data: JSON.stringify({
            simulationStopped: true
          })
        }
      })
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Erro na simulação GPS:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}