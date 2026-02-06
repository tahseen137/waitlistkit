#!/usr/bin/env node
// Run with: STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-stripe-products.js

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function createProducts() {
  console.log('Creating WaitlistKit Stripe products and prices...\n');

  // Create Pro product
  const proProduct = await stripe.products.create({
    name: 'WaitlistKit Pro',
    description: 'For growing products - 5 waitlists, 5,000 subscribers, custom branding, and more.',
  });
  console.log(`✅ Created product: ${proProduct.name} (${proProduct.id})`);

  // Pro monthly price - $19/month
  const proMonthlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 1900, // $19.00 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    metadata: {
      plan: 'pro',
      billing: 'monthly',
    },
  });
  console.log(`   Monthly: $19/mo (${proMonthlyPrice.id})`);

  // Pro yearly price - 20% discount: $15.20/mo = $182.40/year
  const proYearlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 18240, // $182.40 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
    },
    metadata: {
      plan: 'pro',
      billing: 'yearly',
    },
  });
  console.log(`   Yearly: $182.40/yr (${proYearlyPrice.id})`);

  // Create Business product
  const businessProduct = await stripe.products.create({
    name: 'WaitlistKit Business',
    description: 'For serious launches - Unlimited waitlists, unlimited subscribers, API access, and more.',
  });
  console.log(`\n✅ Created product: ${businessProduct.name} (${businessProduct.id})`);

  // Business monthly price - $49/month
  const businessMonthlyPrice = await stripe.prices.create({
    product: businessProduct.id,
    unit_amount: 4900, // $49.00 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    metadata: {
      plan: 'business',
      billing: 'monthly',
    },
  });
  console.log(`   Monthly: $49/mo (${businessMonthlyPrice.id})`);

  // Business yearly price - 20% discount: $39.20/mo = $470.40/year
  const businessYearlyPrice = await stripe.prices.create({
    product: businessProduct.id,
    unit_amount: 47040, // $470.40 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
    },
    metadata: {
      plan: 'business',
      billing: 'yearly',
    },
  });
  console.log(`   Yearly: $470.40/yr (${businessYearlyPrice.id})`);

  console.log('\n' + '='.repeat(60));
  console.log('📋 PRICE IDs FOR .env:');
  console.log('='.repeat(60));
  console.log(`NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${proMonthlyPrice.id}`);
  console.log(`NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=${proYearlyPrice.id}`);
  console.log(`NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=${businessMonthlyPrice.id}`);
  console.log(`NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID=${businessYearlyPrice.id}`);
  console.log('='.repeat(60));

  return {
    proProduct,
    businessProduct,
    proMonthlyPrice,
    proYearlyPrice,
    businessMonthlyPrice,
    businessYearlyPrice,
  };
}

createProducts()
  .then(() => {
    console.log('\n✅ All products and prices created successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating products:', error);
    process.exit(1);
  });
