'use client'

import { Shield, MapPin, Smartphone, Bell, Lock, Eye } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VigiaCar</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#recursos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Recursos
              </a>
              <a href="#planos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Planos
              </a>
              <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Entrar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Seu carro sempre <br />
            <span className="text-blue-600">sob controle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Proteja seu veículo com tecnologia de ponta. Rastreamento GPS em tempo real, 
            alertas instantâneos e bloqueio remoto na palma da sua mão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center">
              Começar Agora
            </a>
            <a href="/login" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center">
              Ver Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Que Protegem
            </h2>
            <p className="text-xl text-gray-600">
              Tecnologia avançada para máxima segurança do seu veículo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GPS em Tempo Real</h3>
              <p className="text-gray-600">
                Localização precisa do seu veículo 24/7 com atualizações em tempo real
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alertas Instantâneos</h3>
              <p className="text-gray-600">
                Notificações imediatas por WhatsApp, SMS e push quando algo acontecer
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bloqueio Remoto</h3>
              <p className="text-gray-600">
                Bloqueie ou desbloqueie seu veículo remotamente pelo aplicativo
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Câmeras HD</h3>
              <p className="text-gray-600">
                Gravação automática em caso de roubo com qualidade 4K
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">App Intuitivo</h3>
              <p className="text-gray-600">
                Interface moderna e fácil de usar para iOS e Android
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Segurança Total</h3>
              <p className="text-gray-600">
                Dados criptografados e sistema 100% seguro na nuvem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos Para Todos
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para proteger seu veículo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="bg-white rounded-2xl shadow-lg p-8 relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
              <p className="text-gray-600 mb-6">Para proteção essencial</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 35</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  GPS em tempo real
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Alertas por WhatsApp
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Bloqueio remoto
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  App móvel
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Escolher Plano
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-white rounded-2xl shadow-lg p-8 relative border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Proteção completa</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 59</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Tudo do plano Básico
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Câmeras 4K
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  IA para detecção
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Gravação automática
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Suporte prioritário
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Escolher Plano
              </button>
            </div>

            {/* Plano Empresarial */}
            <div className="bg-white rounded-2xl shadow-lg p-8 relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresarial</h3>
              <p className="text-gray-600 mb-6">Para frotas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 29</span>
                <span className="text-gray-600">/veículo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Tudo do plano Premium
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Dashboard para frotas
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Relatórios avançados
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  API personalizada
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  Suporte 24/7
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contato
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">VigiaCar</span>
            </div>
            <div className="text-gray-400">
              © 2024 VigiaCar. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}