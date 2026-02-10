# WaitlistKit Email Drip Sequence

## Overview

A 3-email drip sequence is now set up for WaitlistKit waitlist signups:

1. **Welcome Email** (immediate) - "You're on the list!" with position, referral link, and share CTA
2. **Day 2 Email** (24 hours later) - Tips on how to move up the waitlist, social proof
3. **Day 5 Email** (5 days later) - "Your waitlist is waiting" - CTA to create their own waitlist

## Files Created

- `lib/resend.ts` - Resend client initialization
- `lib/emails.ts` - HTML/text email templates
- `lib/email-service.ts` - Email sending logic with deduplication
- `app/api/cron/drip-emails/route.ts` - Cron endpoint for drip emails
- `vercel.json` - Cron job configuration (runs daily at 2 PM UTC)

## Schema Changes

Added to `Signup` model in `prisma/schema.prisma`:
- `welcomeEmailSentAt` - Timestamp when welcome email was sent
- `day2EmailSentAt` - Timestamp when day 2 email was sent  
- `day5EmailSentAt` - Timestamp when day 5 email was sent

## Required Environment Variable

### ⚠️ ACTION REQUIRED: Add RESEND_API_KEY to Vercel

Emails won't send until you add a valid Resend API key:

```bash
cd /Users/clawdbot/.openclaw/workspace/waitlistkit
printf 're_YOUR_API_KEY_HERE' | vercel env add RESEND_API_KEY production --yes
```

Get your API key from: https://resend.com/api-keys

**Using domain:** revive-hq.com (already verified in Resend)
- From address: `WaitlistKit <noreply@revive-hq.com>`
- Reply-to: `gandalf@revive-hq.com`

## How It Works

### Welcome Email
- Triggered immediately when a user signs up (fire-and-forget, non-blocking)
- Includes their position, personal referral link, and Twitter share button

### Drip Emails
- Cron job runs daily at 2 PM UTC (9 AM EST / 10 AM EDT)
- Finds signups eligible for Day 2 email (created 24+ hours ago, hasn't received it)
- Finds signups eligible for Day 5 email (created 5+ days ago, hasn't received it)
- Sends emails in batches with small delays to avoid rate limits

## Testing

### Test the cron endpoint manually:
```bash
curl https://waitlistkit-seven.vercel.app/api/cron/drip-emails
```

### Test locally:
```bash
# Make sure RESEND_API_KEY is set in .env.local
npm run dev
# Sign up with a test email to trigger welcome email
# Check Resend dashboard for sent emails
```

## Email Copy

The emails are production-ready with:
- Compelling subject lines with emojis
- Mobile-responsive HTML design
- Plain text fallbacks
- Clear CTAs and referral links
- Conversion-focused Day 5 email nudging users to create their own waitlist

## Upgrading to Pro Plan

On Vercel Pro plan, you can change the cron schedule in `vercel.json` to run more frequently:

```json
{
  "crons": [
    {
      "path": "/api/cron/drip-emails",
      "schedule": "0 9,21 * * *"
    }
  ]
}
```

This runs twice daily at 9 AM and 9 PM UTC for faster email delivery.
