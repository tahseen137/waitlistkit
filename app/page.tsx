'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LiveDemo from './components/LiveDemo'

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<{ totalSignups: number; totalProjects: number } | null>(null)
  
  // Product Hunt banner - show for 7 days after launch
  const launchDate = new Date('2025-02-14')
  const now = new Date()
  const daysSinceLaunch = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
  const showProductHuntBanner = daysSinceLaunch <= 7

  // Fetch signup stats for social proof counter
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null))
  }, [])

  const handleCheckout = async (priceId: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          email: email || undefined 
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Checkout failed')
      }
    } catch (err) {
      console.error(err)
      setError('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, adminEmail: email })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      // Store admin secret in localStorage (just for demo, production would use proper auth)
      localStorage.setItem(`admin_${data.project.id}`, data.adminSecret)
      
      // Redirect to admin dashboard
      router.push(`/admin/${data.project.id}?secret=${data.adminSecret}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Product Hunt Banner - Auto-hides after launch period */}
      {showProductHuntBanner && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 text-center">
          <a 
            href="https://www.producthunt.com/products/waitlistkit-3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:underline font-medium"
          >
            <span>🚀</span>
            <span>We're LIVE on Product Hunt!</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">Support us →</span>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Social Proof */}
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <span className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-300 flex items-center justify-center text-xs">👤</span>
              <span className="w-6 h-6 rounded-full bg-purple-300 flex items-center justify-center text-xs">👤</span>
              <span className="w-6 h-6 rounded-full bg-pink-300 flex items-center justify-center text-xs">👤</span>
            </span>
            <span>
              {stats && stats.totalSignups >= 50 
                ? `${stats.totalSignups.toLocaleString()} signups collected across ${stats.totalProjects} ${stats.totalProjects === 1 ? 'project' : 'projects'}` 
                : 'Join founders building viral waitlists'}
            </span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            WaitlistKit
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Add a waitlist to your site in 60 seconds
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
            One script tag. Beautiful email capture. Built-in referral system. Move your users up the list when they share.
          </p>
          
          {/* Demo CTA */}
          <Link 
            href="/demo" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 group"
          >
            <span className="text-xl">▶️</span>
            <span>See the interactive demo</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Create Waitlist Form */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Waitlist</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Product"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Waitlist (Free)'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Free: 1 waitlist, 100 signups
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">60-Second Setup</h3>
            <p className="text-gray-600">
              Add one script tag to your site. No complex integration. No backend required.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">Viral Referrals</h3>
            <p className="text-gray-600">
              Each user gets a unique referral link. They move up when friends sign up.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
            <p className="text-gray-600">
              See all signups, referral chains, and export to CSV. Track your launch.
            </p>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-20">
          <LiveDemo />
        </div>

        {/* Code Example */}
        <div id="create" className="bg-gray-900 text-gray-100 rounded-xl p-8 shadow-2xl mb-16">
          <h3 className="text-xl font-bold mb-4 text-white">How to Use</h3>
          <p className="text-gray-300 mb-4">Just add this to your HTML:</p>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-green-400">
{`<script 
  src="https://waitlistkit.ca/widget.js" 
  data-project="your-project-slug"
  data-waitlistkit
></script>`}
            </code>
          </pre>
        </div>

        {/* Pricing */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Free */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Free</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-extrabold text-gray-900">$0</span>
              </div>
              <p className="text-gray-500 mb-6 text-sm">Perfect for testing</p>
              
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  1 waitlist
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  100 signups
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  WaitlistKit branding
                </li>
              </ul>
              
              <Link 
                href="/#create"
                className="block w-full text-center bg-gray-100 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Starter - $19/mo */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-200">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Starter</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-extrabold text-gray-900">$19</span>
                <span className="ml-1 text-gray-500 text-sm">/mo</span>
              </div>
              <p className="text-gray-500 mb-6 text-sm">For small launches</p>
              
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  3 waitlists
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  1,000 signups
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom branding
                </li>
              </ul>
              
              <button 
                onClick={() => handleCheckout('price_starter_monthly')}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Start Trial
              </button>
            </div>

            {/* Pro - $49/mo */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-2xl transform scale-105 border-2 border-indigo-400">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 mt-2">Pro</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-extrabold">$49</span>
                <span className="ml-1 text-indigo-200 text-sm">/mo</span>
              </div>
              <p className="text-indigo-100 mb-6 text-sm">For serious launches</p>
              
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Unlimited waitlists
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Unlimited signups
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  API access
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              
              <button 
                onClick={() => handleCheckout('price_pro_monthly')}
                className="w-full bg-yellow-400 text-indigo-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition"
              >
                Start Trial
              </button>
            </div>

            {/* Lifetime - $149 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-300">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                LIMITED OFFER
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-800">Lifetime</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-extrabold text-gray-900">$149</span>
                <span className="ml-1 text-gray-500 text-sm">once</span>
              </div>
              <p className="text-gray-500 mb-6 text-sm">Pay once, use forever</p>
              
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  Lifetime access
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-2">✓</span>
                  No recurring fees
                </li>
              </ul>
              
              <button 
                onClick={() => handleCheckout('price_lifetime')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                Get Lifetime
              </button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-indigo-600 hover:underline font-medium">
              See detailed pricing comparison →
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials / Social Proof Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Founders Are Saying</h2>
          <p className="text-gray-500 text-sm">(Example results from beta testers)</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Example Testimonial 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-1 mb-3 text-yellow-400">
              {'★★★★★'.split('').map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "Set up in 5 minutes. Got 200+ signups in the first week with the referral system."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-medium text-gray-900">SaaS Founder</div>
                <div className="text-sm text-gray-500">Beta Tester</div>
              </div>
            </div>
          </div>
          
          {/* Example Testimonial 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-1 mb-3 text-yellow-400">
              {'★★★★★'.split('').map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "The viral referral loop is genius. 40% of my signups came from referrals."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <div className="font-medium text-gray-900">App Developer</div>
                <div className="text-sm text-gray-500">Beta Tester</div>
              </div>
            </div>
          </div>
          
          {/* CTA Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center items-center text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-bold text-xl mb-2">Support Us on Product Hunt!</h3>
            <p className="text-white/80 text-sm mb-4">
              We're LIVE on Product Hunt! Your upvote means the world to us!
            </p>
            <a 
              href="https://www.producthunt.com/products/waitlistkit-3" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              Upvote on Product Hunt →
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 border-t border-gray-200">
        <p className="mb-2">Built with ❤️ for founders who ship fast</p>
        <div className="flex justify-center gap-4 text-sm">
          <Link href="/demo" className="text-indigo-600 hover:underline">Demo</Link>
          <Link href="/pricing" className="text-indigo-600 hover:underline">Pricing</Link>
          <Link href="/blog" className="text-indigo-600 hover:underline">Blog</Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Keep your waitlist engaged after launch → <a href="https://revive-hq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Revive</a>
        </p>
      </footer>
    </div>
  )
}
