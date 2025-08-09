import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export interface PaymentData {
  planId: string
  userId: string
  email: string
  name: string
  amount: number
  currency: string
  billing: 'monthly' | 'annual'
}

export class PaymentService {
  // Criar sessão de pagamento Stripe
  async createStripeSession(data: PaymentData) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: data.email,
        line_items: [
          {
            price_data: {
              currency: data.currency,
              product_data: {
                name: `VigiaCar - Plano ${data.planId.charAt(0).toUpperCase() + data.planId.slice(1)}`,
                description: `Plano ${data.billing === 'monthly' ? 'mensal' : 'anual'}`,
                images: ['https://vigiacar.com.br/logo-512.png']
              },
              unit_amount: data.amount * 100, // Stripe usa centavos
              recurring: data.billing === 'monthly' ? {
                interval: 'month'
              } : {
                interval: 'year'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout?payment=cancelled`,
        metadata: {
          userId: data.userId,
          planId: data.planId,
          billing: data.billing
        }
      })

      return { sessionId: session.id, url: session.url }
    } catch (error) {
      console.error('Erro ao criar sessão Stripe:', error)
      throw new Error('Falha ao processar pagamento')
    }
  }

  // Criar preferência Mercado Pago
  async createMercadoPagoPreference(data: PaymentData) {
    try {
      const MercadoPago = require('mercadopago')
      
      MercadoPago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
      })

      const preference = {
        items: [
          {
            title: `VigiaCar - Plano ${data.planId.charAt(0).toUpperCase() + data.planId.slice(1)}`,
            description: `Plano ${data.billing === 'monthly' ? 'mensal' : 'anual'}`,
            unit_price: data.amount,
            quantity: 1,
          }
        ],
        payer: {
          name: data.name,
          email: data.email
        },
        external_reference: `${data.userId}-${data.planId}-${Date.now()}`,
        back_urls: {
          success: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
          failure: `${process.env.NEXTAUTH_URL}/checkout?payment=failed`,
          pending: `${process.env.NEXTAUTH_URL}/dashboard?payment=pending`
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' } // Exclui boleto
          ],
          installments: 12
        }
      }

      const response = await MercadoPago.preferences.create(preference)
      return { preferenceId: response.body.id, initPoint: response.body.init_point }
    } catch (error) {
      console.error('Erro ao criar preferência MP:', error)
      throw new Error('Falha ao processar pagamento')
    }
  }

  // PIX Instantâneo (simulado)
  async createPixPayment(data: PaymentData) {
    // Em produção, integrar com API do banco ou PSP que suporte PIX
    const pixCode = this.generatePixCode(data)
    
    return {
      pixCode,
      qrCode: `data:image/svg+xml;base64,${Buffer.from(this.generateQRCodeSVG(pixCode)).toString('base64')}`,
      expirationTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      amount: data.amount
    }
  }

  private generatePixCode(data: PaymentData): string {
    // Código PIX simulado (em produção usar API real)
    return `00020126580014BR.GOV.BCB.PIX0136${data.userId}-${data.planId}520400005303986540${data.amount.toFixed(2)}5802BR5913VIGIACAR LTDA6008SAO PAULO62070503***6304`
  }

  private generateQRCodeSVG(pixCode: string): string {
    // QR Code SVG simples (em produção usar biblioteca real)
    return `
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="160" height="160" fill="white" stroke="black" stroke-width="2"/>
        <rect x="40" y="40" width="20" height="20" fill="black"/>
        <rect x="80" y="40" width="20" height="20" fill="black"/>
        <rect x="120" y="40" width="20" height="20" fill="black"/>
        <rect x="160" y="40" width="20" height="20" fill="black"/>
        <rect x="40" y="80" width="20" height="20" fill="black"/>
        <rect x="120" y="80" width="20" height="20" fill="black"/>
        <rect x="40" y="120" width="20" height="20" fill="black"/>
        <rect x="80" y="120" width="20" height="20" fill="black"/>
        <rect x="160" y="120" width="20" height="20" fill="black"/>
        <rect x="40" y="160" width="20" height="20" fill="black"/>
        <rect x="80" y="160" width="20" height="20" fill="black"/>
        <rect x="120" y="160" width="20" height="20" fill="black"/>
        <rect x="160" y="160" width="20" height="20" fill="black"/>
        <text x="100" y="190" font-size="8" text-anchor="middle" fill="black">PIX - VigiaCar</text>
      </svg>
    `
  }

  // Verificar status do pagamento
  async verifyPayment(paymentId: string, provider: 'stripe' | 'mercadopago' | 'pix') {
    switch (provider) {
      case 'stripe':
        const session = await stripe.checkout.sessions.retrieve(paymentId)
        return {
          status: session.payment_status,
          customerId: session.customer,
          subscriptionId: session.subscription
        }
      
      case 'mercadopago':
        // Implementar verificação MP
        return { status: 'approved' }
      
      case 'pix':
        // Implementar verificação PIX
        return { status: 'approved' }
      
      default:
        throw new Error('Provedor não suportado')
    }
  }
}

export const paymentService = new PaymentService()