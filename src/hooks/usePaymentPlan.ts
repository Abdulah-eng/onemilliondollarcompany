import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentPlanStatus {
  hasActivePlan: boolean;
  planExpired: boolean;
  hasUsedTrial: boolean;
  needsUpgrade: boolean;
  loading: boolean;
}

export const usePaymentPlan = () => {
  const { profile } = useAuth();
  const [planStatus, setPlanStatus] = useState<PaymentPlanStatus>({
    hasActivePlan: false,
    planExpired: false,
    hasUsedTrial: false,
    needsUpgrade: false,
    loading: true
  });

  useEffect(() => {
    if (!profile) {
      setPlanStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const checkPlanStatus = () => {
      const now = new Date();
      const planExpiry = profile.plan_expiry ? new Date(profile.plan_expiry) : null;
      
      const hasActivePlan = Boolean(
        profile.plan && 
        profile.plan !== 'trial' && // Exclude trial plans
        (planExpiry ? planExpiry > now : true) // If no expiry, consider it active
      );
      
      const planExpired = Boolean(
        profile.plan && 
        planExpiry && 
        planExpiry <= now
      );

      // Check if user has used trial (plan was 'trial' at some point)
      const hasUsedTrial = Boolean((profile as any).has_used_trial) || profile.plan === 'trial' || (planExpired && profile.plan === 'trial');

      const needsUpgrade = !hasActivePlan && profile.onboarding_complete;


      setPlanStatus({
        hasActivePlan,
        planExpired,
        hasUsedTrial,
        needsUpgrade,
        loading: false
      });
    };

    checkPlanStatus();
  }, [profile]);

  const startTrial = async () => {
    if (!profile?.id) return { error: 'No user found' };

    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 14); // 14 days from now

    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'trial',
        plan_expiry: trialExpiry.toISOString(),
        has_used_trial: true
      })
      .eq('id', profile.id);

    if (!error) {
      // Refresh auth context to get updated profile
      window.location.reload();
    }

    return { error };
  };

  return {
    planStatus,
    startTrial
  };
};