'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Car, 
  MapPin, 
  Shield, 
  Plus, 
  Battery, 
  Clock, 
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  BarChart3
} from 'lucide-react'

interface Vehicle {
  id: string
  name: string
  plate: string
  brand?: string
  model?: string
  status: string
  isBlocked: boolean
  hasCamera: boolean
  lastLocation?: {
    latitude: number
    longitude: number
    address?: string
    timestamp: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      loadVehicles()
    }
  }, [status, router])

  const loadVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        setVehicles(data.vehicles || [])
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVehicleBlock = async (vehicleId: string, isBlocked: boolean) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !isBlocked })
      })
      
      if (response.ok) {
        loadVehicles() // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao bloquear/desbloquear veículo:', error)
    }
  }

  const startGPSSimulation = async (vehicleId: string) => {
    try {
      await fetch(`/api/vehicles/${vehicleId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      loadVehicles()
    } catch (error) {
      console.error('Erro ao iniciar simulação:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VigiaCar</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500 uppercase">{session.user?.plan}</p>
              </div>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                <p className="text-gray-500">Veículos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.status === 'ACTIVE').length}
                </p>
                <p className="text-gray-500">Ativos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.isBlocked).length}
                </p>
                <p className="text-gray-500">Bloqueados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.hasCamera).length}
                </p>
                <p className="text-gray-500">Com Câmera</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Meus Veículos</h2>
            <button
              onClick={() => router.push('/dashboard/vehicles/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Veículo</span>
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece adicionando seu primeiro veículo para monitoramento.</p>
              <button
                onClick={() => router.push('/dashboard/vehicles/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Adicionar Veículo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{vehicle.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📋 {vehicle.plate}</span>
                          {vehicle.brand && <span>🚗 {vehicle.brand} {vehicle.model}</span>}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            vehicle.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Localização */}
                      {vehicle.lastLocation && (
                        <div className="text-right text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{vehicle.lastLocation.address || 'Localizado'}</span>
                          </div>
                          <div className="text-gray-400">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(vehicle.lastLocation.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      )}

                      {/* Botões de ação */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleVehicleBlock(vehicle.id, vehicle.isBlocked)}
                          className={`p-2 rounded-lg ${
                            vehicle.isBlocked 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={vehicle.isBlocked ? 'Desbloquear' : 'Bloquear'}
                        >
                          {vehicle.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => startGPSSimulation(vehicle.id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          title="Simular GPS"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Ver detalhes"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                🚀 Sistema de Demonstração
              </h3>
              <p className="text-yellow-700 mb-4">
                Este é um ambiente de testes. Use os recursos abaixo para simular o funcionamento real:
              </p>
              <ul className="text-yellow-700 space-y-2">
                <li>• <strong>Adicionar Veículo:</strong> Cadastre um veículo fictício para testes</li>
                <li>• <strong>Simular GPS:</strong> Clique no botão <MapPin className="inline h-4 w-4" /> para simular movimento</li>
                <li>• <strong>Bloquear/Desbloquear:</strong> Teste os controles remotos</li>
                <li>• <strong>Alertas:</strong> Serão gerados automaticamente durante simulação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}