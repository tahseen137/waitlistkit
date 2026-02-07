'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Fake data
const WAITLIST_NAME = 'ProductX Launch'
const TOTAL_SIGNUPS = 247

const TOP_REFERRERS = [
  { id: 1, name: 'Marcus Chen', email: 'marcus.c***@gmail.com', referrals: 23, position: 4 },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah.m***@outlook.com', referrals: 19, position: 12 },
  { id: 3, name: 'David Rodriguez', email: 'david.r***@yahoo.com', referrals: 15, position: 8 },
  { id: 4, name: 'Emma Thompson', email: 'emma.t***@gmail.com', referrals: 12, position: 21 },
  { id: 5, name: 'James Wilson', email: 'james.w***@proton.me', referrals: 11, position: 15 },
]

const ACTIVITY_FEED = [
  { id: 1, action: 'signed up via referral from', user: 'Sarah J.', referrer: 'Mike T.', time: 'Just now' },
  { id: 2, action: 'shared their referral link', user: 'Alex K.', referrer: null, time: '2 min ago' },
  { id: 3, action: 'signed up via referral from', user: 'Emma L.', referrer: 'Sarah J.', time: '5 min ago' },
  { id: 4, action: 'moved up to position #12', user: 'Marcus C.', referrer: null, time: '8 min ago' },
  { id: 5, action: 'signed up via referral from', user: 'David R.', referrer: 'Marcus C.', time: '12 min ago' },
  { id: 6, action: 'shared their referral link', user: 'Lisa M.', referrer: null, time: '15 min ago' },
  { id: 7, action: 'signed up directly', user: 'Chris P.', referrer: null, time: '18 min ago' },
  { id: 8, action: 'signed up via referral from', user: 'Jordan B.', referrer: 'Lisa M.', time: '21 min ago' },
]

// Chart data - last 14 days with upward trend
const generateChartData = () => {
  const data = []
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    // Generate upward trending data with some variance
    const baseValue = 5 + (13 - i) * 1.5
    const variance = Math.random() * 8 - 2
    const signups = Math.max(3, Math.round(baseValue + variance))
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      signups,
    })
  }
  return data
}

// Simple SVG chart component
function SignupChart({ data }: { data: { date: string; signups: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.signups))
  const chartHeight = 200
  const chartWidth = 100
  const padding = 10

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding
    const y = chartHeight - padding - (d.signups / maxValue) * (chartHeight - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const areaPath = `M ${padding},${chartHeight - padding} L ${points} L ${chartWidth - padding},${chartHeight - padding} Z`

  return (
    <div className="relative w-full h-64">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(129, 140, 248)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(129, 140, 248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGradient)" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="rgb(129, 140, 248)"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding
          const y = chartHeight - padding - (d.signups / maxValue) * (chartHeight - padding * 2)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="rgb(129, 140, 248)"
              className="hover:fill-white transition-colors"
            />
          )
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  )
}

export default function DemoPage() {
  const [chartData, setChartData] = useState<{ date: string; signups: number }[]>([])
  const [activityIndex, setActivityIndex] = useState(0)
  const [liveSignups, setLiveSignups] = useState(TOTAL_SIGNUPS)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  useEffect(() => {
    setChartData(generateChartData())
  }, [])

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(prev => (prev + 1) % ACTIVITY_FEED.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Simulate signup counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLiveSignups(prev => prev + 1)
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoSubmitted(true)
    setTimeout(() => {
      setDemoSubmitted(false)
      setDemoEmail('')
    }, 3000)
  }

  // Calculate stats
  const referralRate = 34.2 // percentage of users who came via referral
  const conversionRate = 12.8 // percentage of visitors who signed up
  const avgPosition = 124

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* CTA Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-3 px-4 text-center backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            <span className="font-medium">This is demo data.</span>
          </span>
          <span className="text-white/80">Connect your project to see real numbers</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition text-sm"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                WaitlistKit
              </Link>
              <span className="text-gray-600">→</span>
              <span className="text-gray-400">Dashboard Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Live Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{WAITLIST_NAME}</h1>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-gray-400">
                <span className="font-mono text-indigo-400">productx-launch</span>
                <span className="mx-2 text-gray-600">•</span>
                Created Jan 15, 2025
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition border border-gray-700">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View Public Page
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Signups</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{liveSignups.toLocaleString()}</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +18.3% this week
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Referral Rate</span>
              <span className="text-2xl">🔗</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{referralRate}%</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +5.2% this week
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Conversion Rate</span>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{conversionRate}%</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +2.1% this week
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg. Position</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">#{avgPosition}</div>
            <div className="text-sm text-gray-500">
              Median position in queue
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Chart & Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Signup Growth Chart */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Signup Growth</h2>
                  <p className="text-gray-400 text-sm">Last 14 days</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg">14 days</button>
                  <button className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-lg hover:bg-gray-700 transition">30 days</button>
                  <button className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-lg hover:bg-gray-700 transition">All time</button>
                </div>
              </div>
              {chartData.length > 0 && <SignupChart data={chartData} />}
            </div>

            {/* Referral Leaderboard */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Referral Leaderboard</h2>
                  <p className="text-gray-400 text-sm">Top 5 referrers this month</p>
                </div>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="space-y-3">
                {TOP_REFERRERS.map((referrer, idx) => (
                  <div
                    key={referrer.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30'
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        idx === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                        idx === 1 ? 'bg-gray-400 text-gray-900' :
                        idx === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">{referrer.name}</div>
                        <div className="text-sm text-gray-500">{referrer.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-400">{referrer.referrals}</div>
                      <div className="text-sm text-gray-500">referrals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Preview */}
          <div className="space-y-8">
            {/* Live Activity Feed */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Live Activity</h2>
                  <p className="text-gray-400 text-sm">Real-time updates</p>
                </div>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ACTIVITY_FEED.map((activity, idx) => (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg transition-all duration-500 ${
                      idx === activityIndex ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        activity.referrer ? 'bg-purple-600' : 'bg-gray-700'
                      }`}>
                        {activity.referrer ? '🔗' : '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200">
                          <span className="font-medium text-white">{activity.user}</span>
                          {' '}{activity.action}
                          {activity.referrer && (
                            <span className="font-medium text-indigo-400"> {activity.referrer}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Capture Preview */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Embed Preview</h2>
                  <p className="text-gray-400 text-sm">What visitors see</p>
                </div>
                <span className="text-2xl">🖼️</span>
              </div>
              
              {/* Browser mockup */}
              <div className="bg-gray-800 rounded-t-lg p-2 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-700 text-gray-400 text-xs px-3 py-0.5 rounded">
                    yoursite.com
                  </div>
                </div>
              </div>

              {/* Widget preview */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-b-lg">
                <div 
                  className="rounded-xl p-5 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  }}
                >
                  {!demoSubmitted ? (
                    <>
                      <h3 className="text-lg font-bold mb-1 text-center">Join the waitlist</h3>
                      <p className="text-sm mb-4 text-center opacity-90">Be first to know when we launch</p>
                      <form onSubmit={handleDemoSubmit} className="space-y-3">
                        <input
                          type="email"
                          value={demoEmail}
                          onChange={(e) => setDemoEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-opacity-90 transition text-sm"
                        >
                          Join waitlist
                        </button>
                      </form>
                      <p className="text-center text-xs mt-3 opacity-75">
                        {liveSignups.toLocaleString()} people have joined
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2">🎉</div>
                      <h3 className="text-lg font-bold mb-1">You're on the list!</h3>
                      <p className="text-sm opacity-90">Position #{liveSignups}</p>
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Powered by WaitlistKit
                </p>
              </div>
            </div>

            {/* Embed Code */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold mb-3">Your Embed Code</h3>
              <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <pre>{`<script
  src="waitlistkit.com/widget.js"
  data-project="productx-launch"
></script>`}</pre>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm">
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your own waitlist?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Set up your waitlist in under 60 seconds. No credit card required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition text-lg"
            >
              Create Your Waitlist — Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition text-lg border border-gray-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
