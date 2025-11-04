import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] Processing coach offer payment', { offerId, sessionId: session.id });
              
              // Fetch offer to get coach/customer/duration/price
              const { data: offerRows, error: offerErr } = await supabase
                .from('coach_offers')
                .select('*')
                .eq('id', offerId)
                .limit(1);
              
              if (offerErr) {
                // eslint-disable-next-line no-console
                console.error('[WEBHOOK] Error fetching offer', { offerId, error: offerErr });
                throw offerErr;
              }
              
              const offer = offerRows?.[0];
              if (!offer) {
                // eslint-disable-next-line no-console
                console.error('[WEBHOOK] Offer not found', { offerId });
                throw new Error(`Offer ${offerId} not found`);
              }

              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] Offer found', { offerId, coachId: offer.coach_id, customerId: offer.customer_id, price: offer.price, duration: offer.duration_months });

              // Mark offer accepted
              const { error: updateOfferError } = await supabase
                .from('coach_offers')
                .update({ status: 'accepted' })
                .eq('id', offerId);
              
              if (updateOfferError) {
                // eslint-disable-next-line no-console
                console.error('[WEBHOOK] Error updating offer status', { offerId, error: updateOfferError });
                throw updateOfferError;
              }
              
              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] Offer marked as accepted', { offerId });

              // Assign coach to customer and set plan expiry based on duration_months (now weeks)
              const weeks = offer.duration_months || 1;
              const expiry = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000).toISOString();
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                  coach_id: offer.coach_id, 
                  plan: `${weeks}-week plan`, 
                  plan_expiry: expiry 
                })
                .eq('id', offer.customer_id);
              
              if (profileError) {
                // eslint-disable-next-line no-console
                console.error('[WEBHOOK] Error updating customer profile', { customerId: offer.customer_id, error: profileError });
                throw profileError;
              }
              
              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] Customer profile updated', { customerId: offer.customer_id, coachId: offer.coach_id, plan: `${weeks}-week plan` });

              // Record payout intent with platform commission (15%)
              const amountCents = Math.round(Number(offer.price) * 100);
              const platformFee = Math.round(amountCents * 0.15);
              const netAmount = amountCents - platformFee;
              const { error: payoutError } = await supabase.from('payouts').insert({
                coach_id: offer.coach_id,
                amount_cents: amountCents,
                platform_fee_cents: platformFee,
                net_amount_cents: netAmount,
                status: 'pending',
                period_start: new Date().toISOString().slice(0,10),
                period_end: new Date().toISOString().slice(0,10),
              });

              if (payoutError) {
                // eslint-disable-next-line no-console
                console.error('[WEBHOOK] Error creating payout', { coachId: offer.coach_id, error: payoutError });
                throw payoutError;
              }
              
              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] Payout created', { coachId: offer.coach_id, amountCents, platformFee, netAmount });

              // Create or update contract for this offer (use weeks for duration, not days)
              try {
                const startDate = new Date();
                const endDate = new Date(startDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
                const { error: contractError } = await supabase
                  .from('contracts')
                  .insert({
                    coach_id: offer.coach_id,
                    customer_id: offer.customer_id,
                    offer_id: offer.id,
                    status: 'active',
                    start_date: startDate.toISOString().slice(0,10),
                    end_date: endDate.toISOString().slice(0,10),
                    price_cents: amountCents,
                  });
                
                if (contractError) {
                  // eslint-disable-next-line no-console
                  console.warn('[WEBHOOK] Could not create contract for offer', { offerId, error: contractError });
                } else {
                  // eslint-disable-next-line no-console
                  console.log('[WEBHOOK] Contract created', { offerId, startDate: startDate.toISOString().slice(0,10), endDate: endDate.toISOString().slice(0,10) });
                }
              } catch (contractErr) {
                // eslint-disable-next-line no-console
                console.warn('[WEBHOOK] Could not create contract for offer', { offerId, error: contractErr });
              }

              // Ensure a conversation exists and send system message about activation
              try {
                const { data: convo, error: convoError } = await supabase
                  .from('conversations')
                  .select('id')
                  .eq('coach_id', offer.coach_id)
                  .eq('customer_id', offer.customer_id)
                  .maybeSingle();
                
                if (convoError) {
                  // eslint-disable-next-line no-console
                  console.error('[WEBHOOK] Error fetching conversation', { error: convoError });
                }
                
                let conversationId = convo?.id as string | undefined;
                if (!conversationId) {
                  const { data: created, error: createError } = await supabase
                    .from('conversations')
                    .insert({ coach_id: offer.coach_id, customer_id: offer.customer_id, title: 'Coaching Contract' })
                    .select('id')
                    .single();
                  
                  if (createError) {
                    // eslint-disable-next-line no-console
                    console.error('[WEBHOOK] Error creating conversation', { error: createError });
                  } else {
                    conversationId = created?.id;
                    // eslint-disable-next-line no-console
                    console.log('[WEBHOOK] Conversation created', { conversationId });
                  }
                }
                
                if (conversationId) {
                  const { error: messageError } = await supabase.from('messages').insert({
                    conversation_id: conversationId,
                    sender_id: offer.coach_id,
                    content: `✅ Your coaching plan is now active for ${weeks} week(s). Let's get started!`,
                    message_type: 'system',
                  });
                  
                  if (messageError) {
                    // eslint-disable-next-line no-console
                    console.error('[WEBHOOK] Error creating system message', { error: messageError });
                  } else {
                    // eslint-disable-next-line no-console
                    console.log('[WEBHOOK] System message sent', { conversationId });
                  }
                }
              } catch (chatErr) {
                // eslint-disable-next-line no-console
                console.warn('[WEBHOOK] Conversation/message setup failed', { error: chatErr });
              }

              // eslint-disable-next-line no-console
              console.log('[WEBHOOK] ✅ Coach offer payment processed successfully', { 
                offerId, 
                coachId: offer.coach_id, 
                customerId: offer.customer_id,
                amount: offer.price,
                duration: `${weeks} weeks`
              });
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[WEBHOOK] ❌ One-time payment processing error', { error: e, sessionId: session.id });
            // Don't throw - we still want to return 200 to Stripe
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

// Geolocation proxy endpoint to avoid CORS issues
app.get('/api/geolocation', async (_req, res) => {
  try {
    console.log('Fetching geolocation from ip-api.com...');
    const response = await fetch('http://ip-api.com/json/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geolocation data received:', data);
    
    // Transform ip-api.com response to match ipapi.co format
    const transformedData = {
      country_code: data.countryCode,
      country_name: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone
    };
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    res.status(500).json({ error: 'Failed to fetch geolocation data', details: error.message });
  }
});

// Contract maintenance: expire contracts whose end_date has passed and close chat
app.post('/api/contracts/expire', async (_req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    // Find active contracts past end_date
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id, coach_id, customer_id, end_date')
      .eq('status', 'active')
      .lt('end_date', today);
    for (const c of contracts || []) {
      // Mark as expired (payout trigger will enqueue payout)
      await supabase.from('contracts').update({ status: 'expired' }).eq('id', c.id);
      // Close conversation by inserting a system message; UI can treat this as closed flag
      try {
        const { data: convo } = await supabase
          .from('conversations')
          .select('id')
          .eq('coach_id', c.coach_id)
          .eq('customer_id', c.customer_id)
          .maybeSingle();
        if (convo?.id) {
          await supabase.from('messages').insert({
            conversation_id: convo.id,
            sender_id: c.coach_id,
            content: 'Contract period ended. This chat is now closed. Renew to continue.',
            type: 'system',
          });
        }
      } catch {}
    }
    return res.json({ ok: true, expired: (contracts || []).length });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to expire contracts' });
  }
});

// Contract renewal: create a new period and (re)open chat
app.post('/api/contracts/renew', async (req, res) => {
  try {
    const { contractId, months } = req.body as { contractId?: string; months?: number };
    if (!contractId) return res.status(400).json({ error: 'contractId required' });
    const durationMonths = Math.max(1, months || 1);
    const { data: rows, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .limit(1);
    const prev = rows?.[0];
    if (error || !prev) return res.status(404).json({ error: 'Contract not found' });

    // New period starts at today; price same as previous
    const start = new Date();
    const end = new Date(start.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
    const { data: inserted, error: insertErr } = await supabase
      .from('contracts')
      .insert({
        coach_id: prev.coach_id,
        customer_id: prev.customer_id,
        status: 'active',
        start_date: start.toISOString().slice(0,10),
        end_date: end.toISOString().slice(0,10),
        price_cents: prev.price_cents,
        platform_fee_rate: prev.platform_fee_rate,
      })
      .select('id')
      .single();
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    // Ensure conversation exists and add system message
    const { data: convo } = await supabase
      .from('conversations')
      .select('id')
      .eq('coach_id', prev.coach_id)
      .eq('customer_id', prev.customer_id)
      .maybeSingle();
    let conversationId = convo?.id as string | undefined;
    if (!conversationId) {
      const { data: created } = await supabase
        .from('conversations')
        .insert({ coach_id: prev.coach_id, customer_id: prev.customer_id, title: 'Coaching Contract' })
        .select('id')
        .single();
      conversationId = created?.id;
    }
    if (conversationId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: prev.coach_id,
        content: `Contract renewed for ${durationMonths} month(s). Welcome back!`,
        type: 'system',
      });
    }
    return res.json({ ok: true, contract_id: inserted?.id });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to renew contract' });
  }
});

// Contract signatures: set document url and signed timestamps
app.post('/api/contracts/sign', async (req, res) => {
  try {
    const { contractId, actor, documentUrl } = req.body as { contractId?: string; actor?: 'coach'|'customer'; documentUrl?: string };
    if (!contractId || !actor) return res.status(400).json({ error: 'contractId and actor required' });
    const fields: any = {};
    if (documentUrl) fields.document_url = documentUrl;
    if (actor === 'coach') fields.coach_signed_at = new Date().toISOString();
    if (actor === 'customer') fields.customer_signed_at = new Date().toISOString();
    const { error } = await supabase.from('contracts').update(fields).eq('id', contractId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to sign contract' });
  }
});

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
      success_url: `${process.env.PUBLIC_APP_URL || 'https://trainwisestudio.com'}/customer/settings?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_APP_URL || 'https://trainwisestudio.com'}/customer/settings?status=cancel`,
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

// Stripe Customer Portal: return billing portal URL
app.post('/api/stripe/customer-portal', async (req, res) => {
  try {
    const { stripeCustomerId, returnUrl } = req.body as { stripeCustomerId?: string; returnUrl?: string };
    if (!stripeCustomerId) return res.status(400).json({ error: 'stripeCustomerId required' });
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || `${process.env.PUBLIC_APP_URL || 'https://trainwisestudio.com'}/customer/settings`,
    });
    return res.json({ url: session.url });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to create customer portal session' });
  }
});

// Cancel at period end
app.post('/api/stripe/cancel-at-period-end', async (req, res) => {
  try {
    const { subscriptionId, stripeCustomerId } = req.body as { subscriptionId?: string; stripeCustomerId?: string };
    let subId = subscriptionId;
    if (!subId) {
      if (!stripeCustomerId) return res.status(400).json({ error: 'subscriptionId or stripeCustomerId required' });
      const subs = await stripe.subscriptions.list({ customer: stripeCustomerId, status: 'active', limit: 1 });
      subId = subs.data?.[0]?.id;
      if (!subId) return res.status(404).json({ error: 'Active subscription not found for customer' });
    }
    const sub = await stripe.subscriptions.update(subId, { cancel_at_period_end: true });
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

// Cancel immediately and clear profile mapping
app.post('/api/stripe/cancel-now', async (req, res) => {
  try {
    const { subscriptionId, userId, stripeCustomerId } = req.body as { subscriptionId?: string; userId?: string; stripeCustomerId?: string };
    let subId = subscriptionId;
    if (!subId) {
      if (!stripeCustomerId) return res.status(400).json({ error: 'subscriptionId or stripeCustomerId required' });
      const subs = await stripe.subscriptions.list({ customer: stripeCustomerId, status: 'active', limit: 1 });
      subId = subs.data?.[0]?.id;
      if (!subId) return res.status(404).json({ error: 'Active subscription not found for customer' });
    }
    const sub = await stripe.subscriptions.cancel(subId);
    // Best-effort DB cleanup
    if (userId) {
      await supabase
        .from('profiles')
        .update({ plan: null, plan_expiry: null, stripe_subscription_id: null })
        .eq('id', userId);
    }
    return res.json({ success: true, canceled_at: sub.canceled_at });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to cancel subscription immediately' });
  }
});

// Graceful cancel: attempt to cancel subscription, then clear plan-related fields in DB
app.post('/api/stripe/cancel-graceful', async (req, res) => {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });

    // Load profile
    const { data: profileRows, error: profileErr } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .eq('id', userId)
      .limit(1);
    if (profileErr) return res.status(500).json({ error: profileErr.message });
    const profile = profileRows?.[0] as { id: string; stripe_customer_id: string | null } | undefined;
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Best-effort subscription cancel (ignore if not found)
    try {
      let subId: string | undefined;
      if (profile.stripe_customer_id) {
        const subs = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: 'active', limit: 1 });
        subId = subs.data?.[0]?.id;
      }
      if (subId) {
        await stripe.subscriptions.cancel(subId);
      }
    } catch (e) {
      // ignore subscription cancel errors; proceed to clear DB
    }

    // Clear plan-related fields
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ plan: null, plan_expiry: null, stripe_customer_id: null })
      .eq('id', userId);
    if (updErr) return res.status(500).json({ error: updErr.message });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to gracefully cancel plan' });
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

    const weeks = offer.duration_months || 1;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Coach Offer',
              description: `${weeks}-week coaching package`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: `offer:${offer.id}`,
      success_url: `${process.env.PUBLIC_APP_URL || 'https://trainwisestudio.com'}/customer/messages?offer_status=paid&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_APP_URL || 'https://trainwisestudio.com'}/customer/messages?offer_status=cancel`,
    });
    // eslint-disable-next-line no-console
    console.log('[API] Created offer checkout session', { offerId, amountCents, weeks, sessionId: session.id });
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
    // Gate: Only active subscribers can use AI Coach
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('plan, plan_expiry')
      .eq('id', userId)
      .single();
    if (profileErr) return res.status(400).json({ error: 'Profile not found' });
    const now = new Date();
    const active = profile?.plan && profile.plan !== 'trial' && (!profile?.plan_expiry || new Date(profile.plan_expiry) > now);
    if (!active) {
      return res.status(403).json({ error: 'AI Coach requires an active subscription' });
    }
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

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_KEY;
    if (!geminiKey && !openaiKey) {
      return res.json({ plan: basePlan, status: 'ready', source: 'base' });
    }

    try {
      const systemPrompt = `You are a world-class health coach. Create a 4-week plan with fitness, nutrition, and mindfulness.
Respond in JSON with fields: generatedAt (ISO), summary (string), goals (array), weeks (number), schedule (array of 7 objects with day, workout, nutrition, mindfulness), personalization (object).`;
      const userPrompt = `User goals: ${JSON.stringify(details?.goals || [])}
Allergies: ${JSON.stringify(details?.allergies || [])}
Injuries: ${JSON.stringify(details?.injuries || [])}
Meditation experience: ${JSON.stringify(details?.meditation_experience || 'beginner')}`;

      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `${systemPrompt}\n\n${userPrompt}\n\nReturn only valid JSON.`;
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const parsed = JSON.parse(text);
        return res.json({ plan: parsed, status: 'ready', source: 'gemini' });
      }

      const client = new OpenAI({ apiKey: openaiKey as string });
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
      return res.json({ plan: parsed, status: 'ready', source: 'openai' });
    } catch (llmErr: any) {
      // eslint-disable-next-line no-console
      console.warn('[AI] OpenAI error, falling back to base plan', llmErr?.message);
      return res.json({ plan: basePlan, status: 'processing' });
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[AI] generate-plan error', e);
    return res.status(500).json({ error: e?.message || 'Failed to generate plan' });
  }
});

// AI: Generate and save three plans (fitness, nutrition, mental health)
app.post('/api/ai/generate-plans', async (req, res) => {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // Gate: Only active subscribers can use AI Coach
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('plan, plan_expiry')
      .eq('id', userId)
      .single();
    if (profileErr) return res.status(400).json({ error: 'Profile not found' });
    const now = new Date();
    const active = profile?.plan && profile.plan !== 'trial' && (!profile?.plan_expiry || new Date(profile.plan_expiry) > now);
    if (!active) {
      return res.status(403).json({ error: 'AI Coach requires an active subscription' });
    }

    // Fetch onboarding details once
    const { data: details } = await supabase
      .from('onboarding_details')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const makeBasePlan = (summary: string) => ({
      generatedAt: new Date().toISOString(),
      summary,
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
    });

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_KEY;
    const summaries = {
      fitness: 'AI Fitness Plan - 4 weeks',
      nutrition: 'AI Nutrition Plan - 4 weeks',
      mental: 'AI Mental Health Plan - 4 weeks',
    } as const;

    const buildPrompt = (domain: 'fitness' | 'nutrition' | 'mental') => ({
      system: `You are a world-class ${domain} coach. Create a 4-week ${domain} plan.`,
      user: `User goals: ${JSON.stringify(details?.goals || [])}
Allergies: ${JSON.stringify(details?.allergies || [])}
Injuries: ${JSON.stringify(details?.injuries || [])}
Meditation experience: ${JSON.stringify(details?.meditation_experience || 'beginner')}
Return JSON with fields: generatedAt (ISO), summary (string), goals (array), weeks (number), schedule (array of 7 objects relevant to ${domain}), personalization (object).`,
    });

    const result: any[] = [];
    const categories: Array<{ key: 'fitness'|'nutrition'|'mental'; category: 'fitness'|'nutrition'|'mental health' }> = [
      { key: 'fitness', category: 'fitness' },
      { key: 'nutrition', category: 'nutrition' },
      { key: 'mental', category: 'mental health' },
    ];

    if (!geminiKey && !openaiKey) {
      // Fallback to base plans and save
      for (const c of categories) {
        const plan = makeBasePlan(summaries[c.key]);
        const { data: inserted } = await supabase
          .from('programs')
          .insert({
            name: plan.summary,
            description: `Personalized ${plan.weeks}-week plan generated by AI`,
            status: 'active',
            category: c.category,
            coach_id: userId,
            assigned_to: userId,
            scheduled_date: new Date().toISOString(),
            plan,
            is_ai_generated: true,
          })
          .select('id, category')
          .single();
        result.push({ category: c.category, programId: inserted?.id, status: 'ready', source: 'base' });
      }
      return res.json({ items: result });
    }

    try {
      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        for (const c of categories) {
          const { system, user } = buildPrompt(c.key);
          const prompt = `${system}\n\n${user}\n\nReturn only valid JSON.`;
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const response = await model.generateContent(prompt);
          const text = response.response.text();
          const plan = JSON.parse(text);
          const { data: inserted } = await supabase
            .from('programs')
            .insert({
              name: plan.summary || summaries[c.key],
              description: `Personalized ${plan.weeks || 4}-week plan generated by AI`,
              status: 'active',
              category: c.category,
              coach_id: userId,
              assigned_to: userId,
              scheduled_date: new Date().toISOString(),
              plan,
              is_ai_generated: true,
            })
            .select('id, category')
            .single();
          result.push({ category: c.category, programId: inserted?.id, status: 'ready', source: 'gemini' });
        }
      } else {
        const client = new OpenAI({ apiKey: openaiKey as string });
        for (const c of categories) {
          const { system, user } = buildPrompt(c.key);
          const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          });
          const content = completion.choices?.[0]?.message?.content || '';
          const plan = JSON.parse(content);
          const { data: inserted } = await supabase
            .from('programs')
            .insert({
              name: plan.summary || summaries[c.key],
              description: `Personalized ${plan.weeks || 4}-week plan generated by AI`,
              status: 'active',
              category: c.category,
              coach_id: userId,
              assigned_to: userId,
              scheduled_date: new Date().toISOString(),
              plan,
              is_ai_generated: true,
            })
            .select('id, category')
            .single();
          result.push({ category: c.category, programId: inserted?.id, status: 'ready', source: 'openai' });
        }
      }
      return res.json({ items: result });
    } catch (llmErr: any) {
      // Fallback to base plans and return processing
      for (const c of categories) {
        const plan = makeBasePlan(summaries[c.key]);
        const { data: inserted } = await supabase
          .from('programs')
          .insert({
            name: plan.summary,
            description: `Personalized ${plan.weeks}-week plan generated by AI`,
            status: 'active',
            category: c.category,
            coach_id: userId,
            assigned_to: userId,
            scheduled_date: new Date().toISOString(),
            plan,
            is_ai_generated: true,
          })
          .select('id, category')
          .single();
        result.push({ category: c.category, programId: inserted?.id, status: 'processing', source: 'base' });
      }
      return res.json({ items: result });
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[AI] generate-plans error', e);
    return res.status(500).json({ error: e?.message || 'Failed to generate plans' });
  }
});

// AI: Generate trend-based recommendations
app.post('/api/ai/trend-recommendations', async (req, res) => {
  try {
    const { trends, userGoals, userProfile } = req.body;
    if (!trends) return res.status(400).json({ error: 'trends required' });

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_KEY;
    
    if (!geminiKey && !openaiKey) {
      // Fallback to rule-based recommendations
      const recommendations = generateFallbackRecommendations(trends, userGoals || [], userProfile || {});
      return res.json({ recommendations });
    }

    try {
      const prompt = `Analyze these health trends and provide personalized recommendations:

Trends: ${JSON.stringify(trends, null, 2)}
User Goals: ${JSON.stringify(userGoals || [])}
User Profile: ${JSON.stringify(userProfile || {})}

Provide 3-5 actionable recommendations in JSON format:
{
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Recommendation Title",
      "description": "Detailed description of the recommendation",
      "category": "fitness|nutrition|mental|general",
      "priority": "high|medium|low",
      "actionable": true,
      "emoji": "relevant emoji"
    }
  ]
}

Focus on trends that show decline or need improvement. Be specific and actionable.`;

      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } else {
        const client = new OpenAI({ apiKey: openaiKey as string });
        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });
        const content = completion.choices?.[0]?.message?.content || '';
        const parsed = JSON.parse(content);
        return res.json(parsed);
      }
    } catch (llmErr: any) {
      console.warn('[AI] LLM error, falling back to rule-based recommendations', llmErr?.message);
      const recommendations = generateFallbackRecommendations(trends, userGoals || [], userProfile || {});
      return res.json({ recommendations });
    }
  } catch (e: any) {
    console.error('[AI] trend-recommendations error', e);
    return res.status(500).json({ error: e?.message || 'Failed to generate recommendations' });
  }
});

// Helper function for fallback recommendations
function generateFallbackRecommendations(trends: any, userGoals: string[], userProfile: any) {
  const recommendations = [];
  
  // Water trend
  if (trends.dailyCheckins?.water?.trend === 'down') {
    recommendations.push({
      id: 'water-1',
      title: 'Hydration Focus',
      description: 'Your water intake has decreased. Try setting hourly reminders to drink water.',
      category: 'nutrition',
      priority: 'high',
      actionable: true,
      emoji: '💧'
    });
  }
  
  // Mood trend
  if (trends.dailyCheckins?.mood?.trend === 'down') {
    recommendations.push({
      id: 'mood-1',
      title: 'Mood Support',
      description: 'Consider adding more outdoor activities or social connections to boost your mood.',
      category: 'mental',
      priority: 'high',
      actionable: true,
      emoji: '😊'
    });
  }
  
  // Sleep trend
  if (trends.dailyCheckins?.sleep?.trend === 'down') {
    recommendations.push({
      id: 'sleep-1',
      title: 'Sleep Optimization',
      description: 'Your sleep hours have decreased. Try establishing a consistent bedtime routine.',
      category: 'general',
      priority: 'high',
      actionable: true,
      emoji: '😴'
    });
  }
  
  return recommendations;
}


// Get coach payout settings
app.get('/api/coach/payout-settings', async (req, res) => {
  try {
    const { coachId } = req.query;
    if (!coachId) return res.status(400).json({ error: 'coachId required' });

    const { data: settings, error } = await supabase
      .from('coach_payout_settings')
      .select('*')
      .eq('coach_id', coachId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ settings: settings || null });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch payout settings' });
  }
});

// Update coach payout settings
app.post('/api/coach/payout-settings', async (req, res) => {
  try {
    const { coachId, payoutMethod, bankDetails, paypalEmail, stripeAccountId } = req.body;
    if (!coachId) return res.status(400).json({ error: 'coachId required' });

    const settings = {
      coach_id: coachId,
      payout_method: payoutMethod,
      bank_details: bankDetails || null,
      paypal_email: paypalEmail || null,
      stripe_account_id: stripeAccountId || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('coach_payout_settings')
      .upsert(settings, { onConflict: 'coach_id' })
      .select()
      .single();

    if (error) throw error;

    res.json({ settings: data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to update payout settings' });
  }
});

// Get coach available balance
app.get('/api/coach/balance', async (req, res) => {
  try {
    const { coachId } = req.query;
    if (!coachId) return res.status(400).json({ error: 'coachId required' });

    // Calculate available balance (total earnings - pending payouts)
    const { data: payouts, error: payoutsError } = await supabase
      .from('payouts')
      .select('net_amount_cents, status')
      .eq('coach_id', coachId);

    if (payoutsError) throw payoutsError;

    const totalEarnings = payouts
      ?.filter(p => p.status === 'paid')
      ?.reduce((sum, p) => sum + p.net_amount_cents, 0) || 0;

    const pendingAmount = payouts
      ?.filter(p => p.status === 'pending')
      ?.reduce((sum, p) => sum + p.net_amount_cents, 0) || 0;

    const availableBalance = totalEarnings - pendingAmount;

    res.json({ 
      totalEarnings,
      pendingAmount,
      availableBalance,
      availableBalanceFormatted: `$${(availableBalance / 100).toFixed(2)}`
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch balance' });
  }
});

// Request payout
app.post('/api/coach/request-payout', async (req, res) => {
  try {
    const { coachId, amountCents } = req.body;
    if (!coachId || !amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'coachId and amountCents required' });
    }

    // Check available balance
    const { data: balanceData } = await supabase
      .from('payouts')
      .select('net_amount_cents, status')
      .eq('coach_id', coachId);

    const totalEarnings = balanceData
      ?.filter(p => p.status === 'paid')
      ?.reduce((sum, p) => sum + p.net_amount_cents, 0) || 0;

    const pendingAmount = balanceData
      ?.filter(p => p.status === 'pending')
      ?.reduce((sum, p) => sum + p.net_amount_cents, 0) || 0;

    const availableBalance = totalEarnings - pendingAmount;

    if (amountCents > availableBalance) {
      return res.status(400).json({ error: 'Insufficient available balance' });
    }

    // Create payout request
    const { data, error } = await supabase
      .from('payouts')
      .insert({
        coach_id: coachId,
        amount_cents: amountCents,
        platform_fee_cents: 0, // No additional fee for withdrawals
        net_amount_cents: amountCents,
        status: 'pending',
        period_start: new Date().toISOString().slice(0,10),
        period_end: new Date().toISOString().slice(0,10),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ payout: data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to request payout' });
  }
});

// Check if contract extension is available (20% remaining)
app.get('/api/contract/extension-check', async (req, res) => {
  try {
    const { programId } = req.query;
    if (!programId) return res.status(400).json({ error: 'programId required' });

    const { data: program, error } = await supabase
      .from('programs')
      .select('duration_weeks, start_date, status')
      .eq('id', programId)
      .single();

    if (error) throw error;

    if (!program || program.status !== 'active') {
      return res.json({ extensionAvailable: false, reason: 'Program not active' });
    }

    const startDate = new Date(program.start_date);
    const now = new Date();
    const weeksElapsed = Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const totalWeeks = program.duration_weeks;
    const weeksRemaining = totalWeeks - weeksElapsed;
    const percentageRemaining = (weeksRemaining / totalWeeks) * 100;

    const extensionAvailable = percentageRemaining <= 20 && weeksRemaining > 0;

    res.json({
      extensionAvailable,
      weeksElapsed,
      totalWeeks,
      weeksRemaining,
      percentageRemaining: Math.round(percentageRemaining),
      reason: extensionAvailable ? 'Extension available' : 'Extension not yet available'
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to check extension availability' });
  }
});

// Request contract extension
app.post('/api/contract/request-extension', async (req, res) => {
  try {
    const { programId, extensionWeeks, coachId, customerId } = req.body;
    if (!programId || !extensionWeeks || !coachId || !customerId) {
      return res.status(400).json({ error: 'programId, extensionWeeks, coachId, and customerId required' });
    }

    // Check if extension is available
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('duration_weeks, start_date, status, price_cents')
      .eq('id', programId)
      .single();

    if (programError) throw programError;

    if (!program || program.status !== 'active') {
      return res.status(400).json({ error: 'Program not active' });
    }

    const startDate = new Date(program.start_date);
    const now = new Date();
    const weeksElapsed = Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const totalWeeks = program.duration_weeks;
    const weeksRemaining = totalWeeks - weeksElapsed;
    const percentageRemaining = (weeksRemaining / totalWeeks) * 100;

    if (percentageRemaining > 20) {
      return res.status(400).json({ error: 'Extension not yet available (more than 20% remaining)' });
    }

    // Calculate extension price (pro-rated)
    const weeklyPrice = program.price_cents / totalWeeks;
    const extensionPrice = Math.round(weeklyPrice * extensionWeeks);

    // Create extension request
    const { data: extension, error: extensionError } = await supabase
      .from('contract_extensions')
      .insert({
        program_id: programId,
        coach_id: coachId,
        customer_id: customerId,
        extension_weeks: extensionWeeks,
        extension_price_cents: extensionPrice,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (extensionError) throw extensionError;

    res.json({ extension });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to request extension' });
  }
});

// Get contract extensions for a program
app.get('/api/contract/extensions', async (req, res) => {
  try {
    const { programId } = req.query;
    if (!programId) return res.status(400).json({ error: 'programId required' });

    const { data: extensions, error } = await supabase
      .from('contract_extensions')
      .select('*')
      .eq('program_id', programId)
      .order('requested_at', { ascending: false });

    if (error) throw error;

    res.json({ extensions });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch extensions' });
  }
});

// Complete program and trigger 80/20 payout
app.post('/api/program/complete', async (req, res) => {
  try {
    const { programId, coachId, customerId } = req.body;
    if (!programId || !coachId || !customerId) {
      return res.status(400).json({ error: 'programId, coachId, and customerId required' });
    }

    // Get program details
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('price_cents, status, coach_id, customer_id')
      .eq('id', programId)
      .single();

    if (programError) throw programError;

    if (!program || program.status !== 'active') {
      return res.status(400).json({ error: 'Program not active or not found' });
    }

    if (program.coach_id !== coachId || program.customer_id !== customerId) {
      return res.status(403).json({ error: 'Unauthorized to complete this program' });
    }

    // Calculate 80/20 split
    const totalPrice = program.price_cents;
    const coachAmount = Math.round(totalPrice * 0.8); // 80% to coach
    const platformFee = totalPrice - coachAmount; // 20% to platform

    // Update program status
    const { error: updateError } = await supabase
      .from('programs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', programId);

    if (updateError) throw updateError;

    // Create completion payout (80% to coach)
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        coach_id: coachId,
        amount_cents: totalPrice,
        platform_fee_cents: platformFee,
        net_amount_cents: coachAmount,
        status: 'pending',
        payout_type: 'completion',
        program_id: programId,
        period_start: new Date().toISOString().slice(0,10),
        period_end: new Date().toISOString().slice(0,10),
      })
      .select()
      .single();

    if (payoutError) throw payoutError;

    // Create completion record
    const { data: completion, error: completionError } = await supabase
      .from('program_completions')
      .insert({
        program_id: programId,
        coach_id: coachId,
        customer_id: customerId,
        completion_date: new Date().toISOString(),
        coach_payout_cents: coachAmount,
        platform_fee_cents: platformFee,
        status: 'completed'
      })
      .select()
      .single();

    if (completionError) throw completionError;

    res.json({ 
      success: true, 
      payout, 
      completion,
      coachAmount: coachAmount,
      platformFee: platformFee,
      message: 'Program completed successfully. Coach payout initiated.'
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to complete program' });
  }
});

// Get program completion status
app.get('/api/program/completion-status', async (req, res) => {
  try {
    const { programId } = req.query;
    if (!programId) return res.status(400).json({ error: 'programId required' });

    const { data: completion, error } = await supabase
      .from('program_completions')
      .select('*')
      .eq('program_id', programId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ completion: completion || null });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch completion status' });
  }
});

// Send automated motivational message
app.post('/api/messages/automated', async (req, res) => {
  try {
    const { userId, messageType, programId, coachId } = req.body;
    if (!userId || !messageType) {
      return res.status(400).json({ error: 'userId and messageType required' });
    }

    const motivationalMessages = {
      daily_checkin: [
        "Good morning! 🌅 Ready to make today amazing? Your health journey continues with small, consistent steps.",
        "Every day is a new opportunity to invest in yourself. How are you feeling today?",
        "Remember: progress, not perfection. You're doing great! 💪",
        "Your future self will thank you for the choices you make today. Keep going! ✨"
      ],
      weekly_progress: [
        "Amazing work this week! 🎉 Your consistency is paying off. Keep up the great momentum!",
        "Week by week, you're building habits that will last a lifetime. Proud of your progress!",
        "Every week brings new challenges and victories. You're handling both beautifully! 🌟",
        "Your dedication is inspiring! This week's progress shows your commitment to growth."
      ],
      milestone_achieved: [
        "Congratulations! 🏆 You've reached an important milestone. Your hard work is paying off!",
        "Milestone reached! This is just the beginning of what you're capable of achieving.",
        "Incredible progress! Your consistency and dedication are truly inspiring. 🎯",
        "Well done! Every milestone is a stepping stone to your ultimate goals. Keep going!"
      ],
      program_start: [
        "Welcome to your transformation journey! 🚀 You've taken the first step towards a healthier, happier you.",
        "Exciting times ahead! Your commitment to change is the foundation of your success.",
        "Ready to begin? Your future self is already thanking you for this decision! 💫",
        "The journey of a thousand miles begins with a single step. You've taken it! 🌟"
      ],
      program_completion: [
        "Congratulations on completing your program! 🎊 You've shown incredible dedication and achieved something amazing.",
        "What an achievement! Your commitment to your health and wellness journey is truly inspiring.",
        "Program complete! You've proven that with dedication, anything is possible. Well done! 🏆",
        "Incredible work! You've transformed not just your body, but your mindset and habits too."
      ],
      motivation_boost: [
        "You've got this! 💪 Remember why you started and keep pushing forward.",
        "Challenges are opportunities in disguise. You're stronger than you think!",
        "Every expert was once a beginner. You're on the right path! 🌟",
        "Your only competition is the person you were yesterday. Keep improving! 🎯"
      ]
    };

    const systemMessages = {
      payment_reminder: "Friendly reminder: Your subscription will renew soon. Keep your wellness journey uninterrupted! 💳",
      feature_update: "New features are now available! Check out the latest updates to enhance your experience. 🆕",
      maintenance_notice: "Scheduled maintenance will occur tonight. We'll be back online shortly! 🔧",
      security_alert: "For your security, please verify your account if you notice any unusual activity. 🔒"
    };

    let messageContent = '';
    let messageCategory = 'motivational';

    if (messageType.startsWith('system_')) {
      const systemType = messageType.replace('system_', '');
      messageContent = systemMessages[systemType as keyof typeof systemMessages] || 'System notification';
      messageCategory = 'system';
    } else {
      const messages = motivationalMessages[messageType as keyof typeof motivationalMessages];
      if (messages) {
        messageContent = messages[Math.floor(Math.random() * messages.length)];
      } else {
        messageContent = 'Keep up the great work! Your dedication is inspiring.';
      }
    }

    // Create message record
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: coachId || 'system',
        receiver_id: userId,
        content: messageContent,
        message_type: messageType,
        category: messageCategory,
        is_automated: true,
        program_id: programId || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      message,
      content: messageContent 
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to send automated message' });
  }
});

// Get automated message templates
app.get('/api/messages/templates', async (req, res) => {
  try {
    const { messageType } = req.query;
    
    const templates = {
      motivational: {
        daily_checkin: [
          "Good morning! 🌅 Ready to make today amazing?",
          "Every day is a new opportunity to invest in yourself.",
          "Remember: progress, not perfection. You're doing great! 💪"
        ],
        weekly_progress: [
          "Amazing work this week! 🎉 Your consistency is paying off.",
          "Week by week, you're building habits that will last a lifetime.",
          "Your dedication is inspiring! This week's progress shows your commitment."
        ],
        milestone_achieved: [
          "Congratulations! 🏆 You've reached an important milestone.",
          "Milestone reached! This is just the beginning of what you're capable of.",
          "Incredible progress! Your consistency and dedication are truly inspiring. 🎯"
        ]
      },
      system: {
        payment_reminder: "Friendly reminder: Your subscription will renew soon.",
        feature_update: "New features are now available! Check out the latest updates.",
        maintenance_notice: "Scheduled maintenance will occur tonight.",
        security_alert: "For your security, please verify your account if needed."
      }
    };

    if (messageType) {
      const category = messageType.startsWith('system_') ? 'system' : 'motivational';
      const type = messageType.replace('system_', '');
      res.json({ templates: templates[category][type] || [] });
    } else {
      res.json({ templates });
    }
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch templates' });
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


