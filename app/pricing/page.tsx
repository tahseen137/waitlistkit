'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    description: 'Perfect for testing the waters',
    features: [
      '1 waitlist',
      '100 signups',
      'Referral tracking',
      'Embeddable widget',
      'WaitlistKit branding',
    ],
    cta: 'Get Started',
    href: '/',
    popular: false,
    priceId: null,
    yearlyPriceId: null,
    isLifetime: false,
  },
  {
    name: 'Starter',
    price: 19,
    yearlyPrice: 15,
    description: 'For small launches',
    features: [
      '3 waitlists',
      '1,000 signups',
      'Custom branding',
      'Email notifications',
      'CSV export',
      'Basic analytics',
    ],
    cta: 'Start Trial',
    popular: false,
    priceId: 'price_starter_monthly',
    yearlyPriceId: 'price_starter_yearly',
    isLifetime: false,
  },
  {
    name: 'Pro',
    price: 49,
    yearlyPrice: 39,
    description: 'For serious launches',
    features: [
      'Unlimited waitlists',
      'Unlimited signups',
      'API access',
      'Webhooks',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
    cta: 'Start Trial',
    popular: true,
    priceId: 'price_pro_monthly',
    yearlyPriceId: 'price_pro_yearly',
    isLifetime: false,
  },
  {
    name: 'Lifetime',
    price: 149,
    yearlyPrice: 149,
    description: 'Pay once, use forever',
    features: [
      'Everything in Pro',
      'Unlimited waitlists',
      'Unlimited signups',
      'API access',
      'Priority support',
      'Lifetime access',
      'No recurring fees',
    ],
    cta: 'Get Lifetime Deal',
    popular: false,
    priceId: 'price_lifetime',
    yearlyPriceId: 'price_lifetime',
    isLifetime: true,
    badge: 'LIMITED OFFER',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleCheckout = async (priceId: string | null | undefined, planName: string) => {
    if (!priceId) {
      alert('Stripe price ID not configured. Please add NEXT_PUBLIC_STRIPE_PRO_PRICE_ID and NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID to your environment variables.')
      return
    }

    setLoading(planName)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        setLoading(null)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            WaitlistKit
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </Link>
        </nav>
      </header>

      {/* Pricing Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-indigo-600 rounded-full p-1 transition-colors"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-lg ${billingPeriod === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-2 text-sm text-green-600 font-medium">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl p-6 ${
                plan.popular
                  ? 'ring-2 ring-indigo-600 scale-105 z-10'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              
              {plan.badge && !plan.popular && (
                <div className="mb-2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded inline-block">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.isLifetime ? plan.price : (billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 mb-2 text-sm">
                      {plan.isLifetime ? 'once' : '/mo'}
                    </span>
                  )}
                </div>
                {billingPeriod === 'yearly' && plan.price > 0 && !plan.isLifetime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Billed ${plan.yearlyPrice * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.href ? (
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(
                    billingPeriod === 'yearly' ? plan.yearlyPriceId : plan.priceId,
                    plan.name
                  )}
                  disabled={loading === plan.name}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.name ? 'Redirecting...' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade at any time?</h3>
              <p className="text-gray-600">
                Yes! You can change your plan at any time. When upgrading, you&apos;ll be charged the prorated difference. When downgrading, you&apos;ll receive credit towards future billing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">What happens if I exceed my subscriber limit?</h3>
              <p className="text-gray-600">
                We&apos;ll notify you when you&apos;re approaching your limit. New signups will be paused until you upgrade or free up space by archiving old subscribers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee. If you&apos;re not satisfied, contact us for a full refund.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">
                Start with our Free plan to test everything out. When you&apos;re ready to scale, upgrade to Pro or Business with our 14-day guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your waitlist?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of founders who use WaitlistKit to launch their products.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition"
            >
              Start for Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>Built with ❤️ for founders who ship fast</p>
      </footer>
    </div>
  )
}
