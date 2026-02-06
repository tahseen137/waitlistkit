import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSlug, generateAdminSecret, isValidEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, adminEmail, description } = body

    if (!name || !adminEmail) {
      return NextResponse.json(
        { error: 'Name and admin email are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(adminEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create slug from name
    let slug = createSlug(name)
    
    // Check if slug exists, if so add number
    let slugExists = await prisma.project.findUnique({ where: { slug } })
    let counter = 1
    while (slugExists) {
      slug = `${createSlug(name)}-${counter}`
      slugExists = await prisma.project.findUnique({ where: { slug } })
      counter++
    }

    // Generate admin secret
    const adminSecret = generateAdminSecret()

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        adminEmail,
        adminSecret,
        description: description || null
      }
    })

    return NextResponse.json({ 
      project,
      adminSecret // Return this once so they can save it
    })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
