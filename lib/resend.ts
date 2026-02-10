import { Resend } from 'resend'

// Lazy-initialize Resend client to avoid build errors
let _resend: Resend | null = null

export function getResendClient(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

// Email configuration
export const EMAIL_CONFIG = {
  from: 'WaitlistKit <noreply@revive-hq.com>',
  replyTo: 'gandalf@revive-hq.com',
} as const
