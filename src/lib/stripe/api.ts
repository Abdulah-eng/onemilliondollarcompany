import { postJson, getJson } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const withBase = (path: string) => (API_BASE ? `${API_BASE}${path}` : path);

async function postWithFallback<T>(path: string, body: unknown) : Promise<T> {
  try {
    return await postJson<T>(withBase(path), body);
  } catch (e) {
    // In dev, if a base is configured but fails (e.g., 404), retry via proxy with relative path
    if (import.meta.env.DEV && API_BASE) {
      return await postJson<T>(path, body);
    }
    throw e;
  }
}

async function getWithFallback<T>(path: string): Promise<T> {
  try {
    return await getJson<T>(withBase(path));
  } catch (e) {
    if (import.meta.env.DEV && API_BASE) {
      return await getJson<T>(path);
    }
    throw e;
  }
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
  return await postWithFallback('/api/stripe/create-checkout-session', params);
}

export async function cancelSubscriptionAtPeriodEnd(subscriptionId?: string, stripeCustomerId?: string): Promise<{ success: boolean; current_period_end?: number; error?: string }> {
  return await postWithFallback('/api/stripe/cancel-at-period-end', { subscriptionId, stripeCustomerId });
}

export async function resumeSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  return await postWithFallback('/api/stripe/resume', { subscriptionId });
}

export async function syncCheckoutSession(sessionId: string): Promise<{ ok?: boolean; error?: string; plan_expiry?: number; user_id?: string }> {
  return await getWithFallback(`/api/stripe/sync?session_id=${encodeURIComponent(sessionId)}`);
}

export async function createOfferCheckoutSession(offerId: string): Promise<CheckoutSessionResponse> {
  return await postWithFallback('/api/stripe/create-offer-checkout', { offerId });
}

export async function openCustomerPortal(stripeCustomerId: string, returnUrl?: string): Promise<{ url: string }> {
  return await postWithFallback('/api/stripe/customer-portal', { stripeCustomerId, returnUrl });
}

export async function cancelSubscriptionNow(subscriptionId?: string, userId?: string, stripeCustomerId?: string): Promise<{ success: boolean; canceled_at?: number; error?: string }> {
  return await postWithFallback('/api/stripe/cancel-now', { subscriptionId, userId, stripeCustomerId });
}

export async function gracefulCancelPlan(userId: string): Promise<{ success?: boolean; error?: string }> {
  return await postWithFallback('/api/stripe/cancel-graceful', { userId });
}


