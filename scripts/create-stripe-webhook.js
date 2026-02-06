#!/usr/bin/env node
// Run with: STRIPE_SECRET_KEY=sk_live_xxx WEBHOOK_URL=https://yourapp.vercel.app/api/webhooks/stripe node scripts/create-stripe-webhook.js

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://waitlistkit-seven.vercel.app/api/webhooks/stripe';

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function createWebhook() {
  console.log('Creating Stripe webhook endpoint...\n');
  console.log(`URL: ${WEBHOOK_URL}`);

  const webhook = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: [
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
    ],
    description: 'WaitlistKit production webhook',
  });

  console.log(`\n✅ Webhook created successfully!`);
  console.log(`   ID: ${webhook.id}`);
  console.log(`   Status: ${webhook.status}`);
  console.log(`\n${'='.repeat(60)}`);
  console.log('📋 WEBHOOK SECRET FOR .env:');
  console.log('='.repeat(60));
  console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
  console.log('='.repeat(60));
  
  return webhook;
}

createWebhook()
  .then(() => {
    console.log('\n✅ Webhook setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating webhook:', error);
    process.exit(1);
  });
