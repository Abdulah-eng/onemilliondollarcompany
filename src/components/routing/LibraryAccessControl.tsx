import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface LibraryAccessControlProps {
  children: ReactNode;
}

const LoadingScreen = () => (
  <div className="flex h-48 w-full items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
  </div>
);

const LibraryAccessControl = ({ children }: LibraryAccessControlProps) => {
  const { profile, loading } = useAuth();
  const { planStatus } = usePaymentPlan();

  if (loading || planStatus.loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  const hasCoach = Boolean(profile.coach_id);
  const hasActivePlan = planStatus.hasActivePlan;

  // No access to library without coach or payment plan
  if (!hasCoach && !hasActivePlan) {
    return <Navigate to="/customer/payment/update-plan" replace />;
  }

  // Pass access level to children via context or props
  return <>{children}</>;
};

export default LibraryAccessControl;
