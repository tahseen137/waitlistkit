import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateReferralCode, isValidEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, projectId, referredBy } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { _count: { select: { signups: true } } }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check tier limits
    if (project.tier === 'free' && project._count.signups >= 100) {
      return NextResponse.json(
        { error: 'Waitlist is full. Please upgrade to Pro for unlimited signups.' },
        { status: 403 }
      )
    }

    // Check if email already signed up
    const existingSignup = await prisma.signup.findUnique({
      where: {
        projectId_email: {
          projectId,
          email
        }
      }
    })

    if (existingSignup) {
      return NextResponse.json({
        signup: existingSignup,
        alreadySignedUp: true
      })
    }

    // Calculate position
    const signupCount = await prisma.signup.count({
      where: { projectId }
    })
    
    let position = signupCount + 1
    
    // If referred by someone, calculate boosted position
    if (referredBy) {
      const referrer = await prisma.signup.findUnique({
        where: { referralCode: referredBy }
      })
      
      if (referrer && referrer.projectId === projectId) {
        // Update referrer's count
        await prisma.signup.update({
          where: { id: referrer.id },
          data: { referralCount: { increment: 1 } }
        })
        
        // Move referrer up based on referral count
        const newReferrerPosition = Math.max(1, referrer.position - 1)
        await prisma.signup.update({
          where: { id: referrer.id },
          data: { position: newReferrerPosition }
        })
        
        // Update positions of others
        await prisma.$executeRaw`
          UPDATE Signup 
          SET position = position + 1 
          WHERE projectId = ${projectId} 
          AND position >= ${newReferrerPosition}
          AND id != ${referrer.id}
        `
      }
    }

    // Create signup
    const signup = await prisma.signup.create({
      data: {
        email,
        projectId,
        position,
        referralCode: generateReferralCode(),
        referredBy: referredBy || null
      }
    })

    return NextResponse.json({ signup })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
