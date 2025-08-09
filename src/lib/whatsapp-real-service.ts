// Serviço WhatsApp Business API Real
export class WhatsAppRealService {
  private apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.log('🔧 WhatsApp não configurado - usando simulação')
      console.log(`📱 Para: ${to}`)
      console.log(`💬 Mensagem: ${message}`)
      return true
    }

    try {
      // Limpar número (remover caracteres especiais)
      const cleanPhone = to.replace(/\D/g, '')
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: message
          }
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Erro WhatsApp API:', error)
        return false
      }

      const result = await response.json()
      console.log('✅ WhatsApp enviado:', result.messages?.[0]?.id)
      return true

    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      return false
    }
  }

  async sendTemplate(to: string, templateName: string, parameters: any[] = []): Promise<boolean> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.log('🔧 Template WhatsApp não configurado')
      return true
    }

    try {
      const cleanPhone = to.replace(/\D/g, '')
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'pt_BR'
            },
            components: parameters.length > 0 ? [
              {
                type: 'body',
                parameters: parameters.map(param => ({
                  type: 'text',
                  text: param
                }))
              }
            ] : []
          }
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Erro WhatsApp Template:', error)
        return false
      }

      const result = await response.json()
      console.log('✅ Template WhatsApp enviado:', result.messages?.[0]?.id)
      return true

    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error)
      return false
    }
  }

  // Templates pré-aprovados para usar em produção
  async sendWelcomeTemplate(phone: string, customerName: string): Promise<boolean> {
    return this.sendTemplate(phone, 'welcome_vigiacar', [customerName])
  }

  async sendAlertTemplate(phone: string, vehicleName: string, alertType: string): Promise<boolean> {
    return this.sendTemplate(phone, 'vehicle_alert', [vehicleName, alertType])
  }

  async sendPaymentConfirmation(phone: string, planName: string, amount: string): Promise<boolean> {
    return this.sendTemplate(phone, 'payment_confirmation', [planName, amount])
  }

  // Métodos compatíveis com o serviço antigo
  async sendAlert(phoneNumber: string, message: string, vehicleName: string, alertType: string): Promise<boolean> {
    return this.sendMessage(phoneNumber, message)
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

    return this.sendMessage(phoneNumber, message)
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

    return this.sendMessage(phoneNumber, message)
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

    return this.sendMessage(phoneNumber, message)
  }
}

export const whatsAppService = new WhatsAppRealService()