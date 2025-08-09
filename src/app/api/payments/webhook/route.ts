import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { WhatsAppService } from '@/lib/whatsapp-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Processar evento
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId
    const billing = session.metadata?.billing

    if (!userId || !planId) {
      console.error('Metadata incompleta no checkout')
      return
    }

    // Atualizar plano do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planId.toUpperCase()
      }
    })

    // Criar registro de pagamento (se necessário)
    // await prisma.payment.create({ ... })

    // Enviar WhatsApp de boas-vindas
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.phone) {
      const whatsapp = WhatsAppService.getInstance()
      await whatsapp.sendWelcomeMessage(user.phone, user.name || 'Cliente')
    }

    console.log(`Pagamento concluído para usuário ${userId}, plano ${planId}`)
  } catch (error) {
    console.error('Erro ao processar checkout:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Assinatura criada: ${subscription.id}`)
  // Implementar lógica de assinatura
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Assinatura atualizada: ${subscription.id}`)
  // Implementar lógica de atualização
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Assinatura cancelada: ${subscription.id}`)
  // Implementar lógica de cancelamento
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Pagamento bem-sucedido: ${invoice.id}`)
  // Implementar lógica de pagamento recebido
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Pagamento falhado: ${invoice.id}`)
  // Implementar lógica de cobrança falhada
  // Enviar notificação, suspender serviço, etc.
}