# Secrets to Add to Supabase Edge Functions

Copy and paste these into Supabase Dashboard > Settings > Edge Functions > Secrets

## Step-by-Step Instructions

1. Go to your Supabase Dashboard
2. Navigate to **Settings** > **Edge Functions** > **Secrets**
3. For each secret below, click **"Add new secret"** and enter:

---

## Secret 1: SUPABASE_URL
**Name:** `SUPABASE_URL`  
**Value:** `https://bhmdxxsdeekxmejnjwin.supabase.co`

---

## Secret 2: SUPABASE_SERVICE_ROLE_KEY
**Name:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:** *(Get from Supabase Dashboard > Settings > API > service_role key)*

---

## Secret 3: STRIPE_SECRET_KEY
**Name:** `STRIPE_SECRET_KEY`  
**Value:** `***REMOVED***`

---

## Secret 4: STRIPE_WEBHOOK_SECRET
**Name:** `STRIPE_WEBHOOK_SECRET`  
**Value:** `***REMOVED***`

---

## Secret 5: STRIPE_PRICE_USD
**Name:** `STRIPE_PRICE_USD`  
**Value:** `***REMOVED***`

---

## Secret 6: STRIPE_PRICE_NOK
**Name:** `STRIPE_PRICE_NOK`  
**Value:** `***REMOVED***`

---

## Secret 7: STRIPE_PRICE_SEK
**Name:** `STRIPE_PRICE_SEK`  
**Value:** `***REMOVED***`

---

## Secret 8: STRIPE_PRICE_DKK
**Name:** `STRIPE_PRICE_DKK`  
**Value:** `***REMOVED***`

---

## Secret 9: PUBLIC_APP_URL
**Name:** `PUBLIC_APP_URL`  
**Value:** `https://trainwisestudio.com`

---

## Optional: OPENAI_KEY (for AI features)
**Name:** `OPENAI_KEY`  
**Value:** *(Your OpenAI API key if you want AI plan generation)*

---

## Optional: GEMINI_API_KEY (for AI features)
**Name:** `GEMINI_API_KEY`  
**Value:** *(Your Gemini API key if you want AI plan generation)*

---

## Quick Copy-Paste Format

If Supabase allows bulk import, use this format:

```
SUPABASE_URL=https://bhmdxxsdeekxmejnjwin.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
STRIPE_SECRET_KEY=***REMOVED***
STRIPE_WEBHOOK_SECRET=***REMOVED***
STRIPE_PRICE_USD=***REMOVED***
STRIPE_PRICE_NOK=***REMOVED***
STRIPE_PRICE_SEK=***REMOVED***
STRIPE_PRICE_DKK=***REMOVED***
PUBLIC_APP_URL=https://trainwisestudio.com
```

**Note:** You still need to get `SUPABASE_SERVICE_ROLE_KEY` from your Supabase Dashboard.

