'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { use } from 'react'

interface Signup {
  id: string
  email: string
  position: number
  referralCode: string
  referredBy: string | null
  referralCount: number
  createdAt: string
}

interface AdminData {
  project: {
    id: string
    name: string
    slug: string
    tier: string
  }
  stats: {
    totalSignups: number
    totalReferrals: number
  }
  signups: Signup[]
  topReferrers: Signup[]
}

export default function AdminDashboard() {
  const params = useParams() as { projectId: string }
  const searchParams = useSearchParams()
  const [adminSecret, setAdminSecret] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [embedCode, setEmbedCode] = useState('')

  useEffect(() => {
    // Try to get admin secret from URL or localStorage
    const secretFromUrl = searchParams.get('secret')
    const secretFromStorage = localStorage.getItem(`admin_${params.projectId}`)
    
    const secret = secretFromUrl || secretFromStorage || ''
    
    if (secret) {
      setAdminSecret(secret)
      if (secretFromUrl && !secretFromStorage) {
        localStorage.setItem(`admin_${params.projectId}`, secret)
      }
      fetchData(secret)
    } else {
      setLoading(false)
    }
  }, [params.projectId, searchParams])

  const fetchData = async (secret: string) => {
    try {
      const response = await fetch(`/api/admin/${params.projectId}`, {
        headers: {
          'x-admin-secret': secret
        }
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setData(result)
      setEmbedCode(`<script src="${window.location.origin}/widget.js" data-project="${result.project.slug}" data-waitlistkit></script>`)
      setLoading(false)
    } catch (err) {
      setError('Failed to load data')
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/${params.projectId}/export`, {
        headers: {
          'x-admin-secret': adminSecret
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data?.project.slug}-signups.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    fetchData(adminSecret)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!adminSecret || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleSecretSubmit}>
            <div className="mb-4">
              <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret
              </label>
              <input
                id="secret"
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter your admin secret"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{data.project.name}</h1>
              <p className="text-gray-600">
                <span className="font-medium">Slug:</span> {data.project.slug} 
                <span className="ml-4 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {data.project.tier.toUpperCase()}
                </span>
              </p>
            </div>
            <a
              href={`/w/${data.project.slug}`}
              target="_blank"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              View Public Page
            </a>
          </div>

          {/* Embed Code */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code (add to your website):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={embedCode}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedCode)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Signups</div>
            <div className="text-4xl font-bold text-indigo-600">{data.stats.totalSignups}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Referrals</div>
            <div className="text-4xl font-bold text-purple-600">{data.stats.totalReferrals}</div>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top Referrers</h2>
          </div>
          <div className="space-y-3">
            {data.topReferrers.slice(0, 5).map((signup, idx) => (
              <div key={signup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                  <div>
                    <div className="font-medium">{signup.email}</div>
                    <div className="text-sm text-gray-600">Position: #{signup.position}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {signup.referralCount} referrals
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Signups */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Signups ({data.signups.length})</h2>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Referrals</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Referred By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Signed Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.signups.map((signup) => (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{signup.position}</td>
                    <td className="px-4 py-3">{signup.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-medium">
                        {signup.referralCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {signup.referredBy || 'Direct'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(signup.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
