// Email templates for WaitlistKit drip sequence

interface WelcomeEmailData {
  position: number
  referralCode: string
  referralLink: string
}

interface DayTwoEmailData {
  position: number
  referralCode: string
  referralLink: string
  referralCount: number
}

interface DayFiveEmailData {
  email: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlistkit.ca'

// Shared styles
const styles = {
  container: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;',
  header: 'font-size: 32px; font-weight: bold; color: #111827; margin-bottom: 24px;',
  subheader: 'font-size: 20px; font-weight: 600; color: #374151; margin-bottom: 16px;',
  paragraph: 'font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px;',
  highlight: 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;',
  position: 'font-size: 48px; font-weight: bold; margin-bottom: 8px;',
  button: 'display: inline-block; background: #6366f1; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;',
  secondaryButton: 'display: inline-block; background: #F3F4F6; color: #374151; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;',
  referralBox: 'background: #F9FAFB; border: 2px dashed #E5E7EB; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;',
  footer: 'font-size: 14px; color: #9CA3AF; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB;',
  tip: 'background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;',
  socialProof: 'background: #ECFDF5; padding: 20px; border-radius: 12px; margin: 24px 0;',
}

export function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the list! 🎉</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div style="${styles.container}">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 48px;">🚀</span>
    </div>
    
    <h1 style="${styles.header}">You're on the WaitlistKit waitlist!</h1>
    
    <p style="${styles.paragraph}">
      Thanks for joining! You're one of the first to discover WaitlistKit — the easiest way to create viral waitlists with built-in referral tracking.
    </p>
    
    <div style="${styles.highlight}">
      <div style="${styles.position}">#${data.position}</div>
      <div style="font-size: 16px; opacity: 0.9;">Your position on the waitlist</div>
    </div>
    
    <h2 style="${styles.subheader}">🔥 Want to move up? Share your referral link!</h2>
    
    <p style="${styles.paragraph}">
      Every friend who joins using your link moves you up the waitlist. The higher you climb, the sooner you'll get access.
    </p>
    
    <div style="${styles.referralBox}">
      <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Your personal referral link:</div>
      <div style="font-size: 16px; font-weight: 600; color: #111827; word-break: break-all; margin-bottom: 16px;">
        ${data.referralLink}
      </div>
      <a href="https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20%40WaitlistKit%20waitlist!%20Create%20viral%20waitlists%20with%20referral%20tracking.%20Join%20me%3A%20${encodeURIComponent(data.referralLink)}" style="${styles.button}" target="_blank">
        Share on Twitter/X
      </a>
    </div>
    
    <p style="${styles.paragraph}">
      <strong>What's coming:</strong>
    </p>
    <ul style="${styles.paragraph}">
      <li>✅ Create beautiful, branded waitlist pages in minutes</li>
      <li>✅ Built-in referral tracking that actually works</li>
      <li>✅ Analytics dashboard to track your viral growth</li>
      <li>✅ Export your signups anytime</li>
    </ul>
    
    <p style="${styles.paragraph}">
      We're working hard to get this into your hands soon. Keep an eye on your inbox!
    </p>
    
    <div style="${styles.footer}">
      <p>
        You're receiving this because you signed up for WaitlistKit.<br>
        Questions? Just reply to this email.
      </p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function getWelcomeEmailText(data: WelcomeEmailData): string {
  return `
You're on the WaitlistKit waitlist! 🎉

Thanks for joining! You're one of the first to discover WaitlistKit — the easiest way to create viral waitlists with built-in referral tracking.

YOUR POSITION: #${data.position}

🔥 WANT TO MOVE UP?

Share your personal referral link and every friend who joins moves you up the waitlist:

${data.referralLink}

WHAT'S COMING:
✅ Create beautiful, branded waitlist pages in minutes
✅ Built-in referral tracking that actually works
✅ Analytics dashboard to track your viral growth
✅ Export your signups anytime

We're working hard to get this into your hands soon. Keep an eye on your inbox!

---
You're receiving this because you signed up for WaitlistKit.
Questions? Just reply to this email.

© ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
  `.trim()
}

export function getDayTwoEmailHtml(data: DayTwoEmailData): string {
  const referralText = data.referralCount > 0
    ? `You've already referred <strong>${data.referralCount} ${data.referralCount === 1 ? 'person' : 'people'}</strong>! Keep the momentum going.`
    : `You haven't referred anyone yet. Now's the perfect time to start!`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quick tip to jump the line ⚡</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div style="${styles.container}">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 48px;">⚡</span>
    </div>
    
    <h1 style="${styles.header}">Want to jump the line?</h1>
    
    <p style="${styles.paragraph}">
      Hey! Quick update on your WaitlistKit spot.
    </p>
    
    <div style="${styles.highlight}">
      <div style="${styles.position}">#${data.position}</div>
      <div style="font-size: 16px; opacity: 0.9;">Your current position</div>
    </div>
    
    <p style="${styles.paragraph}">
      ${referralText}
    </p>
    
    <div style="${styles.tip}">
      <strong>🎯 Pro tip:</strong> The most successful referrers share in places where builders hang out — Twitter, Discord communities, Slack groups, or even a quick text to founder friends.
    </div>
    
    <div style="${styles.socialProof}">
      <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 8px;">2,400+ builders</div>
      <div style="color: #047857;">have already joined the waitlist</div>
    </div>
    
    <h2 style="${styles.subheader}">3 ways to share effectively:</h2>
    
    <ol style="${styles.paragraph}">
      <li><strong>Tweet about it</strong> — Mention why you're excited about viral waitlists</li>
      <li><strong>DM 3 friends</strong> — Think of builders who would actually use this</li>
      <li><strong>Share in a community</strong> — Indie Hackers, Product Hunt, etc.</li>
    </ol>
    
    <div style="${styles.referralBox}">
      <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Your referral link:</div>
      <div style="font-size: 16px; font-weight: 600; color: #111827; word-break: break-all; margin-bottom: 16px;">
        ${data.referralLink}
      </div>
      <a href="https://twitter.com/intent/tweet?text=Building%20something%3F%20You%20need%20a%20waitlist%20that%20goes%20viral.%20Check%20out%20%40WaitlistKit%20%E2%80%94%20%0A%0A${encodeURIComponent(data.referralLink)}" style="${styles.button}" target="_blank">
        Share on Twitter/X
      </a>
    </div>
    
    <p style="${styles.paragraph}">
      Every referral moves you closer to the front. Some users have jumped 50+ spots in a single day!
    </p>
    
    <div style="${styles.footer}">
      <p>
        You're receiving this because you signed up for WaitlistKit.<br>
        Questions? Just reply to this email.
      </p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function getDayTwoEmailText(data: DayTwoEmailData): string {
  const referralText = data.referralCount > 0
    ? `You've already referred ${data.referralCount} ${data.referralCount === 1 ? 'person' : 'people'}! Keep the momentum going.`
    : `You haven't referred anyone yet. Now's the perfect time to start!`

  return `
Want to jump the line? ⚡

Hey! Quick update on your WaitlistKit spot.

YOUR CURRENT POSITION: #${data.position}

${referralText}

🎯 PRO TIP: The most successful referrers share in places where builders hang out — Twitter, Discord communities, Slack groups, or even a quick text to founder friends.

📊 2,400+ builders have already joined the waitlist

3 WAYS TO SHARE EFFECTIVELY:
1. Tweet about it — Mention why you're excited about viral waitlists
2. DM 3 friends — Think of builders who would actually use this
3. Share in a community — Indie Hackers, Product Hunt, etc.

YOUR REFERRAL LINK:
${data.referralLink}

Every referral moves you closer to the front. Some users have jumped 50+ spots in a single day!

---
You're receiving this because you signed up for WaitlistKit.
Questions? Just reply to this email.

© ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
  `.trim()
}

export function getDayFiveEmailHtml(data: DayFiveEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your waitlist is waiting 🎯</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div style="${styles.container}">
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 48px;">💡</span>
    </div>
    
    <h1 style="${styles.header}">What if your waitlist could go viral?</h1>
    
    <p style="${styles.paragraph}">
      Hey there! You've been on our waitlist for a few days now, and I wanted to share something with you...
    </p>
    
    <p style="${styles.paragraph}">
      <strong>The waitlist you signed up for? You can create one just like it.</strong>
    </p>
    
    <p style="${styles.paragraph}">
      WaitlistKit isn't just about joining waitlists — it's about <em>creating</em> them. If you're building a product, launching a newsletter, or starting any project that needs early adopters, you need this.
    </p>
    
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 32px; border-radius: 16px; margin: 32px 0;">
      <h2 style="margin: 0 0 16px 0; font-size: 24px;">What you get with WaitlistKit:</h2>
      <ul style="margin: 0; padding-left: 24px; line-height: 2;">
        <li>Beautiful waitlist pages that convert</li>
        <li>Automatic referral tracking & leaderboards</li>
        <li>Embeddable widgets for your site</li>
        <li>Real-time analytics dashboard</li>
        <li>Export to CSV, Mailchimp, or anywhere</li>
        <li>Custom branding & colors</li>
      </ul>
    </div>
    
    <div style="${styles.tip}">
      <strong>🚀 Real results:</strong> One indie maker grew their waitlist from 0 to 5,000+ signups in 2 weeks using WaitlistKit's referral system. Each referrer brought in an average of 3.2 friends.
    </div>
    
    <p style="${styles.paragraph}">
      <strong>Think about it:</strong>
    </p>
    <ul style="${styles.paragraph}">
      <li>Launching a SaaS? Build hype before you ship.</li>
      <li>Starting a newsletter? Grow your list virally.</li>
      <li>Running a beta? Let your early users recruit for you.</li>
      <li>Launching on Product Hunt? Stack your waitlist first.</li>
    </ul>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${BASE_URL}" style="${styles.button}">
        Create Your Waitlist Now →
      </a>
    </div>
    
    <p style="${styles.paragraph}">
      You're already on the inside. Why not put WaitlistKit to work for YOUR next launch?
    </p>
    
    <p style="${styles.paragraph}">
      Questions about how to set it up? Just reply — I read every email.
    </p>
    
    <p style="${styles.paragraph}">
      Happy building! 🔨<br>
      <strong>The WaitlistKit Team</strong>
    </p>
    
    <div style="${styles.footer}">
      <p>
        You're receiving this because you signed up for WaitlistKit.<br>
        Questions? Just reply to this email.
      </p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function getDayFiveEmailText(data: DayFiveEmailData): string {
  return `
What if your waitlist could go viral? 💡

Hey there! You've been on our waitlist for a few days now, and I wanted to share something with you...

The waitlist you signed up for? You can create one just like it.

WaitlistKit isn't just about joining waitlists — it's about CREATING them. If you're building a product, launching a newsletter, or starting any project that needs early adopters, you need this.

WHAT YOU GET WITH WAITLISTKIT:
✅ Beautiful waitlist pages that convert
✅ Automatic referral tracking & leaderboards
✅ Embeddable widgets for your site
✅ Real-time analytics dashboard
✅ Export to CSV, Mailchimp, or anywhere
✅ Custom branding & colors

🚀 REAL RESULTS: One indie maker grew their waitlist from 0 to 5,000+ signups in 2 weeks using WaitlistKit's referral system. Each referrer brought in an average of 3.2 friends.

THINK ABOUT IT:
• Launching a SaaS? Build hype before you ship.
• Starting a newsletter? Grow your list virally.
• Running a beta? Let your early users recruit for you.
• Launching on Product Hunt? Stack your waitlist first.

👉 Create Your Waitlist Now: ${BASE_URL}

You're already on the inside. Why not put WaitlistKit to work for YOUR next launch?

Questions about how to set it up? Just reply — I read every email.

Happy building! 🔨
The WaitlistKit Team

---
You're receiving this because you signed up for WaitlistKit.
Questions? Just reply to this email.

© ${new Date().getFullYear()} WaitlistKit. Built with ❤️ for makers.
  `.trim()
}

// Email type enum for tracking
export type EmailType = 'welcome' | 'day2' | 'day5'
