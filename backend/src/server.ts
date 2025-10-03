import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

// Price IDs for different currencies
const PRICE_IDS = {
  usd: process.env.STRIPE_PRICE_USD || '***REMOVED***',
  nok: process.env.STRIPE_PRICE_NOK || '***REMOVED***',
  sek: process.env.STRIPE_PRICE_SEK || '***REMOVED***',
  dkk: process.env.STRIPE_PRICE_DKK || '***REMOVED***',
};

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

app.use(cors({ origin: true, credentials: true }));
// Stripe webhook must use raw body BEFORE any express.json
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[WEBHOOK] Signature verification failed', err?.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // eslint-disable-next-line no-console
        console.log('[WEBHOOK] checkout.session.completed', {
          sessionId: session.id,
          customer: session.customer,
          subscription: session.subscription,
          client_reference_id: session.client_reference_id,
        });
        if (session.mode === 'payment') {
          // One-time coach offer payment completed
          try {
            const clientRef = (session.client_reference_id as string) || '';
            if (clientRef.startsWith('offer:')) {
              const offerId = clientRef.replace('offer:', '');
              // Fetch offer to get coach/customer/duration/price
              const { data: offerRows, error: offerErr } = await supabase
                .from('coach_offers')
                .select('*')
                .eq('id', offerId)
                .limit(1);
              const offer = offerRows?.[0];
              if (!offerErr && offer) {
                // Mark offer accepted
                await supabase.from('coach_offers').update({ status: 'accepted' }).eq('id', offerId);
                // Assign coach to customer and set plan expiry based on duration_months
                const expiry = new Date(Date.now() + (offer.duration_months || 1) * 30 * 24 * 60 * 60 * 1000).toISOString();
                await supabase
                  .from('profiles')
                  .update({ coach_id: offer.coach_id, plan: `${offer.duration_months}-month plan`, plan_expiry: expiry })
                  .eq('id', offer.customer_id);
                // Record payout intent with platform commission (15%)
                const amountCents = Math.round(Number(offer.price) * 100);
                const platformFee = Math.round(amountCents * 0.15);
                const netAmount = amountCents - platformFee;
                await supabase.from('payouts').insert({
                  coach_id: offer.coach_id,
                  amount_cents: amountCents,
                  platform_fee_cents: platformFee,
                  net_amount_cents: netAmount,
                  status: 'pending',
                  period_start: new Date().toISOString().slice(0,10),
                  period_end: new Date().toISOString().slice(0,10),
                });
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[WEBHOOK] one-time payment processing error', e);
          }
        }
        if (session.customer && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

          // Prefer mapping by client_reference_id (our Supabase user id)
          const refUserId = (session.client_reference_id as string) || null;

          let userId: string | undefined;
          if (refUserId) {
            userId = refUserId;
          } else {
            // Fallback: find by existing stripe_customer_id mapping
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id')
              .eq('stripe_customer_id', session.customer as string)
              .limit(1);
            userId = profiles?.[0]?.id;
          }

          if (userId) {
            // eslint-disable-next-line no-console
            console.log('[WEBHOOK] Updating profile after checkout', {
              userId,
              stripe_customer_id: session.customer,
              plan_expiry: subscription.current_period_end,
            });
            await supabase
              .from('profiles')
              .update({
                // Persist Stripe customer id for future lookups
                stripe_customer_id: (session.customer as string) ?? null,
                plan: 'platform_monthly',
                plan_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
                stripe_subscription_id: subscription.id,
              })
              .eq('id', userId);
          } else {
            // eslint-disable-next-line no-console
            console.warn('[WEBHOOK] Could not resolve userId for session', session.id);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1);
        const userId = profiles?.[0]?.id;
        if (userId) {
          await supabase
            .from('profiles')
            .update({ plan: null, plan_expiry: null, stripe_subscription_id: null })
            .eq('id', userId);
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[WEBHOOK] Handler error', e);
    res.status(500).json({ error: e?.message || 'Webhook handling error' });
  }
});

// JSON parser after webhook
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Create Checkout Session for platform subscription
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceKey, trialDays, stripeCustomerId, currency, userId } = req.body as {
      priceKey: string;
      trialDays?: number;
      stripeCustomerId?: string | null;
      currency?: string;
      userId?: string;
    };
    // eslint-disable-next-line no-console
    console.log('[API] create-checkout-session', { priceKey, trialDays, hasCustomer: !!stripeCustomerId, currency, userId });

    // Determine price ID based on currency or priceKey
    let price: string;
    if (currency && PRICE_IDS[currency as keyof typeof PRICE_IDS]) {
      price = PRICE_IDS[currency as keyof typeof PRICE_IDS];
    } else {
      // Map friendly key to real Stripe Price ID (fallback to USD)
      const priceMap: Record<string, string> = {
        platform_monthly: PRICE_IDS.usd,
        // add more mappings here as needed
      };
      price = priceMap[priceKey] || priceKey; // allow direct price id too
    }
    
    if (!price || price.startsWith('prod_')) {
      return res.status(400).json({
        error: 'Invalid Stripe price id. Expected a price_... id. Check your currency or priceKey.'
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId || undefined,
      payment_method_types: ['card'],
      line_items: [
        { price, quantity: 1 }
      ],
      allow_promotion_codes: true,
      subscription_data: trialDays && trialDays > 0 ? { trial_period_days: trialDays } : undefined,
      client_reference_id: userId,
      success_url: `${process.env.PUBLIC_APP_URL}/customer/settings?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_APP_URL}/customer/settings?status=cancel`,
    });
    // eslint-disable-next-line no-console
    console.log('[API] Checkout session created', { sessionId: session.id, url: session.url });
    return res.json({ checkoutUrl: session.url });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[API] create-checkout-session error', e);
    return res.status(500).json({ error: e?.message || 'Failed to create checkout session' });
  }
});

// Cancel at period end
app.post('/api/stripe/cancel-at-period-end', async (req, res) => {
  try {
    const { subscriptionId } = req.body as { subscriptionId?: string };
    if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId required' });
    const sub = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    return res.json({ success: true, current_period_end: sub.current_period_end });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to cancel subscription' });
  }
});

// Resume (uncancel)
app.post('/api/stripe/resume', async (req, res) => {
  try {
    const { subscriptionId } = req.body as { subscriptionId?: string };
    if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId required' });
    const sub = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to resume subscription' });
  }
});

// Post-checkout sync endpoint: fetch session+subscription and update profile immediately
app.get('/api/stripe/sync', async (req, res) => {
  try {
    const sessionId = req.query.session_id as string | undefined;
    if (!sessionId) return res.status(400).json({ error: 'session_id required' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // eslint-disable-next-line no-console
    console.log('[API] /api/stripe/sync', {
      sessionId,
      customer: session.customer,
      subscription: session.subscription,
      client_reference_id: session.client_reference_id,
    });
    if (!session.customer || !session.subscription) {
      return res.status(400).json({ error: 'Session not completed or missing customer/subscription' });
    }
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    // Prefer user id from client_reference_id; fallback to lookup by stripe_customer_id
    let userId = (session.client_reference_id as string) || undefined;
    if (!userId) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', session.customer as string)
        .limit(1);
      userId = profiles?.[0]?.id;
    }
    if (userId) {
      // eslint-disable-next-line no-console
      console.log('[API] Sync updating profile', {
        userId,
        stripe_customer_id: session.customer,
        plan_expiry: subscription.current_period_end,
      });
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: (session.customer as string) ?? null,
          plan: 'platform_monthly',
          plan_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', userId);
      return res.json({ ok: true, plan_expiry: subscription.current_period_end, user_id: userId });
    }
    // eslint-disable-next-line no-console
    console.warn('[API] /api/stripe/sync could not resolve user from session', { sessionId, customer: session.customer, client_reference_id: session.client_reference_id });
    res.status(404).json({ error: 'User not found for session', session_id: sessionId });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[API] /api/stripe/sync error', e);
    res.status(500).json({ error: e?.message || 'Failed to sync subscription' });
  }
});

// Create Checkout Session for a specific coach offer (one-time payment)
app.post('/api/stripe/create-offer-checkout', async (req, res) => {
  try {
    const { offerId } = req.body as { offerId?: string };
    if (!offerId) return res.status(400).json({ error: 'offerId required' });

    // Load offer to determine amount and actors
    const { data: offers, error } = await supabase
      .from('coach_offers')
      .select('id, price, duration_months, coach_id, customer_id')
      .eq('id', offerId)
      .limit(1);
    if (error || !offers?.[0]) return res.status(404).json({ error: 'Offer not found' });
    const offer = offers[0];
    const amountCents = Math.round(Number(offer.price) * 100);
    if (!amountCents || amountCents <= 0) return res.status(400).json({ error: 'Invalid offer amount' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Coach Offer',
              description: `${offer.duration_months}-month coaching package`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: `offer:${offer.id}`,
      success_url: `${process.env.PUBLIC_APP_URL}/customer/messages?offer_status=paid&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_APP_URL}/customer/messages?offer_status=cancel`,
    });
    return res.json({ checkoutUrl: session.url });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[API] create-offer-checkout error', e);
    return res.status(500).json({ error: e?.message || 'Failed to create offer checkout session' });
  }
});

// AI: Generate personal plan (uses OpenAI when OPENAI_KEY present; falls back otherwise)
app.post('/api/ai/generate-plan', async (req, res) => {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Pull onboarding details to inform plan
    const { data: details, error } = await supabase
      .from('onboarding_details')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[AI] onboarding_details fetch error', error.message);
    }
    const basePlan = {
      generatedAt: new Date().toISOString(),
      summary: 'Personalized fitness, nutrition, and mindfulness plan',
      goals: details?.goals || [],
      weeks: 4,
      schedule: [
        { day: 'Mon', workout: 'Full-body strength', nutrition: 'High protein, balanced carbs', mindfulness: '10m breathing' },
        { day: 'Tue', workout: 'Zone 2 cardio 30m', nutrition: 'Mediterranean plate', mindfulness: 'Body scan 10m' },
        { day: 'Wed', workout: 'Mobility + core', nutrition: 'Balanced bowl', mindfulness: 'Gratitude journaling' },
        { day: 'Thu', workout: 'Upper strength', nutrition: 'High protein', mindfulness: 'Box breathing 8m' },
        { day: 'Fri', workout: 'Intervals 20m', nutrition: 'Complex carbs focus', mindfulness: 'Mindful walk' },
        { day: 'Sat', workout: 'Lower strength', nutrition: 'Protein + greens', mindfulness: 'Meditation 12m' },
        { day: 'Sun', workout: 'Rest / light yoga', nutrition: 'Free choice within macros', mindfulness: 'Reflection 10m' },
      ],
      personalization: {
        injuries: details?.injuries || [],
        allergies: details?.allergies || [],
        meditationExperience: details?.meditation_experience || 'beginner',
      }
    };

    const openaiKey = process.env.OPENAI_KEY;
    if (!openaiKey) {
      return res.json({ plan: basePlan });
    }

    try {
      const client = new OpenAI({ apiKey: openaiKey });
      const systemPrompt = `You are a world-class health coach. Create a 4-week plan with fitness, nutrition, and mindfulness.
Respond in JSON with fields: generatedAt (ISO), summary (string), goals (array), weeks (number), schedule (array of 7 objects with day, workout, nutrition, mindfulness), personalization (object).`;
      const userPrompt = `User goals: ${JSON.stringify(details?.goals || [])}
Allergies: ${JSON.stringify(details?.allergies || [])}
Injuries: ${JSON.stringify(details?.injuries || [])}
Meditation experience: ${JSON.stringify(details?.meditation_experience || 'beginner')}`;

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
      const content = completion.choices?.[0]?.message?.content || '';
      const parsed = JSON.parse(content);
      return res.json({ plan: parsed });
    } catch (llmErr: any) {
      // eslint-disable-next-line no-console
      console.warn('[AI] OpenAI error, falling back to base plan', llmErr?.message);
      return res.json({ plan: basePlan });
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[AI] generate-plan error', e);
    return res.status(500).json({ error: e?.message || 'Failed to generate plan' });
  }
});

// Payouts request (records intent; real transfer handled in Stripe Connect or manual)
app.post('/api/payouts/request', async (req, res) => {
  try {
    const { coachId, amountCents } = req.body as { coachId?: string; amountCents: number };
    if (!coachId || !amountCents || amountCents <= 0) return res.status(400).json({ error: 'coachId and amountCents required' });
    // 15% platform commission
    const platformFee = Math.round(amountCents * 0.15);
    const netAmount = amountCents - platformFee;
    await supabase.from('payouts').insert({
      coach_id: coachId,
      amount_cents: amountCents,
      platform_fee_cents: platformFee,
      net_amount_cents: netAmount,
      status: 'pending',
      period_start: new Date().toISOString().slice(0,10),
      period_end: new Date().toISOString().slice(0,10),
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to create payout request' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});


