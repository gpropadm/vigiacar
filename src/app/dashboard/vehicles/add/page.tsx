'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Shield, ArrowLeft, Car } from 'lucide-react'
import Link from 'next/link'

export default function AddVehiclePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    hasCamera: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar veículo')
      }

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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
                <p className="text-sm text-gray-500">Adicionar Veículo</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Adicionar Novo Veículo</h2>
                <p className="text-sm text-gray-500">
                  Cadastre seu veículo para começar o monitoramento
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Veículo *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Meu Civic, Carro da família..."
                />
              </div>

              <div>
                <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-2">
                  Placa *
                </label>
                <input
                  id="plate"
                  name="plate"
                  type="text"
                  required
                  value={formData.plate}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Honda, Toyota, Ford..."
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Civic, Corolla, Ka..."
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma cor</option>
                  <option value="Branco">Branco</option>
                  <option value="Preto">Preto</option>
                  <option value="Prata">Prata</option>
                  <option value="Cinza">Cinza</option>
                  <option value="Azul">Azul</option>
                  <option value="Vermelho">Vermelho</option>
                  <option value="Verde">Verde</option>
                  <option value="Amarelo">Amarelo</option>
                  <option value="Marrom">Marrom</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Camera Option */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sistema de Câmeras 4K</p>
                    <p className="text-xs text-gray-500">
                      Gravação automática e visão noturna (Plano Premium)
                    </p>
                  </div>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasCamera"
                    checked={formData.hasCamera}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={session.user.plan === 'BASIC'}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {session.user.plan === 'BASIC' ? 'Premium' : 'Incluir'}
                  </span>
                </label>
              </div>
              {session.user.plan === 'BASIC' && (
                <p className="text-xs text-yellow-600 mt-2">
                  💡 Faça upgrade para Premium para usar câmeras 4K
                </p>
              )}
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>🚀 Modo Demonstração:</strong> Este veículo será criado no ambiente de testes. 
                Você poderá simular GPS, alertas e todos os recursos do sistema.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Veículo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}