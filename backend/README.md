# Harmony Stride Backend

Express + TypeScript server with Stripe + Supabase integration.

## Setup

1. Install deps

```
cd backend
npm i
```

2. Create `.env` in `backend/`

```
PORT=3000
PUBLIC_APP_URL=http://localhost:8080

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs for different currencies
STRIPE_PRICE_USD=***REMOVED***
STRIPE_PRICE_NOK=***REMOVED***
STRIPE_PRICE_SEK=***REMOVED***
STRIPE_PRICE_DKK=***REMOVED***

# Supabase Configuration
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

3. Run dev server

```
npm run dev
```

## Frontend proxy
Set in project root `.env` (same level as `vite.config.ts`):

```
VITE_API_PROXY_TARGET=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Now frontend requests to `/api/*` will be proxied to the backend in dev.

## Webhooks
Expose your backend using ngrok and set Stripe webhook endpoint to
`/api/stripe/webhook` with the provided signing secret.

The webhook updates `profiles.plan` and `plan_expiry` based on subscription events.
