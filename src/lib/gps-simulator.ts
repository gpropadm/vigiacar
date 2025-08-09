// Simulador GPS para desenvolvimento e testes
export interface GPSLocation {
  latitude: number
  longitude: number
  speed: number
  heading: number
  timestamp: Date
  address?: string
}

export class GPSSimulator {
  private static instance: GPSSimulator
  private vehicles: Map<string, VehicleSimulation> = new Map()
  private isRunning = false

  static getInstance(): GPSSimulator {
    if (!GPSSimulator.instance) {
      GPSSimulator.instance = new GPSSimulator()
    }
    return GPSSimulator.instance
  }

  startSimulation(vehicleId: string, initialPosition?: { lat: number, lng: number }) {
    // Posição padrão: São Paulo - SP
    const defaultPosition = { lat: -23.5505, lng: -46.6333 }
    const position = initialPosition || defaultPosition

    const simulation: VehicleSimulation = {
      vehicleId,
      currentPosition: {
        latitude: position.lat,
        longitude: position.lng,
        speed: 0,
        heading: 0,
        timestamp: new Date()
      },
      isMoving: false,
      route: this.generateRoute(position.lat, position.lng),
      currentRouteIndex: 0,
      lastUpdate: new Date()
    }

    this.vehicles.set(vehicleId, simulation)
    
    if (!this.isRunning) {
      this.startUpdateLoop()
    }
  }

  stopSimulation(vehicleId: string) {
    this.vehicles.delete(vehicleId)
    if (this.vehicles.size === 0) {
      this.isRunning = false
    }
  }

  getCurrentLocation(vehicleId: string): GPSLocation | null {
    const vehicle = this.vehicles.get(vehicleId)
    if (!vehicle) return null
    return vehicle.currentPosition
  }

  toggleMovement(vehicleId: string, isMoving: boolean) {
    const vehicle = this.vehicles.get(vehicleId)
    if (vehicle) {
      vehicle.isMoving = isMoving
    }
  }

  private startUpdateLoop() {
    this.isRunning = true
    
    setInterval(() => {
      this.vehicles.forEach(vehicle => {
        this.updateVehiclePosition(vehicle)
      })
    }, 2000) // Atualiza a cada 2 segundos
  }

  private updateVehiclePosition(vehicle: VehicleSimulation) {
    if (!vehicle.isMoving) {
      // Se não está se movendo, apenas atualiza o timestamp
      vehicle.currentPosition.timestamp = new Date()
      vehicle.currentPosition.speed = 0
      return
    }

    const route = vehicle.route
    if (vehicle.currentRouteIndex >= route.length) {
      // Chegou ao fim da rota, para o veículo
      vehicle.isMoving = false
      vehicle.currentPosition.speed = 0
      return
    }

    const targetPoint = route[vehicle.currentRouteIndex]
    const current = vehicle.currentPosition

    // Calcula direção e distância para o próximo ponto
    const deltaLat = targetPoint.lat - current.latitude
    const deltaLng = targetPoint.lng - current.longitude
    const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng)

    if (distance < 0.0001) {
      // Chegou no ponto, vai para o próximo
      vehicle.currentRouteIndex++
      return
    }

    // Move em direção ao ponto alvo
    const speed = this.randomSpeed() // km/h
    const speedMs = speed / 3.6 // m/s
    const moveDistance = speedMs * 2 / 111000 // 2 segundos em graus lat/lng aproximadamente

    const normalizedDeltaLat = deltaLat / distance
    const normalizedDeltaLng = deltaLng / distance

    vehicle.currentPosition = {
      latitude: current.latitude + normalizedDeltaLat * moveDistance,
      longitude: current.longitude + normalizedDeltaLng * moveDistance,
      speed,
      heading: this.calculateHeading(normalizedDeltaLat, normalizedDeltaLng),
      timestamp: new Date(),
      address: `Rua Simulada, ${Math.floor(Math.random() * 1000)}`
    }
  }

  private generateRoute(startLat: number, startLng: number): { lat: number, lng: number }[] {
    const route = []
    let currentLat = startLat
    let currentLng = startLng
    
    // Gera uma rota aleatória com 10-20 pontos
    const numPoints = 10 + Math.floor(Math.random() * 10)
    
    for (let i = 0; i < numPoints; i++) {
      // Adiciona variação aleatória pequena para simular movimento urbano
      const deltaLat = (Math.random() - 0.5) * 0.01 // ~1km
      const deltaLng = (Math.random() - 0.5) * 0.01
      
      currentLat += deltaLat
      currentLng += deltaLng
      
      route.push({ lat: currentLat, lng: currentLng })
    }
    
    return route
  }

  private randomSpeed(): number {
    // Velocidades típicas urbanas: 20-80 km/h
    return 20 + Math.random() * 60
  }

  private calculateHeading(deltaLat: number, deltaLng: number): number {
    const heading = Math.atan2(deltaLng, deltaLat) * 180 / Math.PI
    return heading < 0 ? heading + 360 : heading
  }

  // Simula eventos especiais
  simulateAlert(vehicleId: string, alertType: 'SPEED_LIMIT' | 'PANIC_BUTTON' | 'IMPACT_DETECTED') {
    const vehicle = this.vehicles.get(vehicleId)
    if (!vehicle) return

    // Implementar lógica de alerta
    console.log(`🚨 ALERTA: ${alertType} para veículo ${vehicleId}`)
    
    // Aqui você pode chamar a API para criar o alerta no banco
    fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId,
        type: alertType,
        latitude: vehicle.currentPosition.latitude,
        longitude: vehicle.currentPosition.longitude,
        message: `Alerta simulado: ${alertType}`,
        severity: alertType === 'PANIC_BUTTON' ? 'CRITICAL' : 'HIGH'
      })
    })
  }
}

interface VehicleSimulation {
  vehicleId: string
  currentPosition: GPSLocation
  isMoving: boolean
  route: { lat: number, lng: number }[]
  currentRouteIndex: number
  lastUpdate: Date
}