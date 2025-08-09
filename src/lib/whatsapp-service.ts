// Serviço de WhatsApp para alertas
export class WhatsAppService {
  private static instance: WhatsAppService
  private apiUrl = process.env.WHATSAPP_API_URL
  private token = process.env.WHATSAPP_TOKEN

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService()
    }
    return WhatsAppService.instance
  }

  async sendAlert(
    phoneNumber: string, 
    message: string, 
    vehicleName: string,
    alertType: string
  ): Promise<boolean> {
    if (!this.apiUrl || !this.token) {
      console.log('📱 SIMULAÇÃO WhatsApp - Configuração não encontrada')
      console.log(`🚨 ALERTA: ${alertType}`)
      console.log(`🚗 Veículo: ${vehicleName}`)
      console.log(`📱 Para: ${phoneNumber}`)
      console.log(`💬 Mensagem: ${message}`)
      console.log('---')
      return true
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: phoneNumber,
          type: 'text',
          text: {
            body: message
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      return false
    }
  }

  formatAlertMessage(alertType: string, vehicleName: string, details?: any): string {
    const timestamp = new Date().toLocaleString('pt-BR')
    
    const messages: Record<string, string> = {
      MOVEMENT: `🚨 *ALERTA VIGIACAR*

🚗 Veículo: *${vehicleName}*
⚠️ Movimento detectado
🕐 ${timestamp}

Seu veículo está se movendo. Se não foi autorizado, acesse o app para mais detalhes.

vigiacar.com.br`,

      SPEED_LIMIT: `🚨 *ALERTA VIGIACAR*

🚗 Veículo: *${vehicleName}*  
🏎️ Excesso de velocidade
🕐 ${timestamp}

Velocidade atual: ${details?.speed || 'N/A'} km/h
Limite: ${details?.limit || 'N/A'} km/h

vigiacar.com.br`,

      PANIC_BUTTON: `🚨 *ALERTA CRÍTICO*

🚗 Veículo: *${vehicleName}*
🆘 BOTÃO DE PÂNICO ACIONADO
🕐 ${timestamp}

SITUAÇÃO DE EMERGÊNCIA!
Localize imediatamente seu veículo no app.

vigiacar.com.br`,

      UNAUTHORIZED_ACCESS: `🚨 *ALERTA VIGIACAR*

🚗 Veículo: *${vehicleName}*
🔓 Acesso não autorizado
🕐 ${timestamp}

Tentativa de acesso detectada. Verifique seu veículo imediatamente.

vigiacar.com.br`,

      LOW_BATTERY: `⚠️ *AVISO VIGIACAR*

🚗 Veículo: *${vehicleName}*
🔋 Bateria baixa (${details?.batteryLevel || 'N/A'}%)
🕐 ${timestamp}

O dispositivo precisa ser carregado em breve.

vigiacar.com.br`
    }

    return messages[alertType] || `🚨 Alerta do veículo ${vehicleName} - ${timestamp}`
  }

  async sendLocationAlert(
    phoneNumber: string,
    vehicleName: string, 
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<boolean> {
    const message = `📍 *LOCALIZAÇÃO - ${vehicleName.toUpperCase()}*

🚗 Veículo: *${vehicleName}*
📍 ${address || 'Localização atual'}
🕐 ${new Date().toLocaleString('pt-BR')}

🗺️ Ver no mapa:
https://maps.google.com/maps?q=${latitude},${longitude}

vigiacar.com.br`

    return this.sendAlert(phoneNumber, message, vehicleName, 'LOCATION')
  }

  async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<boolean> {
    const message = `🎉 *BEM-VINDO AO VIGIACAR*

Olá *${userName}*!

✅ Sua conta foi criada com sucesso
🚗 Agora você pode cadastrar seus veículos
📱 Receba alertas em tempo real
🛡️ Proteção 24h garantida

Próximos passos:
1. Adicione seu primeiro veículo
2. Configure suas preferências 
3. Teste o sistema

vigiacar.com.br

*Qualquer dúvida, responda esta mensagem!*`

    return this.sendAlert(phoneNumber, message, 'Sistema', 'WELCOME')
  }

  async sendVehicleBlockedAlert(
    phoneNumber: string,
    vehicleName: string,
    isBlocked: boolean
  ): Promise<boolean> {
    const action = isBlocked ? 'BLOQUEADO' : 'DESBLOQUEADO'
    const emoji = isBlocked ? '🔒' : '🔓'
    
    const message = `${emoji} *VEÍCULO ${action}*

🚗 Veículo: *${vehicleName}*
${emoji} Status: *${action}*
🕐 ${new Date().toLocaleString('pt-BR')}

${isBlocked 
  ? 'Seu veículo foi bloqueado remotamente e não pode ser ligado.'
  : 'Seu veículo foi desbloqueado e já pode ser utilizado.'
}

vigiacar.com.br`

    return this.sendAlert(phoneNumber, message, vehicleName, isBlocked ? 'BLOCKED' : 'UNBLOCKED')
  }
}