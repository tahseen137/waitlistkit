'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            WaitlistKit
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Add a waitlist to your site in 60 seconds
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            One script tag. Beautiful email capture. Built-in referral system. Move your users up the list when they share.
          </p>
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

        {/* Code Example */}
        <div className="bg-gray-900 text-gray-100 rounded-xl p-8 shadow-2xl mb-16">
          <h3 className="text-xl font-bold mb-4 text-white">How to Use</h3>
          <p className="text-gray-300 mb-4">Just add this to your HTML:</p>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-green-400">
{`<script 
  src="https://waitlistkit.vercel.app/widget.js" 
  data-project="your-project-slug"
  data-waitlistkit
></script>`}
            </code>
          </pre>
        </div>

        {/* Pricing */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1 waitlist
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  100 signups
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Referral tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Admin dashboard
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-2xl transform scale-105">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$9<span className="text-xl">/mo</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Unlimited waitlists
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Unlimited signups
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Custom branding
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <a href="/pricing" className="block w-full bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition text-center">
                Upgrade to Pro
              </a>
            </div>
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
