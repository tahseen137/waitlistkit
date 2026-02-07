'use client'

import { useState, useEffect } from 'react'

export default function LiveDemo() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState(0)
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [totalSignups, setTotalSignups] = useState(847)

  // Simulate realistic signup count that grows
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSignups(prev => prev + Math.floor(Math.random() * 2))
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const generateReferralCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate realistic position and referral code
    const newPosition = totalSignups + 1
    const code = generateReferralCode()
    
    setPosition(newPosition)
    setReferralCode(code)
    setTotalSignups(prev => prev + 1)
    setLoading(false)
    setSubmitted(true)
  }

  const handleReset = () => {
    setEmail('')
    setSubmitted(false)
    setPosition(0)
    setReferralCode('')
    setCopied(false)
  }

  const copyReferralLink = () => {
    const url = `https://waitlistkit.vercel.app/w/demo?ref=${referralCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE DEMO
        </span>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          See it in action
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This is exactly what your visitors will see. Enter any email to test the full experience—signup, position, and referral link.
        </p>
      </div>

      {/* Browser mockup */}
      <div className="bg-gray-800 rounded-t-xl p-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-gray-700 text-gray-300 text-sm px-4 py-1 rounded-md flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            yourproduct.com
          </div>
        </div>
      </div>

      {/* Widget preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 rounded-b-xl shadow-2xl">
        <div 
          className="max-w-md mx-auto rounded-2xl shadow-2xl p-8 text-white transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
          }}
        >
          {!submitted ? (
            <>
              <h3 className="text-3xl font-bold mb-2 text-center">
                Join the waitlist
              </h3>
              <p className="text-lg mb-6 text-center opacity-95">
                Be the first to know when we launch
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Joining...
                    </>
                  ) : (
                    'Join waitlist'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm opacity-75">
                {totalSignups.toLocaleString()} people have joined
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4">You're on the list!</h3>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6">
                <div className="text-5xl font-bold mb-2">#{position}</div>
                <div className="text-lg opacity-90">
                  You're #{position} in line
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-5 text-left">
                <h4 className="text-lg font-bold mb-2 text-center">Move up the list!</h4>
                <p className="text-sm opacity-90 mb-4 text-center">
                  Share your unique referral link. Each friend who joins moves you up:
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`waitlistkit.vercel.app/w/demo?ref=${referralCode}`}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm truncate"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-2 bg-white bg-opacity-90 text-indigo-600 rounded-lg hover:bg-opacity-100 transition font-medium flex-shrink-0"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="mt-5 text-sm opacity-75">
                We'll email you at <strong>{email}</strong> when we launch
              </p>
            </div>
          )}
        </div>

        {/* Powered by badge */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Powered by WaitlistKit
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {submitted && (
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            ← Try again
          </button>
        )}
        <a
          href="#create"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Create your waitlist →
        </a>
      </div>
    </div>
  )
}
