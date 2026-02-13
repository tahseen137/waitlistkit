import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

// CORS headers for AI agent access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET /api/acp - Return product catalog
export async function GET() {
  const catalog = {
    acp_version: '2026-01-30',
    name: 'WaitlistKit',
    description: 'Beautiful waitlist management for modern product launches',
    plans: [
      {
        id: 'pro',
        name: 'Pro',
        description: 'Perfect for growing products. Up to 5 waitlists and 5,000 subscribers.',
        price: {
          amount: 4900,
          currency: 'usd',
          billing_period: 'one_time',
        },
        stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        features: [
          '5 waitlists',
          '5,000 subscribers',
          'Custom branding',
          'Email notifications',
          'Priority support',
          'CSV export',
          'Advanced analytics',
        ],
      },
      {
        id: 'business',
        name: 'Business',
        description: 'For serious businesses. Unlimited waitlists and subscribers.',
        price: {
          amount: 6900,
          currency: 'usd',
          billing_period: 'one_time',
        },
        stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
        features: [
          'Unlimited waitlists',
          'Unlimited subscribers',
          'API access',
          'Webhooks',
          'White-label option',
          'Dedicated support',
          'Custom integrations',
          'SLA guarantee',
        ],
      },
    ],
  }

  return NextResponse.json(catalog, { headers: corsHeaders })
}

// POST /api/acp - Create checkout session for AI agents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, buyer_email, agent_id } = body

    // Validate plan
    const validPlans = ['pro', 'business']
    if (!plan_id || !validPlans.includes(plan_id)) {
      return NextResponse.json(
        { error: 'Invalid plan_id. Must be "pro" or "business".' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Get Stripe price ID
    const priceIdMap: Record<string, string | undefined> = {
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      business: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    }

    const priceId = priceIdMap[plan_id]
    if (!priceId) {
      return NextResponse.json(
        { error: 'Plan configuration error. Please contact support.' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Create Stripe checkout session
    const stripe = getStripe()
    const origin = request.headers.get('origin') || 'https://waitlistkit.ca'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(buyer_email ? { customer_email: buyer_email } : {}),
      metadata: {
        source: 'acp',
        agent_id: agent_id || 'unknown',
        plan_id: plan_id,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    // Return ACP-compliant response
    return NextResponse.json(
      {
        checkout_session: {
          id: session.id,
          status: 'pending',
          checkout_url: session.url,
          plan_id: plan_id,
          amount: session.amount_total,
          currency: session.currency,
        },
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('ACP checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500, headers: corsHeaders }
    )
  }
}
