import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Map price IDs to plan names
function getPlanFromPriceId(priceId: string): 'free' | 'pro' | 'business' {
  const proPriceIds = [
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
  ]
  const businessPriceIds = [
    process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
  ]
  
  if (proPriceIds.includes(priceId)) return 'pro'
  if (businessPriceIds.includes(priceId)) return 'business'
  return 'free'
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (!session.metadata?.projectId) {
          console.error('❌ Missing projectId in session metadata')
          return NextResponse.json(
            { error: 'Missing projectId in metadata' },
            { status: 400 }
          )
        }

        const projectId = session.metadata.projectId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('✅ Checkout completed:', {
          customerId,
          email: session.customer_email,
          projectId,
          subscriptionId,
        })

        // Get subscription details to determine the plan
        if (subscriptionId && projectId) {
          const stripe = getStripe()
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? getPlanFromPriceId(priceId) : 'pro'

          await prisma.project.update({
            where: { id: projectId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              plan: plan,
              tier: plan, // Keep tier in sync
              planExpiresAt: new Date(subscription.current_period_end * 1000),
            },
          })
          console.log(`   Updated project ${projectId} to plan: ${plan}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? getPlanFromPriceId(priceId) : 'free'

        console.log('📝 Subscription updated:', {
          subscriptionId,
          status: subscription.status,
          priceId,
          plan,
        })

        // Find project by subscription ID and update
        const project = await prisma.project.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        })

        if (project) {
          await prisma.project.update({
            where: { id: project.id },
            data: {
              stripePriceId: priceId,
              plan: subscription.status === 'active' ? plan : 'free',
              tier: subscription.status === 'active' ? plan : 'free',
              planExpiresAt: new Date(subscription.current_period_end * 1000),
            },
          })
          console.log(`   Updated project ${project.id} to plan: ${plan}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        console.log('❌ Subscription cancelled:', {
          subscriptionId,
          customerId: subscription.customer,
        })

        // Downgrade to free plan
        const project = await prisma.project.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        })

        if (project) {
          await prisma.project.update({
            where: { id: project.id },
            data: {
              plan: 'free',
              tier: 'free',
              stripeSubscriptionId: null,
              stripePriceId: null,
              planExpiresAt: null,
            },
          })
          console.log(`   Downgraded project ${project.id} to free plan`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Payment succeeded:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amount: invoice.amount_paid,
        })

        // Extend subscription period if needed
        if (invoice.subscription) {
          const project = await prisma.project.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })
          if (project && invoice.lines.data[0]?.period.end) {
            await prisma.project.update({
              where: { id: project.id },
              data: {
                planExpiresAt: new Date(invoice.lines.data[0].period.end * 1000),
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('⚠️ Payment failed:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          email: invoice.customer_email,
        })
        // Note: Stripe will automatically retry failed payments
        // Could send notification email here if needed
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
