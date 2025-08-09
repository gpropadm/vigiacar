'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(true) // Sempre mostra em dev

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration.scope)
        })
        .catch((error) => {
          console.log('❌ Falha ao registrar Service Worker:', error)
        })
    }

    // Detectar se PWA pode ser instalado
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('🚀 PWA pode ser instalado!')
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Detectar quando PWA foi instalado
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA foi instalado com sucesso!')
      setShowInstallButton(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('✅ PWA instalado!')
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) return null

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors z-50"
    >
      <Download className="h-5 w-5" />
      <span>Instalar App</span>
    </button>
  )
}