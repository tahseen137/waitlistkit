import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - WaitlistKit | Waitlist Building Tips & Strategies',
  description: 'Learn how to build viral waitlists, grow your pre-launch email list, and leverage referral mechanics to 10x your signups. Expert guides from WaitlistKit.',
}

const posts = [
  {
    slug: 'how-to-build-viral-waitlist',
    title: 'How to Build a Viral Waitlist: The Complete 2026 Guide',
    description: 'Learn the exact strategies top startups use to build waitlists that spread like wildfire. From referral mechanics to social proof, master the art of viral waitlist growth.',
    date: 'February 6, 2026',
    readTime: '12 min read',
    category: 'Strategy',
  },
  {
    slug: 'best-waitlist-tools-2026',
    title: '7 Best Waitlist Tools for Startups in 2026 (Honest Comparison)',
    description: 'We tested every major waitlist builder so you don\'t have to. Here\'s an honest breakdown of features, pricing, and which tool is right for your startup.',
    date: 'February 5, 2026',
    readTime: '10 min read',
    category: 'Tools',
  },
  {
    slug: 'pre-launch-email-list',
    title: 'How to Build a Pre-Launch Email List That Actually Converts',
    description: 'Most pre-launch email lists fail to convert. Learn the psychology behind high-converting waitlists and the tactics that turn subscribers into customers.',
    date: 'February 4, 2026',
    readTime: '11 min read',
    category: 'Growth',
  },
  {
    slug: 'referral-waitlist-growth',
    title: 'Referral Waitlists: How to 10x Your Signups With Built-In Virality',
    description: 'Discover how companies like Dropbox and Robinhood used referral waitlists to achieve explosive growth. Implement these proven mechanics in your own launch.',
    date: 'February 3, 2026',
    readTime: '13 min read',
    category: 'Referrals',
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          The WaitlistKit Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Expert guides on building viral waitlists, growing your pre-launch audience, and launching products that people actually want.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <Link href={`/blog/${posts[0].slug}`} className="block group">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-48 flex items-center justify-center">
              <span className="text-white text-6xl">🚀</span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                  {posts[0].category}
                </span>
                <span className="text-gray-500 text-sm">{posts[0].date}</span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">{posts[0].readTime}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition">
                {posts[0].title}
              </h2>
              <p className="text-gray-600 text-lg">
                {posts[0].description}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Post Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {posts.slice(1).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 h-32 flex items-center justify-center">
                <span className="text-white text-4xl">
                  {post.category === 'Tools' ? '🛠️' : post.category === 'Growth' ? '📈' : '🔗'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                  Read more →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to build your own viral waitlist?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of founders using WaitlistKit to grow their pre-launch audience with built-in referral mechanics.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition"
        >
          Start for Free
        </Link>
      </div>
    </div>
  )
}
