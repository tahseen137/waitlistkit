import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Neon connection pooler URL for production to prevent cold-start 500s.
// The pooler endpoint keeps connections warm across Vercel serverless invocations.
function getDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  
  // If already using pooler endpoint, return as-is
  if (url.includes('-pooler.')) return url
  
  // Convert direct connection to pooler: add pgbouncer=true for Prisma compatibility
  // Neon pooler URL: ep-xxx-pooler.region.aws.neon.tech
  const poolerUrl = url.replace(
    /ep-([^.]+)\.([^/]+)/,
    'ep-$1-pooler.$2'
  )
  // Add pgbouncer param for Prisma compatibility with PgBouncer
  if (poolerUrl.includes('neon.tech') && !poolerUrl.includes('pgbouncer')) {
    return poolerUrl.includes('?')
      ? `${poolerUrl}&pgbouncer=true&connection_limit=1`
      : `${poolerUrl}?pgbouncer=true&connection_limit=1`
  }
  return poolerUrl
}

const prismaClientOptions = process.env.NODE_ENV === 'production'
  ? { datasources: { db: { url: getDatasourceUrl() } } }
  : {}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
