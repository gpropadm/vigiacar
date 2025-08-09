import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário demo
  const demoPassword = await bcrypt.hash('demo123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@vigiacar.com' },
    update: {},
    create: {
      name: 'Usuário Demo',
      email: 'demo@vigiacar.com',
      phone: '(11) 99999-9999',
      password: demoPassword,
      plan: 'PREMIUM'
    }
  })

  console.log('✅ Usuário demo criado:', demoUser.email)

  // Criar veículo demo
  const demoVehicle = await prisma.vehicle.upsert({
    where: { plate: 'DEMO123' },
    update: {},
    create: {
      name: 'Carro Demo',
      plate: 'DEMO123',
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      color: 'Preto',
      hasCamera: true,
      userId: demoUser.id,
      deviceId: 'DEV-DEMO-001'
    }
  })

  console.log('✅ Veículo demo criado:', demoVehicle.plate)

  // Criar algumas localizações demo
  await prisma.vehicleLocation.createMany({
    data: [
      {
        vehicleId: demoVehicle.id,
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'São Paulo - SP, Centro',
        speed: 0,
        heading: 0,
        timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hora atrás
      },
      {
        vehicleId: demoVehicle.id,
        latitude: -23.5489,
        longitude: -46.6388,
        address: 'São Paulo - SP, República',
        speed: 45,
        heading: 90,
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 min atrás
      },
      {
        vehicleId: demoVehicle.id,
        latitude: -23.5475,
        longitude: -46.6395,
        address: 'São Paulo - SP, Sé',
        speed: 0,
        heading: 90,
        timestamp: new Date() // agora
      }
    ]
  })

  console.log('✅ Localizações demo criadas')

  // Criar alguns alertas demo
  await prisma.alert.createMany({
    data: [
      {
        vehicleId: demoVehicle.id,
        type: 'MOVEMENT',
        message: 'Veículo Carro Demo iniciou movimento',
        severity: 'LOW',
        latitude: -23.5505,
        longitude: -46.6333
      },
      {
        vehicleId: demoVehicle.id,
        type: 'SPEED_LIMIT',
        message: 'Excesso de velocidade detectado - 65 km/h em zona de 40 km/h',
        severity: 'MEDIUM',
        latitude: -23.5489,
        longitude: -46.6388
      }
    ]
  })

  console.log('✅ Alertas demo criados')

  // Criar alguns eventos demo
  await prisma.vehicleEvent.createMany({
    data: [
      {
        vehicleId: demoVehicle.id,
        type: 'ENGINE_ON',
        data: JSON.stringify({ location: { lat: -23.5505, lng: -46.6333 } })
      },
      {
        vehicleId: demoVehicle.id,
        type: 'DOOR_OPEN',
        data: JSON.stringify({ door: 'driver', duration: '00:00:15' })
      },
      {
        vehicleId: demoVehicle.id,
        type: 'ENGINE_OFF',
        data: JSON.stringify({ location: { lat: -23.5475, lng: -46.6395 } })
      }
    ]
  })

  console.log('✅ Eventos demo criados')

  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('📧 Email: demo@vigiacar.com')
  console.log('🔑 Senha: demo123')
  console.log('🚗 Veículo: Carro Demo (DEMO123)')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })