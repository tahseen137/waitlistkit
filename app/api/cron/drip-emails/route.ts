import { NextRequest, NextResponse } from 'next/server'
import { processDripEmails } from '@/lib/email-service'

// Vercel Cron calls this endpoint
// Configure in vercel.json with cron schedule

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (in production)
  const authHeader = request.headers.get('authorization')
  
  // In production, Vercel sets CRON_SECRET automatically
  // For local testing, skip auth check
  if (process.env.VERCEL && process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  console.log('Starting drip email processing...')
  const startTime = Date.now()

  try {
    const results = await processDripEmails()
    
    const duration = Date.now() - startTime
    console.log(
      `Drip email processing complete. Day2: ${results.day2Sent}, Day5: ${results.day5Sent}, Errors: ${results.errors.length}, Duration: ${duration}ms`
    )

    return NextResponse.json({
      success: true,
      results: {
        day2EmailsSent: results.day2Sent,
        day5EmailsSent: results.day5Sent,
        errorCount: results.errors.length,
        errors: results.errors.slice(0, 10), // Only return first 10 errors
      },
      durationMs: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing drip emails:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers (with auth)
export async function POST(request: NextRequest) {
  return GET(request)
}
