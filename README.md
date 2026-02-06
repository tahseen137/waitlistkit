# 🚀 WaitlistKit

**Build viral waitlists in 60 seconds with built-in referral tracking**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/waitlistkit)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://waitlistkit-seven.vercel.app)

---

## 📖 About

WaitlistKit is a **viral waitlist builder** designed to help you launch faster and grow organically. Add a beautiful email capture widget to any website with a single script tag—no backend required. Users receive unique referral links that move them up the waitlist when friends sign up, creating a viral growth loop.

Perfect for:
- 🚀 Product launches & MVPs
- 📱 App pre-launch campaigns
- 🎯 Lead generation
- 📢 Marketing campaigns

**Live Demo:** [waitlistkit-seven.vercel.app](https://waitlistkit-seven.vercel.app)

---

## ✨ Features

### Core Features
- ⚡ **60-Second Setup** — One script tag, zero backend configuration
- 🔗 **Viral Referrals** — Automatic unique referral links for every signup
- 📊 **Position Tracking** — Users see their waitlist position in real-time
- 🎨 **Customizable Widget** — Match your brand with custom colors, logos, and copy
- 📧 **Email Validation** — Built-in duplicate prevention and validation

### Admin Features
- 📈 **Admin Dashboard** — View all signups, positions, and referral chains
- 📥 **CSV Export** — Export your entire waitlist for email campaigns
- 🔒 **Secure Access** — Admin panel protected with secure tokens
- 🎯 **Referral Analytics** — Track who's driving the most signups

### Technical Features
- 🌐 **Embeddable Widget** — Works on any HTML site
- 🔄 **Real-time Updates** — Instant position updates when friends join
- 📱 **Responsive Design** — Mobile-optimized UI
- 🗄️ **Database Flexibility** — SQLite for dev, PostgreSQL for production

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Prisma ORM (SQLite/PostgreSQL) |
| **Styling** | Tailwind CSS |
| **UI Components** | React Hot Toast |
| **Deployment** | Vercel |
| **ID Generation** | nanoid |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/tahseen137/waitlistkit.git
cd waitlistkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL` (PostgreSQL connection string)
   - Deploy!

3. **Set up Database**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Supabase](https://supabase.com), or [Neon](https://neon.tech)
   - Update `DATABASE_URL` in Vercel environment variables
   - Redeploy to apply migrations

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahseen137/waitlistkit)

### Alternative Deployment Options
- **Netlify:** Use `next.config.js` with static export
- **Railway:** Supports Next.js with PostgreSQL out of the box
- **DigitalOcean App Platform:** Deploy from GitHub directly

---

## 🎯 Usage

### Embedding the Widget

Add this script to any HTML page where you want the waitlist widget:

```html
<script 
  src="https://waitlistkit-seven.vercel.app/widget.js" 
  data-project="your-project-slug"
  data-waitlistkit
></script>
```

### Creating a Project

1. Visit your deployed WaitlistKit instance
2. Click "Create New Waitlist"
3. Fill in project details:
   - **Project Name**
   - **Slug** (for widget URL)
   - **Admin Email**
   - **Branding** (colors, logo, copy)
4. Copy the embed code
5. Paste into your website

### Accessing the Admin Dashboard

Navigate to:
```
https://your-waitlistkit.vercel.app/admin/[projectId]?secret=[adminSecret]
```

From the dashboard you can:
- View all signups with positions
- Track referral chains
- Export to CSV
- Monitor growth metrics

---

## 🔌 API Reference

### Public Endpoints

#### `POST /api/signup`
Add a new signup to the waitlist.

**Request Body:**
```json
{
  "email": "user@example.com",
  "projectId": "clx1234567890",
  "referredBy": "abc123" // optional referral code
}
```

**Response:**
```json
{
  "success": true,
  "signup": {
    "id": "signup_id",
    "email": "user@example.com",
    "position": 42,
    "referralCode": "xyz789"
  }
}
```

#### `GET /api/project/[slug]`
Fetch project details by slug.

**Response:**
```json
{
  "id": "project_id",
  "name": "My Awesome Product",
  "headline": "Join the waitlist",
  "primaryColor": "#6366f1",
  "totalSignups": 1337
}
```

### Admin Endpoints

#### `GET /api/admin/[projectId]?secret=[adminSecret]`
Fetch all signups for a project.

#### `GET /api/admin/[projectId]/export?secret=[adminSecret]`
Export waitlist as CSV.

---

## 🎨 Customization

### Brand Colors
Update `primaryColor` when creating a project to match your brand.

### Custom Copy
Customize all widget text:
- `headline` - Main heading
- `subheadline` - Supporting text
- `buttonText` - CTA button label

### Logo
Upload a logo URL to display in the widget.

### Advanced Customization
Edit the widget source in `public/widget.js` for complete control over styling and behavior.

---

## 📊 Database Schema

### Projects
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique project ID |
| `slug` | String | URL-friendly identifier |
| `name` | String | Project name |
| `primaryColor` | String | Hex color code |
| `adminEmail` | String | Admin contact |
| `adminSecret` | String | Admin access token |

### Signups
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique signup ID |
| `email` | String | User email |
| `position` | Int | Waitlist position |
| `referralCode` | String | Unique referral code |
| `referredBy` | String | Referrer's code (optional) |
| `referralCount` | Int | Number of referrals |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://www.prisma.io/)
- Deployed on [Vercel](https://vercel.com)

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

**Made with ❤️ for indie hackers and builders**
