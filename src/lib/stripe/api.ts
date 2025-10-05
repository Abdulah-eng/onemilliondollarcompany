import { postJson, getJson } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const withBase = (path: string) => (API_BASE ? `${API_BASE}${path}` : path);

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
  return await postJson(withBase('/api/stripe/create-checkout-session'), params);
}

export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string): Promise<{ success: boolean; current_period_end?: number; error?: string }> {
  return await postJson(withBase('/api/stripe/cancel-at-period-end'), { subscriptionId });
}

export async function resumeSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  return await postJson(withBase('/api/stripe/resume'), { subscriptionId });
}

export async function syncCheckoutSession(sessionId: string): Promise<{ ok?: boolean; error?: string; plan_expiry?: number; user_id?: string }> {
  return await getJson(withBase(`/api/stripe/sync?session_id=${encodeURIComponent(sessionId)}`));
}

export async function createOfferCheckoutSession(offerId: string): Promise<CheckoutSessionResponse> {
  return await postJson(withBase('/api/stripe/create-offer-checkout'), { offerId });
}

export async function openCustomerPortal(stripeCustomerId: string, returnUrl?: string): Promise<{ url: string }> {
  return await postJson(withBase('/api/stripe/customer-portal'), { stripeCustomerId, returnUrl });
}


