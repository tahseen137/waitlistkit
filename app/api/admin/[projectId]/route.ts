import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const adminSecret = request.headers.get('x-admin-secret')

    if (!adminSecret) {
      return NextResponse.json(
        { error: 'Admin secret required' },
        { status: 401 }
      )
    }

    // Verify admin secret
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        signups: {
          orderBy: { position: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.adminSecret !== adminSecret) {
      return NextResponse.json(
        { error: 'Invalid admin secret' },
        { status: 403 }
      )
    }

    // Calculate stats
    const totalSignups = project.signups.length
    const totalReferrals = project.signups.reduce((sum: number, s: any) => sum + s.referralCount, 0)
    const topReferrers = [...project.signups]
      .sort((a: any, b: any) => b.referralCount - a.referralCount)
      .slice(0, 10)

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        tier: project.tier
      },
      stats: {
        totalSignups,
        totalReferrals
      },
      signups: project.signups,
      topReferrers
    })
  } catch (error) {
    console.error('Admin fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
