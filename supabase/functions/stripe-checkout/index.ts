import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createStripeClient, PRICE_IDS, getAppUrl, corsHeaders, handleCors } from './_shared.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const stripe = createStripeClient();
    const body = await req.json();
    const { priceKey, trialDays, stripeCustomerId, currency, userId } = body;

    console.log('[API] create-checkout-session', { priceKey, trialDays, hasCustomer: !!stripeCustomerId, currency, userId });

    let price: string;
    if (currency && PRICE_IDS[currency as keyof typeof PRICE_IDS]) {
      price = PRICE_IDS[currency as keyof typeof PRICE_IDS];
    } else {
      const priceMap: Record<string, string> = {
        platform_monthly: PRICE_IDS.usd,
      };
      price = priceMap[priceKey] || priceKey;
    }
    
    if (!price || price.startsWith('prod_')) {
      return new Response(JSON.stringify({
        error: 'Invalid Stripe price id. Expected a price_... id. Check your currency or priceKey.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const appUrl = getAppUrl();
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
      success_url: `${appUrl}/customer/settings?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/customer/settings?status=cancel`,
    });
    
    console.log('[API] Checkout session created', { sessionId: session.id, url: session.url });
    return new Response(JSON.stringify({ checkoutUrl: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('[API] create-checkout-session error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Failed to create checkout session' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

