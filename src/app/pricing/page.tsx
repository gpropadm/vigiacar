'use client'

import { useState } from 'react'
import { Shield, Check, X, Star, Zap, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  popular?: boolean
  cta: string
  highlight?: string
}

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: billingCycle === 'monthly' ? 35 : 350,
      originalPrice: billingCycle === 'monthly' ? undefined : 420,
      period: billingCycle === 'monthly' ? '/mês' : '/ano',
      description: 'Perfeito para proteção essencial',
      features: [
        'Rastreamento GPS em tempo real',
        'Alertas por WhatsApp e SMS',
        'Bloqueio/desbloqueio remoto',
        'App móvel iOS e Android',
        'Histórico de 30 dias',
        'Cerca eletrônica (2 zonas)',
        'Suporte por email'
      ],
      notIncluded: [
        'Câmeras HD',
        'IA para detecção',
        'Suporte telefônico'
      ],
      cta: 'Começar Agora'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'monthly' ? 59 : 590,
      originalPrice: billingCycle === 'monthly' ? undefined : 708,
      period: billingCycle === 'monthly' ? '/mês' : '/ano',
      description: 'Proteção completa com IA',
      popular: true,
      highlight: 'Mais Popular',
      features: [
        'Tudo do plano Básico',
        'Câmeras 4K com visão noturna',
        'IA para detecção de ameaças',
        'Gravação automática',
        'Histórico de 90 dias',
        'Cerca eletrônica ilimitada',
        'Relatórios detalhados',
        'Suporte telefônico prioritário',
        'Alertas por voz'
      ],
      cta: 'Mais Popular'
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: billingCycle === 'monthly' ? 29 : 290,
      period: billingCycle === 'monthly' ? '/veículo/mês' : '/veículo/ano',
      description: 'Para frotas e empresas',
      features: [
        'Tudo do plano Premium',
        'Dashboard para frotas',
        'Gestão de motoristas',
        'API personalizada',
        'Relatórios corporativos',
        'Integração com sistemas',
        'Suporte 24/7 dedicado',
        'Treinamento da equipe',
        'SLA garantido'
      ],
      highlight: 'Mínimo 5 veículos',
      cta: 'Falar com Vendas'
    }
  ]

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Redirecionar para contato
      window.open('https://wa.me/5511999999999?text=Olá! Tenho interesse no plano Empresarial do VigiaCar', '_blank')
    } else {
      router.push(`/checkout?plan=${planId}&billing=${billingCycle}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VigiaCar</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Entrar
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escolha seu plano de <span className="text-blue-600">proteção</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Mais de 10.000 veículos protegidos. Sem taxa de adesão.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {plan.highlight}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mr-2">
                      R$ {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                {plan.highlight && !plan.popular && (
                  <p className="text-sm text-blue-600 font-medium">{plan.highlight}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.id === 'enterprise'
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Por que escolher o VigiaCar?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tecnologia Nacional
              </h3>
              <p className="text-gray-600">
                Desenvolvido no Brasil para as necessidades brasileiras
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instalação Rápida
              </h3>
              <p className="text-gray-600">
                Técnicos especializados instalam em até 2 horas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Suporte 24/7
              </h3>
              <p className="text-gray-600">
                Equipe especializada sempre disponível para ajudar
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como funciona a instalação?
              </h3>
              <p className="text-gray-600">
                Nossos técnicos vão até você e instalam o dispositivo em até 2 horas. 
                Não precisa mexer na parte elétrica do carro.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Funciona em qualquer carro?
              </h3>
              <p className="text-gray-600">
                Sim! Funciona em carros, motos, caminhões e qualquer veículo de 12V ou 24V.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso cancelar quando quiser?
              </h3>
              <p className="text-gray-600">
                Sim, sem fidelidade! Você pode cancelar a qualquer momento sem multa.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                O que acontece se meu carro for roubado?
              </h3>
              <p className="text-gray-600">
                Você recebe alertas instantâneos e nossa equipe te ajuda a localizar 
                e recuperar o veículo junto com as autoridades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}