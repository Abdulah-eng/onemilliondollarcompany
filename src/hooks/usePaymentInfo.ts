import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentInfo {
  currentPlan: {
    name: string;
    price: string;
    billingCycle: string;
    nextBillingDate: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
  };
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  } | null;
  subscriptionId: string | null;
}

export const usePaymentInfo = () => {
  const { profile } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get subscription info from profile
        const subscriptionId = profile.stripe_subscription_id;
        const plan = profile.plan;
        const planExpiry = profile.plan_expiry;

        // Determine plan status
        let status: 'active' | 'canceled' | 'past_due' | 'trialing' = 'canceled';
        const expiryDate = planExpiry ? new Date(planExpiry) : null;
        const isExpired = expiryDate ? expiryDate < new Date() : false;
        if (plan && !isExpired) {
          status = 'active';
        } else if (plan && isExpired) {
          status = 'past_due';
        }

        // Format plan info
        const currentPlan = {
          name: plan || 'No Plan',
          price: plan === 'platform_monthly' ? '$49.99' : (plan ? 'Free' : 'Free'),
          billingCycle: plan === 'platform_monthly' ? 'month' : (plan ? 'N/A' : 'N/A'),
          nextBillingDate: planExpiry ? new Date(planExpiry).toLocaleDateString() : 'N/A',
          status
        };

        // For now, we'll use placeholder payment method data
        // In a real app, you'd fetch this from Stripe API
        const paymentMethod = subscriptionId ? {
          brand: 'Visa',
          last4: '4242',
          expiry: '12/25'
        } : null;

        setPaymentInfo({
          currentPlan,
          paymentMethod,
          subscriptionId
        });
      } catch (err) {
        console.error('Error fetching payment info:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch payment info');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [profile]);

  return {
    paymentInfo,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-trigger the effect
      setPaymentInfo(null);
    }
  };
};
