import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { paymentService } from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const {
      planId,
      billing,
      paymentMethod,
      customerData
    } = await request.json()

    // Validar dados
    if (!planId || !billing || !paymentMethod) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Definir preços
    const prices: Record<string, { monthly: number, annual: number }> = {
      basic: { monthly: 35, annual: 350 },
      premium: { monthly: 59, annual: 590 },
      enterprise: { monthly: 29, annual: 290 }
    }

    const planPrice = prices[planId]
    if (!planPrice) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      )
    }

    const amount = billing === 'monthly' ? planPrice.monthly : planPrice.annual

    const paymentData = {
      planId,
      userId: session.user.id,
      email: session.user.email!,
      name: session.user.name || customerData?.name || '',
      amount,
      currency: 'brl',
      billing
    }

    let result

    switch (paymentMethod) {
      case 'stripe':
        result = await paymentService.createStripeSession(paymentData)
        break
      
      case 'mercadopago':
        result = await paymentService.createMercadoPagoPreference(paymentData)
        break
      
      case 'pix':
        result = await paymentService.createPixPayment(paymentData)
        break
      
      default:
        return NextResponse.json(
          { error: 'Método de pagamento não suportado' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      paymentMethod,
      ...result
    })

  } catch (error) {
    console.error('Erro ao criar sessão de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}