import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createStripeClient, createSupabaseClient, corsHeaders, handleCors } from './_shared.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const stripe = createStripeClient();
    const supabase = createSupabaseClient(req);
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'session_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('[API] /api/stripe/sync', {
      sessionId,
      customer: session.customer,
      subscription: session.subscription,
      client_reference_id: session.client_reference_id,
      mode: session.mode,
    });

    const clientRef = (session.client_reference_id as string) || '';
    
    // Handle coach offer payments (one-time payments)
    if (session.mode === 'payment' && clientRef.startsWith('offer:')) {
      const offerId = clientRef.replace('offer:', '');
      console.log('[API] stripe-sync processing offer payment', { offerId, sessionId });
      
      const { data: offerRows, error: offerErr } = await supabase
        .from('coach_offers')
        .select('*')
        .eq('id', offerId)
        .limit(1);
      
      if (offerErr || !offerRows?.[0]) {
        console.error('[API] stripe-sync offer not found', { offerId, error: offerErr });
        return new Response(JSON.stringify({ error: 'Offer not found', offer_id: offerId }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const offer = offerRows[0];
      let statusChanged = false;
      
      if (offer.status !== 'accepted') {
        console.log('[API] stripe-sync updating offer status to accepted', { offerId });
        const { error: updateOfferError } = await supabase
          .from('coach_offers')
          .update({ status: 'accepted' })
          .eq('id', offerId);
        
        if (updateOfferError) {
          console.error('[API] stripe-sync failed to update offer status', { offerId, error: updateOfferError });
          throw updateOfferError;
        }
        
        statusChanged = true;
        
        const weeks = offer.duration_months || 1;
        const expiry = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000).toISOString();
        console.log('[API] stripe-sync updating profile', {
          customerId: offer.customer_id,
          coachId: offer.coach_id,
          plan: `${weeks}-week plan`,
          plan_expiry: expiry,
        });
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            coach_id: offer.coach_id,
            plan: `${weeks}-week plan`,
            plan_expiry: expiry,
          })
          .eq('id', offer.customer_id);
        
        if (profileError) {
          console.error('[API] stripe-sync failed to update profile', { customerId: offer.customer_id, error: profileError });
          throw profileError;
        }
        
        const amountCents = Math.round(Number(offer.price) * 100);
        const platformFee = Math.round(amountCents * 0.15);
        const netAmount = amountCents - platformFee;
        
        console.log('[API] stripe-sync creating payout', {
          coachId: offer.coach_id,
          amountCents,
          platformFee,
          netAmount,
        });
        const { error: payoutError } = await supabase
          .from('payouts')
          .insert({
            coach_id: offer.coach_id,
            amount_cents: amountCents,
            platform_fee_cents: platformFee,
            net_amount_cents: netAmount,
            status: 'pending',
            period_start: new Date().toISOString().slice(0, 10),
            period_end: new Date().toISOString().slice(0, 10),
          });
        
        if (payoutError) {
          console.error('[API] stripe-sync failed to create payout', { coachId: offer.coach_id, error: payoutError });
          throw payoutError;
        }
        
        try {
          const startDate = new Date();
          const endDate = new Date(startDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
          
          const { data: existingContract } = await supabase
            .from('contracts')
            .select('id')
            .eq('offer_id', offer.id)
            .maybeSingle();
          
          if (!existingContract) {
            const { error: contractError } = await supabase
              .from('contracts')
              .insert({
                coach_id: offer.coach_id,
                customer_id: offer.customer_id,
                offer_id: offer.id,
                status: 'active',
                start_date: startDate.toISOString().slice(0, 10),
                end_date: endDate.toISOString().slice(0, 10),
                price_cents: amountCents,
              });
            
            if (contractError) {
              console.warn('[API] stripe-sync failed to create contract', { offerId, error: contractError });
            }
          }
        } catch (contractErr) {
          console.warn('[API] stripe-sync contract handling error', { offerId, error: contractErr });
        }
        
        try {
          const { data: convo, error: convoError } = await supabase
            .from('conversations')
            .select('id')
            .eq('coach_id', offer.coach_id)
            .eq('customer_id', offer.customer_id)
            .maybeSingle();
          
          if (convoError) {
            console.error('[API] stripe-sync failed to fetch conversation', { error: convoError });
          }
          
          let conversationId = convo?.id as string | undefined;
          if (!conversationId) {
            const { data: created, error: createConvoError } = await supabase
              .from('conversations')
              .insert({ coach_id: offer.coach_id, customer_id: offer.customer_id, title: 'Coaching Contract' })
              .select('id')
              .single();
            
            if (createConvoError) {
              console.error('[API] stripe-sync failed to create conversation', { error: createConvoError });
            } else {
              conversationId = created?.id;
            }
          }
          
          if (conversationId) {
            const { error: messageError } = await supabase
              .from('messages')
              .insert({
                conversation_id: conversationId,
                sender_id: offer.coach_id,
                content: `✅ Your coaching plan is now active for ${offer.duration_months || 1} week(s). Let's get started!`,
                message_type: 'system',
              });
            
            if (messageError) {
              console.error('[API] stripe-sync failed to create system message', { error: messageError });
            }
          }
        } catch (chatErr) {
          console.warn('[API] stripe-sync conversation/message error', { error: chatErr });
        }
      }
      
      console.log('[API] stripe-sync offer payment completed', { offerId, status: 'accepted', statusChanged });
      return new Response(JSON.stringify({
        ok: true,
        offerId,
        status: 'accepted',
        statusChanged,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle subscription payments (existing logic)
    if (!session.customer || !session.subscription) {
      return new Response(JSON.stringify({ error: 'Session not completed or missing customer/subscription' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
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
      return new Response(JSON.stringify({ ok: true, plan_expiry: subscription.current_period_end, user_id: userId }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.warn('[API] /api/stripe/sync could not resolve user from session', { sessionId, customer: session.customer, client_reference_id: session.client_reference_id });
    return new Response(JSON.stringify({ error: 'User not found for session', session_id: sessionId }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('[API] /api/stripe/sync error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Failed to sync subscription' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

