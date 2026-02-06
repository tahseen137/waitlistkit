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

    // Generate CSV
    const csvHeaders = 'Position,Email,Referral Code,Referred By,Referral Count,Signed Up At\n'
    const csvRows = project.signups.map((signup: any) => {
      return [
        signup.position,
        signup.email,
        signup.referralCode,
        signup.referredBy || 'Direct',
        signup.referralCount,
        new Date(signup.createdAt).toISOString()
      ].join(',')
    }).join('\n')

    const csv = csvHeaders + csvRows

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${project.slug}-signups.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
