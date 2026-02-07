import Link from 'next/link'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            WaitlistKit
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Blog
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">
              Pricing
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WaitlistKit
              </Link>
              <p className="text-gray-600 mt-3 max-w-sm">
                The simplest way to build a viral waitlist for your next product launch. One script tag, built-in referrals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition">Home</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition">Pricing</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-indigo-600 transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog/how-to-build-viral-waitlist" className="text-gray-600 hover:text-indigo-600 transition">Viral Waitlist Guide</Link></li>
                <li><Link href="/blog/best-waitlist-tools-2026" className="text-gray-600 hover:text-indigo-600 transition">Best Tools Comparison</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>Built with ❤️ for founders who ship fast</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
