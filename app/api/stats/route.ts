import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  try {
    // Count all signups across all projects
    const totalSignups = await prisma.signup.count()
    
    // Count all projects
    const totalProjects = await prisma.project.count()
    
    return NextResponse.json({
      totalSignups,
      totalProjects,
      // Add a minimum floor for social proof
      displaySignups: Math.max(totalSignups, 0)
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { totalSignups: 0, totalProjects: 0, displaySignups: 0 },
      { status: 200 } // Still return 200 to not break the UI
    )
  }
}
