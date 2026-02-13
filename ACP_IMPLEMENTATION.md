# Agentic Commerce Protocol (ACP) Implementation
## WaitlistKit - AI Agent Commerce Integration

**Implemented:** February 13, 2026  
**Status:** ✅ Ready for Deployment

---

## 🎯 What is ACP?

The Agentic Commerce Protocol (ACP) is an open standard by Stripe + OpenAI that enables AI agents (like ChatGPT, Claude, etc.) to discover and purchase products autonomously. When an AI agent searches for "waitlist management tool," WaitlistKit will now appear in their results and they can complete a purchase without human intervention.

**Key Benefits:**
- 🤖 **First-Mover Advantage** - Almost no one has implemented this yet
- 🔍 **Discoverability** - AI agents can find your product organically
- ⚡ **Frictionless Purchase** - Agents complete checkout in seconds
- 💳 **Secure Payments** - Uses Stripe Shared Payment Tokens (no PII exposure)

---

## 📁 Files Created

### 1. Discovery File: `public/.well-known/acp.json`
This is the **entry point** for AI agents. It describes:
- Product name, description, vendor info
- Available plans (Pro $49, Business $69)
- Features and capabilities
- API endpoint location

**Location:** `https://waitlistkit.ca/.well-known/acp.json`

### 2. API Endpoint: `app/api/acp/route.ts`
RESTful API that handles:
- **GET** - Returns product catalog with pricing and features
- **POST** - Creates Stripe checkout sessions for agents

**Endpoints:**
- `GET https://waitlistkit.ca/api/acp` - Catalog
- `POST https://waitlistkit.ca/api/acp` - Checkout

---

## 🔧 Implementation Details

### Pricing Structure
```typescript
Plans:
  - Pro: $49 (one-time payment)
    - 5 waitlists, 5,000 subscribers
    - Custom branding, analytics, CSV export
    
  - Business: $69 (one-time payment)
    - Unlimited waitlists & subscribers
    - API access, webhooks, white-label
    - Dedicated support, SLA guarantee
```

### API Contract

**GET /api/acp**
```json
{
  "acp_version": "2026-01-30",
  "name": "WaitlistKit",
  "plans": [
    {
      "id": "pro",
      "price": { "amount": 4900, "currency": "usd" },
      "features": [...]
    }
  ]
}
```

**POST /api/acp**
```json
// Request
{
  "plan_id": "pro",
  "buyer_email": "agent@example.com",
  "agent_id": "claude-code-v1"
}

// Response
{
  "checkout_session": {
    "id": "cs_...",
    "status": "pending",
    "checkout_url": "https://checkout.stripe.com/...",
    "amount": 4900,
    "currency": "usd"
  }
}
```

---

## 🧪 Testing

### Run Automated Tests
```bash
cd /Users/clawdbot/.openclaw/workspace/waitlistkit
./scripts/test-acp.sh
```

### Manual Testing

**1. Test Discovery File**
```bash
curl https://waitlistkit.ca/.well-known/acp.json | jq .
```

**2. Test Catalog Endpoint**
```bash
curl https://waitlistkit.ca/api/acp | jq .
```

**3. Test Checkout Creation**
```bash
curl -X POST https://waitlistkit.ca/api/acp \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "pro",
    "buyer_email": "test@example.com",
    "agent_id": "test-agent"
  }' | jq .
```

**4. Test CORS (from browser console)**
```javascript
fetch('https://waitlistkit.ca/api/acp')
  .then(r => r.json())
  .then(console.log)
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [x] Discovery file created (`public/.well-known/acp.json`)
- [x] API route implemented (`app/api/acp/route.ts`)
- [x] JSON validation passed
- [x] TypeScript compilation successful
- [x] CORS headers configured for agent access
- [x] Stripe integration verified

### Deployment Steps

**1. Commit Changes**
```bash
cd /Users/clawdbot/.openclaw/workspace/waitlistkit
git add .
git commit -m "feat: Add Agentic Commerce Protocol (ACP) support"
git push origin main
```

**2. Deploy to Vercel**
```bash
# Auto-deploy via GitHub integration, or:
vercel --prod
```

**3. Verify Endpoints**
After deployment, test:
- `https://waitlistkit.ca/.well-known/acp.json`
- `https://waitlistkit.ca/api/acp`

**4. Register with ACP Directory (Optional)**
Once Stripe/OpenAI launches the official ACP directory, submit:
```bash
# Future step - not available yet
curl -X POST https://acp-registry.stripe.com/submit \
  -d '{"domain": "waitlistkit.ca"}'
```

---

## 🔍 How AI Agents Will Discover You

### Discovery Flow
1. **User asks AI:** "Find me a waitlist management tool"
2. **Agent searches ACP registry** (future Stripe/OpenAI service)
3. **Agent fetches** `https://waitlistkit.ca/.well-known/acp.json`
4. **Agent calls** `GET /api/acp` to get catalog
5. **Agent presents options** to user
6. **User approves purchase**
7. **Agent calls** `POST /api/acp` with plan selection
8. **Agent completes payment** via Stripe SPT

### Attribution
All ACP purchases are tagged in Stripe metadata:
```json
{
  "source": "acp",
  "agent_id": "chatgpt-4o",
  "plan_id": "pro"
}
```

This allows you to track which AI agents are driving revenue.

---

## 📊 Monitoring

### Webhook Updates
The existing webhook handler (`app/api/webhooks/stripe/route.ts`) already processes ACP purchases. Check logs for:
```
✅ Checkout completed: { source: 'acp', agent_id: '...', ... }
```

### Analytics
Track ACP conversions via Stripe Dashboard:
1. **Payments** → Filter by metadata: `source = acp`
2. **Customer Details** → Check `agent_id` in metadata
3. **Revenue Reports** → Segment by acquisition channel

---

## 🛠️ Maintenance

### Update Pricing
Edit both files when changing plans:
1. `public/.well-known/acp.json` (discovery)
2. `app/api/acp/route.ts` (API logic)

### Add New Plans
```typescript
// In app/api/acp/route.ts
{
  id: 'enterprise',
  name: 'Enterprise',
  price: { amount: 19900, currency: 'usd' },
  stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  features: [...]
}
```

### Monitor ACP Spec Changes
The spec is evolving. Watch:
- https://github.com/stripe/acp-spec (future repo)
- Stripe Dashboard changelog
- OpenAI developer updates

---

## ⚠️ Known Limitations

1. **Registry Not Live Yet** - Stripe/OpenAI haven't launched the public ACP directory. Implementation is ready for when they do.
2. **One-Time Payments Only** - Current implementation supports one-time purchases. Subscriptions can be added if needed.
3. **No Inventory Management** - Since this is a SaaS product, no inventory tracking is needed. Add if you introduce usage limits.

---

## 🎓 Resources

- **ACP Spec:** `docs/NEXTJS_16_UPGRADE_GUIDE.md` (local reference)
- **Stripe Webhooks:** `docs/STRIPE_WEBHOOK_MASTERY.md`
- **Self-Improvement Log:** `memory/self-improvement.md`
- **Stripe ACP Docs:** https://stripe.com/docs/acp (when published)

---

## 🚨 Support

**Questions?** Reach out:
- **Engineering:** CTO Gandalf (internal)
- **Stripe Issues:** support@stripe.com
- **ACP Spec Questions:** Post in Stripe Discord #acp-beta

---

**Status:** ✅ Implementation complete. Ready to deploy.  
**Next:** Deploy to production and monitor for agent purchases!
