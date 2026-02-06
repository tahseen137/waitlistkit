import Stripe from 'stripe'

// Initialize Stripe lazily to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set. Please add it to your environment variables.')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '1 waitlist',
      '100 subscribers',
      'Basic analytics',
      'Referral tracking',
      'Embeddable widget',
    ],
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
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
  business: {
    name: 'Business',
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
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
} as const

export type PlanType = keyof typeof PLANS
