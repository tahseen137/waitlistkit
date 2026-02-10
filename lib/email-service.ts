import { getResendClient, EMAIL_CONFIG } from './resend'
import { prisma } from './prisma'
import {
  getWelcomeEmailHtml,
  getWelcomeEmailText,
  getDayTwoEmailHtml,
  getDayTwoEmailText,
  getDayFiveEmailHtml,
  getDayFiveEmailText,
  EmailType,
} from './emails'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.ca'

interface SendResult {
  success: boolean
  error?: string
  messageId?: string
}

// Calculate dynamic position based on referral count
async function getPosition(signupId: string, projectId: string): Promise<number> {
  const signup = await prisma.signup.findUnique({
    where: { id: signupId },
    select: { referralCount: true, createdAt: true },
  })

  if (!signup) return 0

  const rank = await prisma.signup.count({
    where: {
      projectId,
      OR: [
        { referralCount: { gt: signup.referralCount } },
        {
          referralCount: signup.referralCount,
          createdAt: { lt: signup.createdAt },
        },
      ],
    },
  })

  return rank + 1
}

export async function sendWelcomeEmail(signupId: string): Promise<SendResult> {
  try {
    const signup = await prisma.signup.findUnique({
      where: { id: signupId },
      include: { project: true },
    })

    if (!signup) {
      return { success: false, error: 'Signup not found' }
    }

    if (signup.welcomeEmailSentAt) {
      return { success: true, error: 'Already sent' }
    }

    const position = await getPosition(signupId, signup.projectId)
    const referralLink = `${BASE_URL}/${signup.project.slug}?ref=${signup.referralCode}`

    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: signup.email,
      subject: `🎉 You're #${position} on the WaitlistKit waitlist!`,
      html: getWelcomeEmailHtml({ position, referralCode: signup.referralCode, referralLink }),
      text: getWelcomeEmailText({ position, referralCode: signup.referralCode, referralLink }),
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error: error.message }
    }

    // Mark as sent
    await prisma.signup.update({
      where: { id: signupId },
      data: { welcomeEmailSentAt: new Date() },
    })

    console.log(`Welcome email sent to ${signup.email}, messageId: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('Exception sending welcome email:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function sendDayTwoEmail(signupId: string): Promise<SendResult> {
  try {
    const signup = await prisma.signup.findUnique({
      where: { id: signupId },
      include: { project: true },
    })

    if (!signup) {
      return { success: false, error: 'Signup not found' }
    }

    if (signup.day2EmailSentAt) {
      return { success: true, error: 'Already sent' }
    }

    const position = await getPosition(signupId, signup.projectId)
    const referralLink = `${BASE_URL}/${signup.project.slug}?ref=${signup.referralCode}`

    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: signup.email,
      subject: `⚡ Quick tip to jump the line (you're #${position})`,
      html: getDayTwoEmailHtml({
        position,
        referralCode: signup.referralCode,
        referralLink,
        referralCount: signup.referralCount,
      }),
      text: getDayTwoEmailText({
        position,
        referralCode: signup.referralCode,
        referralLink,
        referralCount: signup.referralCount,
      }),
    })

    if (error) {
      console.error('Error sending day 2 email:', error)
      return { success: false, error: error.message }
    }

    // Mark as sent
    await prisma.signup.update({
      where: { id: signupId },
      data: { day2EmailSentAt: new Date() },
    })

    console.log(`Day 2 email sent to ${signup.email}, messageId: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('Exception sending day 2 email:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function sendDayFiveEmail(signupId: string): Promise<SendResult> {
  try {
    const signup = await prisma.signup.findUnique({
      where: { id: signupId },
    })

    if (!signup) {
      return { success: false, error: 'Signup not found' }
    }

    if (signup.day5EmailSentAt) {
      return { success: true, error: 'Already sent' }
    }

    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: signup.email,
      subject: '💡 Your waitlist is waiting...',
      html: getDayFiveEmailHtml({ email: signup.email }),
      text: getDayFiveEmailText({ email: signup.email }),
    })

    if (error) {
      console.error('Error sending day 5 email:', error)
      return { success: false, error: error.message }
    }

    // Mark as sent
    await prisma.signup.update({
      where: { id: signupId },
      data: { day5EmailSentAt: new Date() },
    })

    console.log(`Day 5 email sent to ${signup.email}, messageId: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('Exception sending day 5 email:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Process drip emails for eligible signups
export async function processDripEmails(): Promise<{
  day2Sent: number
  day5Sent: number
  errors: string[]
}> {
  const now = new Date()
  const day2Cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
  const day5Cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago

  const results = { day2Sent: 0, day5Sent: 0, errors: [] as string[] }

  // Find signups eligible for Day 2 email
  const day2Eligible = await prisma.signup.findMany({
    where: {
      welcomeEmailSentAt: { not: null }, // Must have received welcome email
      day2EmailSentAt: null, // Haven't received day 2 email
      createdAt: { lte: day2Cutoff }, // At least 24 hours old
    },
    take: 100, // Process in batches
  })

  for (const signup of day2Eligible) {
    const result = await sendDayTwoEmail(signup.id)
    if (result.success && !result.error) {
      results.day2Sent++
    } else if (result.error && result.error !== 'Already sent') {
      results.errors.push(`Day2 ${signup.email}: ${result.error}`)
    }
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Find signups eligible for Day 5 email
  const day5Eligible = await prisma.signup.findMany({
    where: {
      welcomeEmailSentAt: { not: null }, // Must have received welcome email
      day5EmailSentAt: null, // Haven't received day 5 email
      createdAt: { lte: day5Cutoff }, // At least 5 days old
    },
    take: 100, // Process in batches
  })

  for (const signup of day5Eligible) {
    const result = await sendDayFiveEmail(signup.id)
    if (result.success && !result.error) {
      results.day5Sent++
    } else if (result.error && result.error !== 'Already sent') {
      results.errors.push(`Day5 ${signup.email}: ${result.error}`)
    }
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return results
}
