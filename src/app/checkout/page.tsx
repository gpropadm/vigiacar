'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, CreditCard, Smartphone, Lock, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PlanDetails {
  id: string
  name: string
  price: number
  period: string
  features: string[]
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit')
  
  const planId = searchParams.get('plan')
  const billing = searchParams.get('billing')

  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    cpf: '',
    
    // Endereço
    zipcode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Cartão
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    
    // Veículo
    vehicleName: '',
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: ''
  })

  const plans: Record<string, PlanDetails> = {
    basic: {
      id: 'basic',
      name: 'Básico',
      price: billing === 'annual' ? 350 : 35,
      period: billing === 'annual' ? '/ano' : '/mês',
      features: [
        'Rastreamento GPS em tempo real',
        'Alertas por WhatsApp e SMS',
        'Bloqueio/desbloqueio remoto',
        'App móvel iOS e Android'
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: billing === 'annual' ? 590 : 59,
      period: billing === 'annual' ? '/ano' : '/mês',
      features: [
        'Tudo do plano Básico',
        'Câmeras 4K com visão noturna',
        'IA para detecção de ameaças',
        'Gravação automática'
      ]
    }
  }

  const selectedPlan = plans[planId || 'basic']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (paymentMethod === 'pix') {
        // Simular pagamento PIX
        setTimeout(() => {
          alert('QR Code PIX gerado! Escaneie para pagar.')
          router.push('/dashboard')
        }, 2000)
      } else {
        // Simular pagamento cartão
        setTimeout(() => {
          alert('Pagamento processado com sucesso!')
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      alert('Erro no pagamento. Tente novamente.')
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

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plano não encontrado</h1>
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700">
            Voltar para escolha de planos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/pricing" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VigiaCar</span>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</div>
                <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  Dados Pessoais
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</div>
                <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  Pagamento
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Seus dados</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="cpf"
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="CPF"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Telefone"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Dados do veículo</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="vehicleName"
                      type="text"
                      required
                      value={formData.vehicleName}
                      onChange={handleInputChange}
                      placeholder="Nome do veículo (ex: Meu Civic)"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="vehiclePlate"
                      type="text"
                      required
                      value={formData.vehiclePlate}
                      onChange={handleInputChange}
                      placeholder="Placa"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="vehicleBrand"
                      type="text"
                      value={formData.vehicleBrand}
                      onChange={handleInputChange}
                      placeholder="Marca (opcional)"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="vehicleModel"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      placeholder="Modelo (opcional)"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continuar para Pagamento
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Forma de pagamento</h2>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'credit'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="h-6 w-6 mx-auto mb-2" />
                      <span className="font-medium">Cartão</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'pix'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Smartphone className="h-6 w-6 mx-auto mb-2" />
                      <span className="font-medium">PIX</span>
                    </button>
                  </div>

                  {paymentMethod === 'credit' && (
                    <div className="space-y-4">
                      <input
                        name="cardNumber"
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="Número do cartão"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        name="cardName"
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Nome no cartão"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="cardExpiry"
                          type="text"
                          required
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          name="cardCvc"
                          type="text"
                          required
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="CVC"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium mb-2">Pagamento via PIX</p>
                      <p className="text-green-700 text-sm">
                        Após confirmar, você receberá um QR Code para pagamento instantâneo.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Processando...' : `Pagar ${formatCurrency(selectedPlan.price)}`}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do pedido</h2>
            
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plano {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600">{selectedPlan.period}</p>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedPlan.price)}
                </span>
              </div>

              <ul className="space-y-2">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedPlan.price)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Lock className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Pagamento seguro</span>
              </div>
              <p className="text-xs text-gray-600">
                Seus dados estão protegidos com criptografia SSL de 256 bits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}