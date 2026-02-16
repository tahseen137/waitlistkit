# 🚀 WaitlistKit

**Build viral waitlists in 60 seconds with built-in referral tracking**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/waitlistkit)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://www.prisma.io/)

[Live Demo](https://waitlistkit.ca/demo) • [Documentation](https://waitlistkit.ca) • [Pricing](https://waitlistkit.ca/pricing)

---

## What is WaitlistKit?

WaitlistKit is an **open-source viral waitlist builder** that helps founders launch faster and grow organically. Add a beautiful email capture widget to any website with a single script tag—no backend required.

**Key Features:**
- 🔗 **Viral Referrals** — Each user gets a unique referral link that moves them up when friends join
- ⚡ **60-Second Setup** — One script tag, zero configuration
- 📊 **Admin Dashboard** — View signups, track referrals, export to CSV
- 🎨 **Customizable** — Match your brand colors, logo, and copy
- 📧 **Drip Emails** — Automated welcome sequence via Resend
- 💳 **Monetizable** — Built-in Stripe integration for paid tiers

---

## Quick Start

### Option 1: Use Hosted Version (Easiest)

1. Go to [waitlistkit.ca](https://waitlistkit.ca)
2. Create a waitlist (free tier: 1 waitlist, 100 signups)
3. Copy the embed code to your website:

```html
<script 
  src="https://waitlistkit.ca/widget.js" 
  data-project="your-project-slug"
  data-waitlistkit
></script>
```

### Option 2: Self-Host (Full Control)

```bash
# Clone the repository
git clone https://github.com/tahseen137/waitlistkit.git
cd waitlistkit

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [Prisma](https://www.prisma.io/) + PostgreSQL |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Payments | [Stripe](https://stripe.com/) |
| Email | [Resend](https://resend.com/) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Environment Variables

Create a `.env` file:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@host:5432/database"

# For local development, use SQLite:
# DATABASE_URL="file:./dev.db"

# Stripe (optional - for paid plans)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (optional - for emails)
RESEND_API_KEY="re_..."

# App URL
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

---

## Project Structure

```
waitlistkit/
├── app/
│   ├── api/                 # API routes
│   │   ├── signup/          # Waitlist signup endpoint
│   │   ├── project/         # Project CRUD
│   │   └── admin/           # Admin endpoints
│   ├── admin/[projectId]/   # Admin dashboard
│   ├── demo/                # Interactive demo
│   └── w/[slug]/            # Public waitlist pages
├── lib/
│   ├── prisma.ts            # Database client
│   ├── email-service.ts     # Drip email logic
│   ├── rate-limit.ts        # Rate limiting
│   └── stripe.ts            # Stripe client
├── prisma/
│   └── schema.prisma        # Database schema
└── public/
    └── widget.js            # Embeddable widget
```

---

## API Reference

### Sign Up to Waitlist

```bash
POST /api/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "projectId": "clx1234567890",
  "referredBy": "abc123"  # optional referral code
}
```

**Response:**
```json
{
  "signup": {
    "id": "...",
    "email": "user@example.com",
    "position": 42,
    "referralCode": "xyz789"
  }
}
```

### Get Project Details

```bash
GET /api/project/{slug}
```

### Admin: Get All Signups

```bash
GET /api/admin/{projectId}
Headers: x-admin-secret: your-admin-secret
```

### Admin: Export CSV

```bash
GET /api/admin/{projectId}/export
Headers: x-admin-secret: your-admin-secret
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/waitlistkit)

### Database Options

- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** — Easiest with Vercel
- **[Supabase](https://supabase.com/)** — Generous free tier
- **[Neon](https://neon.tech/)** — Serverless Postgres

---

## Pricing (Hosted Version)

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 waitlist, 100 signups |
| **Starter** | $19/mo | 3 waitlists, 1K signups |
| **Pro** | $49/mo | Unlimited everything |
| **Lifetime** | $149 once | Pro features forever |

Self-hosted = **free forever** with MIT license.

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

```bash
# Run tests
npm test

# Lint
npm run lint

# Build
npm run build
```

---

## License

MIT License — do whatever you want with this code.

---

## Support

- 🐛 [Report a bug](https://github.com/tahseen137/waitlistkit/issues)
- 💬 [Discussions](https://github.com/tahseen137/waitlistkit/discussions)
- 📧 [Email](mailto:support@waitlistkit.ca)

---

**Built with ❤️ for indie hackers and founders who ship fast**
