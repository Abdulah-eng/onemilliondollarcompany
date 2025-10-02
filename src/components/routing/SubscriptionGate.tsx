import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="flex h-48 w-full items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
  </div>
);

// Allows access if: active subscription OR has a coach assigned (coach contract)
const SubscriptionGate = ({ children }: Props) => {
  const { profile, loading } = useAuth();
  const { planStatus } = usePaymentPlan();

  if (loading || planStatus.loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  const hasCoachContract = Boolean(profile.coach_id);
  const hasAccess = planStatus.hasActivePlan || hasCoachContract;

  if (!hasAccess) {
    return <Navigate to="/customer/payment/update-plan" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGate;


