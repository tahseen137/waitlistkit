# WaitlistKit 🚀

**Add a waitlist to your site in 60 seconds**

A simple embeddable waitlist widget with built-in referral tracking. One script tag gets you a beautiful email capture form with viral mechanics that move users up the list when they share.

## Features

✨ **60-Second Setup** - Just add one script tag to your site  
🔗 **Viral Referrals** - Users move up when friends join via their unique link  
📊 **Admin Dashboard** - See all signups, referral chains, export to CSV  
🎨 **Customizable** - Colors, copy, and branding  
📱 **Responsive** - Works beautifully on all devices  
🆓 **Free Tier** - 1 waitlist, 100 signups, forever free  

## Quick Start

### 1. Create Your Waitlist

Visit [WaitlistKit](https://waitlistkit.vercel.app) and create a new waitlist project.

### 2. Add to Your Site

Copy the embed code and add it anywhere in your HTML:

```html
<script 
  src="https://waitlistkit.vercel.app/widget.js" 
  data-project="your-project-slug"
  data-waitlistkit
></script>
```

### 3. Watch It Grow

Users sign up, get their position, and receive a unique referral link to move up the list!

## How It Works

1. **User signs up** → Gets position #47 of 234
2. **Receives referral link** → `yoursite.com?ref=abc123`
3. **Friend joins via link** → Original user moves to #46
4. **Viral growth** → Each referral moves them up further

## Tech Stack

- **Next.js 14** - App Router, Server Components
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **SQLite** - Database (easily swap for PostgreSQL)
- **TypeScript** - Type safety

## Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

Create a `.env` file:

```bash
DATABASE_URL="file:./dev.db"
```

For production, use PostgreSQL:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## API Endpoints

### Public
- `POST /api/project` - Create new waitlist
- `POST /api/signup` - Join a waitlist
- `GET /api/project/[slug]` - Get project details

### Admin (requires x-admin-secret header)
- `GET /api/admin/[projectId]` - Get admin dashboard data
- `GET /api/admin/[projectId]/export` - Export signups as CSV

## Pricing

**Free**
- 1 waitlist
- 100 signups
- Referral tracking
- Admin dashboard

**Pro - $9/mo**
- Unlimited waitlists
- Unlimited signups
- Custom branding
- Priority support

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Update `DATABASE_URL` to use PostgreSQL for production.

### Other Platforms

Works on any platform that supports Next.js:
- Railway
- Render
- Fly.io
- AWS Amplify

## License

MIT - Build awesome things!

## Credits

Built with ❤️ for founders who ship fast.

---

**Need help?** Open an issue or reach out!
