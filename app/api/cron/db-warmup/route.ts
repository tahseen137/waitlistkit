import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * DB Warmup Cron — runs every 5 minutes to keep Neon connection warm.
 * Prevents cold-start 500 errors on /api/signup.
 * Neon free tier pauses after 5 min inactivity; this pings it to stay awake.
 */
export async function GET() {
  try {
    const start = Date.now()
    // Lightweight ping — count projects, no full table scan
    const count = await prisma.project.count()
    const ms = Date.now() - start
    
    return NextResponse.json({
      ok: true,
      projects: count,
      pingMs: ms,
      ts: new Date().toISOString()
    })
  } catch (error) {
    console.error('DB warmup failed:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
