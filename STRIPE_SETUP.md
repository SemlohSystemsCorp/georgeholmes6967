# Stripe Setup Guide for Chatterbox

## 1. Create a Stripe Account

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign up
2. Complete identity verification to activate your account

## 2. Get Your API Keys

1. Go to **Developers → API Keys** in the Stripe dashboard
2. Copy your **Publishable key** and **Secret key**
3. Add them to your `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 3. Create Products and Prices

Create two products in the Stripe dashboard (**Product Catalog → Add Product**):

### Pro Plan
- **Name:** Chatterbox Pro
- **Price:** $12/month per seat (recurring)
- Copy the **Price ID** (starts with `price_`)

### Enterprise Plan
- **Name:** Chatterbox Enterprise
- **Price:** Custom pricing — create a placeholder price or use Stripe Quotes
- Copy the **Price ID**

Add these to `.env.local`:

```
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

## 4. Set Up Webhooks

1. Go to **Developers → Webhooks → Add endpoint**
2. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing secret** and add it to `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Local Development

For local testing, install the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will give you a local webhook secret — use that for development.

## 5. Environment Variables Summary

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 6. How Checkout Works

1. User clicks a plan's CTA on `/pricing`
2. They're taken to `/checkout/pro` or `/checkout/enterprise`
3. The checkout page creates a Stripe Checkout Session via `/api/checkout`
4. User enters payment details in the embedded Stripe form
5. On success, the webhook fires `checkout.session.completed`
6. The webhook handler:
   - Creates/updates the subscription in the database
   - Sends a confirmation email via Resend
   - Redirects user to `/dashboard`

## 7. Going Live

1. Switch from test keys (`sk_test_`) to live keys (`sk_live_`) in production
2. Update webhook endpoint to your production URL
3. Verify products and prices exist in live mode
4. Test a real transaction with a small amount
