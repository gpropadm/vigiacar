'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Shield, 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  MapPin,
  Activity,
  Calendar,
  Download
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalVehicles: number
  activeSubscriptions: number
  monthlyRevenue: number
  newUsersToday: number
  alertsToday: number
  activeDevices: number
  conversionRate: number
}

interface RecentActivity {
  id: string
  type: 'user_signup' | 'payment' | 'alert' | 'vehicle_added'
  description: string
  timestamp: string
  user?: string
  amount?: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Verificar se é admin (em produção, verificar no backend)
      if (session.user.email !== 'admin@vigiacar.com') {
        router.push('/dashboard')
      } else {
        loadAdminData()
      }
    }
  }, [status, session, router])

  const loadAdminData = async () => {
    try {
      // Em produção, fazer chamadas reais para APIs
      setStats({
        totalUsers: 1247,
        totalVehicles: 2893,
        activeSubscriptions: 1156,
        monthlyRevenue: 67890,
        newUsersToday: 23,
        alertsToday: 156,
        activeDevices: 2234,
        conversionRate: 12.5
      })

      setActivities([
        {
          id: '1',
          type: 'payment',
          description: 'Pagamento processado - Plano Premium',
          timestamp: '2025-01-08T10:30:00Z',
          user: 'João Silva',
          amount: 59
        },
        {
          id: '2',
          type: 'user_signup',
          description: 'Novo usuário cadastrado',
          timestamp: '2025-01-08T10:15:00Z',
          user: 'Maria Santos'
        },
        {
          id: '3',
          type: 'alert',
          description: 'Alerta de movimento enviado',
          timestamp: '2025-01-08T10:00:00Z',
          user: 'Carlos Oliveira'
        },
        {
          id: '4',
          type: 'vehicle_added',
          description: 'Veículo adicionado - Honda Civic',
          timestamp: '2025-01-08T09:45:00Z',
          user: 'Ana Costa'
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-600" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'vehicle_added':
        return <Car className="h-4 w-4 text-purple-600" />
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.email !== 'admin@vigiacar.com') {
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
                <h1 className="text-2xl font-bold text-gray-900">VigiaCar Admin</h1>
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Exportar Dados</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500 uppercase">ADMINISTRADOR</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                <p className="text-gray-500">Total de Usuários</p>
                <p className="text-sm text-green-600">+{stats?.newUsersToday} hoje</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats?.totalVehicles.toLocaleString()}</p>
                <p className="text-gray-500">Veículos Monitorados</p>
                <p className="text-sm text-blue-600">{stats?.activeDevices} dispositivos ativos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </p>
                <p className="text-gray-500">Receita Mensal</p>
                <p className="text-sm text-green-600">{stats?.activeSubscriptions} assinaturas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate}%</p>
                <p className="text-gray-500">Taxa de Conversão</p>
                <p className="text-sm text-orange-600">{stats?.alertsToday} alertas hoje</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Atividades Recentes
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      {activity.user && (
                        <p className="text-xs text-gray-500">por {activity.user}</p>
                      )}
                      {activity.amount && (
                        <p className="text-xs text-green-600 font-medium">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                  <p className="text-xs text-gray-500">Visualizar e editar usuários</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <DollarSign className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900">Relatórios Financeiros</p>
                  <p className="text-xs text-gray-500">Receitas e pagamentos</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
                  <p className="font-medium text-gray-900">Monitor de Alertas</p>
                  <p className="text-xs text-gray-500">Alertas em tempo real</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <MapPin className="h-6 w-6 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">Mapa Global</p>
                  <p className="text-xs text-gray-500">Todos os veículos no mapa</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Status do Sistema</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">API Status</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">GPS Services</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">WhatsApp API</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}