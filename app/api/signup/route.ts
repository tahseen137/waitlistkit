import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateReferralCode, isValidEmail } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/email-service'

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
      // Calculate dynamic rank for existing user
      const rank = await prisma.signup.count({
        where: {
          projectId,
          OR: [
            { referralCount: { gt: existingSignup.referralCount } },
            { referralCount: existingSignup.referralCount, createdAt: { lt: existingSignup.createdAt } }
          ]
        }
      }) + 1

      return NextResponse.json({
        signup: { ...existingSignup, position: rank },
        alreadySignedUp: true
      })
    }

    // Calculate position (insertion order)
    const signupCount = await prisma.signup.count({
      where: { projectId }
    })
    
    let position = signupCount + 1
    
    // Handle referral (atomic increment, no shifting)
    if (referredBy) {
      const referrer = await prisma.signup.findUnique({
        where: { referralCode: referredBy }
      })
      
      if (referrer && referrer.projectId === projectId) {
        // Just increment the count safely
        await prisma.signup.update({
          where: { id: referrer.id },
          data: { referralCount: { increment: 1 } }
        })
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

    // Send welcome email (fire and forget - don't block the response)
    sendWelcomeEmail(signup.id).catch((err) => {
      console.error('Failed to send welcome email:', err)
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
