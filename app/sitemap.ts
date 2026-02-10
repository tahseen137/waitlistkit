import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://waitlistkit.ca'

  const blogPosts = [
    {
      slug: 'how-to-build-viral-waitlist',
      lastModified: '2026-02-06',
    },
    {
      slug: 'best-waitlist-tools-2026',
      lastModified: '2026-02-05',
    },
    {
      slug: 'pre-launch-email-list',
      lastModified: '2026-02-04',
    },
    {
      slug: 'referral-waitlist-growth',
      lastModified: '2026-02-03',
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.lastModified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
