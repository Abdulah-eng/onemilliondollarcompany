import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentPlanStatus {
  hasActivePlan: boolean;
  hasActiveSubscription: boolean;
  hasActiveTrial: boolean;
  trialEndsAt: string | null;
  planExpired: boolean;
  hasUsedTrial: boolean;
  needsUpgrade: boolean;
  loading: boolean;
}

const getPlanFlags = (profile: any) => {
  const now = new Date();
  const planExpiry = profile.plan_expiry ? new Date(profile.plan_expiry) : null;
  const hasActiveTrial = Boolean(
    profile.plan === 'trial' &&
    planExpiry &&
    planExpiry > now
  );

  const hasActiveSubscription = Boolean(
    profile.plan &&
    profile.plan !== 'trial' &&
    (planExpiry ? planExpiry > now : true)
  );

  const hasActivePlan = hasActiveTrial || hasActiveSubscription;

  const planExpired = Boolean(
    profile.plan &&
    planExpiry &&
    planExpiry <= now
  );

  const hasUsedTrial = Boolean(
    (profile as any)?.has_used_trial ||
    profile.plan === 'trial' ||
    (planExpired && profile.plan === 'trial')
  );

  return {
    hasActivePlan,
    hasActiveSubscription,
    hasActiveTrial,
    planExpired,
    hasUsedTrial,
    trialEndsAt: hasActiveTrial && planExpiry ? planExpiry.toISOString() : null,
  };
};

export const usePaymentPlan = () => {
  const { profile, refreshProfile } = useAuth();
  const [planStatus, setPlanStatus] = useState<PaymentPlanStatus>({
    hasActivePlan: false,
    hasActiveSubscription: false,
    hasActiveTrial: false,
    trialEndsAt: null,
    planExpired: false,
    hasUsedTrial: false,
    needsUpgrade: false,
    loading: true,
  });

  useEffect(() => {
    if (!profile) {
      setPlanStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const checkPlanStatus = () => {
      const flags = getPlanFlags(profile);
      const needsUpgrade = !flags.hasActivePlan && profile.onboarding_complete;

      setPlanStatus({
        ...flags,
        needsUpgrade,
        loading: false,
      });
    };

    checkPlanStatus();
  }, [profile]);

  const startTrial = async () => {
    if (!profile?.id) return { error: 'No user found' };

    if ((profile as any)?.has_used_trial) {
      return { error: 'Free trial has already been used.' };
    }

    const now = new Date();
    if (profile.plan === 'trial' && profile.plan_expiry && new Date(profile.plan_expiry) > now) {
      return { error: 'Your trial is already active.' };
    }

    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 7); // 7 days from now

    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'trial',
        plan_expiry: trialExpiry.toISOString(),
        has_used_trial: true,
      })
      .eq('id', profile.id);

    if (!error) {
      await refreshProfile();
    }

    return { error };
  };

  const refreshPaymentPlan = async () => {
    if (!profile) return;

    setPlanStatus(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      if (profile) {
        const flags = getPlanFlags(profile);
        const needsUpgrade = !flags.hasActivePlan && profile.onboarding_complete;

        setPlanStatus({
          ...flags,
          needsUpgrade,
          loading: false,
        });
      }
    }, 100);
  };

  return {
    planStatus,
    startTrial,
    refreshPaymentPlan,
  };
};