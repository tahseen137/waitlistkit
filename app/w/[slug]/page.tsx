'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

interface Project {
  id: string
  slug: string
  name: string
  description: string | null
  primaryColor: string
  logo: string | null
  headline: string
  subheadline: string
  buttonText: string
  tier: string
  _count: {
    signups: number
  }
}

interface Signup {
  id: string
  email: string
  position: number
  referralCode: string
  referralCount: number
}

export default function WaitlistPage() {
  const params = useParams() as { slug: string }
  const searchParams = useSearchParams()
  const [project, setProject] = useState<Project | null>(null)
  const [signup, setSignup] = useState<Signup | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const referralCode = searchParams.get('ref')

  useEffect(() => {
    fetchProject()
  }, [params.slug])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/project/${params.slug}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setProject(data.project)
      setLoading(false)
    } catch (err) {
      setError('Failed to load waitlist')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          projectId: project.id,
          referredBy: referralCode
        })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setSubmitting(false)
        return
      }

      setSignup(data.signup)
      setSubmitting(false)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const copyReferralLink = () => {
    if (!signup) return
    const url = `${window.location.origin}/w/${params.slug}?ref=${signup.referralCode}`
    navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-xl text-red-600">{error || 'Waitlist not found'}</div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${project.primaryColor}15 0%, ${project.primaryColor}05 100%)`
      }}
    >
      <div className="max-w-md w-full">
        {!signup ? (
          // Signup Form
          <div 
            className="rounded-2xl shadow-2xl p-8 text-white"
            style={{
              background: `linear-gradient(135deg, ${project.primaryColor} 0%, ${project.primaryColor}dd 100%)`
            }}
          >
            {project.logo && (
              <img src={project.logo} alt={project.name} className="h-16 mb-6 mx-auto" />
            )}
            
            <h1 className="text-4xl font-bold mb-4 text-center">
              {project.headline}
            </h1>
            
            <p className="text-lg mb-8 text-center opacity-95">
              {project.subheadline}
            </p>

            {project.description && (
              <p className="text-sm mb-6 text-center opacity-90">
                {project.description}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />

              {error && (
                <div className="bg-red-500 bg-opacity-20 text-white px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                style={{ color: project.primaryColor }}
              >
                {submitting ? 'Joining...' : project.buttonText}
              </button>
            </form>

            <div className="mt-6 text-center text-sm opacity-75">
              {project._count.signups} {project._count.signups === 1 ? 'person has' : 'people have'} joined
            </div>
          </div>
        ) : (
          // Success State
          <div 
            className="rounded-2xl shadow-2xl p-8 text-white text-center"
            style={{
              background: `linear-gradient(135deg, ${project.primaryColor} 0%, ${project.primaryColor}dd 100%)`
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">You're on the list!</h2>
            
            <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold mb-2">#{signup.position}</div>
              <div className="text-lg opacity-90">
                {signup.position === 1 ? "You're first in line!" : `You're #${signup.position} in line`}
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">Move up the list!</h3>
              <p className="text-sm opacity-90 mb-4">
                Share your unique referral link. Each friend who joins moves you up:
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/w/${params.slug}?ref=${signup.referralCode}`}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-white bg-opacity-90 text-gray-900 rounded-lg hover:bg-opacity-100 transition font-medium"
                  style={{ color: project.primaryColor }}
                >
                  Copy
                </button>
              </div>

              {signup.referralCount > 0 && (
                <div className="mt-4 text-sm">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {signup.referralCount} {signup.referralCount === 1 ? 'referral' : 'referrals'} so far! 🔥
                  </span>
                </div>
              )}
            </div>

            <p className="mt-6 text-sm opacity-75">
              We'll email you at <strong>{signup.email}</strong> when we launch
            </p>
          </div>
        )}

        {/* Powered By Badge */}
        <div className="mt-6 text-center">
          <a 
            href="https://waitlistkit.ca?ref=powered-by"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition font-medium"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="text-sm">🚀</span>
            <span>Powered by WaitlistKit</span>
          </a>
        </div>
      </div>
    </div>
  )
}
