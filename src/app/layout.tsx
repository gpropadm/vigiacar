import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import PWAInstaller from '@/components/PWAInstaller'

export const metadata: Metadata = {
  title: 'VigiaCar - Sistema Anti-Furto',
  description: 'Proteja seu veículo com tecnologia de ponta. Rastreamento GPS, alertas instantâneos e bloqueio remoto.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VigiaCar'
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          <PWAInstaller />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}