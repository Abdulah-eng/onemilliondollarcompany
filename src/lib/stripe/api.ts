import { config } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';

// Helper to get auth headers for Supabase Edge Functions
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
    'apikey': config.supabase.anonKey,
  };
}

async function postToFunction<T>(functionName: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${config.api.baseUrl}/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  
  return await response.json() as T;
}

async function getFromFunction<T>(functionName: string, params?: Record<string, string>): Promise<T> {
  const headers = await getAuthHeaders();
  const url = new URL(`${config.api.baseUrl}/${functionName}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  
  return await response.json() as T;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
}

export async function createCheckoutSession(params: {
  priceKey: string;
  trialDays?: number;
  stripeCustomerId?: string | null;
  currency?: string;
  userId?: string;
}): Promise<CheckoutSessionResponse> {
  return await postToFunction<CheckoutSessionResponse>('stripe-checkout', params);
}

export async function cancelSubscriptionAtPeriodEnd(subscriptionId?: string, stripeCustomerId?: string): Promise<{ success: boolean; current_period_end?: number; error?: string }> {
  return await postToFunction('stripe-subscription', { action: 'cancel-at-period-end', subscriptionId, stripeCustomerId });
}

export async function resumeSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  return await postToFunction('stripe-subscription', { action: 'resume', subscriptionId });
}

export async function syncCheckoutSession(sessionId: string): Promise<{ ok?: boolean; error?: string; plan_expiry?: number; user_id?: string }> {
  return await getFromFunction('stripe-sync', { session_id: sessionId });
}

export async function syncOfferCheckoutSession(sessionId: string): Promise<{ offerId?: string; status?: string; statusChanged?: boolean; error?: string }> {
  return await getFromFunction('stripe-offer-sync', { session_id: sessionId });
}

export async function createOfferCheckoutSession(offerId: string): Promise<CheckoutSessionResponse> {
  return await postToFunction<CheckoutSessionResponse>('stripe-offer-checkout', { offerId });
}

export async function openCustomerPortal(stripeCustomerId: string, returnUrl?: string): Promise<{ url: string }> {
  return await postToFunction('stripe-customer-portal', { stripeCustomerId, returnUrl });
}

export async function cancelSubscriptionNow(subscriptionId?: string, userId?: string, stripeCustomerId?: string): Promise<{ success: boolean; canceled_at?: number; error?: string }> {
  return await postToFunction('stripe-subscription', { action: 'cancel-now', subscriptionId, userId, stripeCustomerId });
}

export async function gracefulCancelPlan(userId: string): Promise<{ success?: boolean; error?: string }> {
  return await postToFunction('stripe-subscription', { action: 'cancel-graceful', userId });
}


