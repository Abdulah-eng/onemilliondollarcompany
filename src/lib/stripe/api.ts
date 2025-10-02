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

export async function cancelSubscriptionAtPeriodEnd(): Promise<{ success: boolean }> {
  return await postJson(withBase('/api/stripe/cancel-at-period-end'));
}

export async function resumeSubscription(): Promise<{ success: boolean }> {
  return await postJson(withBase('/api/stripe/resume'));
}

export async function syncCheckoutSession(sessionId: string): Promise<{ ok?: boolean; error?: string; plan_expiry?: number; user_id?: string }> {
  return await getJson(withBase(`/api/stripe/sync?session_id=${encodeURIComponent(sessionId)}`));
}


