// src/components/routing/RoleGate.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import PaymentPlanModal from '@/components/modals/PaymentPlanModal';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { useNavigate } from 'react-router-dom';

interface RoleGateProps {
  allowedRole: 'coach' | 'customer';
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
  </div>
);

const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
  const { profile, loading } = useAuth();
  const { planStatus, startTrial } = usePaymentPlan();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  if (loading || planStatus.loading) return <LoadingScreen />;
  
  if (!profile) return <Navigate to="/login" replace />;

  // If role doesn't match, redirect to the correct dashboard for their actual role
  if (profile.role !== allowedRole) {
    if (profile.role === 'coach') {
      return <Navigate to="/coach/dashboard" replace />;
    }
    if (profile.role === 'customer') {
      return profile.onboarding_complete 
        ? <Navigate to="/customer/dashboard" replace />
        : <Navigate to="/onboarding/step-1" replace />;
    }
  }

  // For customer role, check onboarding completion
  if (allowedRole === 'customer' && !profile.onboarding_complete) {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  // For customers with completed onboarding, check payment plan
  if (allowedRole === 'customer' && profile.onboarding_complete && planStatus.needsUpgrade) {
    // Show payment modal after a brief delay to avoid immediate popup
    if (!showPaymentModal) {
      setTimeout(() => setShowPaymentModal(true), 1000);
    }
  }

  const handleStartTrial = async () => {
    const { error } = await startTrial();
    if (!error) {
      setShowPaymentModal(false);
    }
  };

  const handleUpgrade = () => {
    setShowPaymentModal(false);
    navigate('/customer/cancel-subscription'); // Reuse existing payment page
  };

  return (
    <>
      {children}
      <PaymentPlanModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        hasUsedTrial={planStatus.hasUsedTrial}
        onStartTrial={!planStatus.hasUsedTrial ? handleStartTrial : undefined}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default RoleGate;