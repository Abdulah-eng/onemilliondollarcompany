import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface AccessControlProps {
  children: ReactNode;
  requiredAccess: 'payment' | 'coach' | 'free' | 'settings';
}

const LoadingScreen = () => (
  <div className="flex h-48 w-full items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
  </div>
);

const AccessControl = ({ children, requiredAccess }: AccessControlProps) => {
  const { profile, loading } = useAuth();
  const { planStatus } = usePaymentPlan();

  if (loading || planStatus.loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  const hasCoach = Boolean(profile.coach_id);
  const hasActivePlan = planStatus.hasActivePlan;
  const hasPaymentPlan = hasActivePlan;
  const hasCoachAccess = hasCoach;

  // Settings page is accessible to all users
  if (requiredAccess === 'settings') {
    return <>{children}</>;
  }

  // Payment plan access: requires active subscription
  if (requiredAccess === 'payment') {
    if (!hasPaymentPlan) {
      return <Navigate to="/customer/payment/update-plan" replace />;
    }
    return <>{children}</>;
  }

  // Coach access: requires either coach OR payment plan
  if (requiredAccess === 'coach') {
    if (!hasCoachAccess && !hasPaymentPlan) {
      return <Navigate to="/customer/payment/update-plan" replace />;
    }
    return <>{children}</>;
  }

  // Free access: always allowed (Home, My Coach)
  if (requiredAccess === 'free') {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AccessControl;
