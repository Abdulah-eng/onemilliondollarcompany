import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';

export const useLibraryAccess = () => {
  const { profile } = useAuth();
  const { planStatus } = usePaymentPlan();

  // Free users without coach - no library access
  if (!profile?.coach_id) {
    return {
      hasAccess: false,
      accessLevel: 'none' as const,
      shouldShowLink: false
    };
  }

  // Users with coach but no payment plan - limited access
  if (!planStatus.hasActivePlan) {
    return {
      hasAccess: true,
      accessLevel: 'limited' as const,
      shouldShowLink: true
    };
  }

  // Users with payment plan and coach - full access
  return {
    hasAccess: true,
    accessLevel: 'full' as const,
    shouldShowLink: true
  };
};
