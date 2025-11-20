// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysProgram from '@/components/customer/dashboard/TodaysFocus';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import CustomerStateBanner from '@/components/customer/dashboard/CustomerStateBanner';
import TrialCountdown from '@/components/customer/TrialCountdown';
import { useAccessLevel } from '@/contexts/AccessLevelContext';
import { useNavigate } from 'react-router-dom';
import LockedOverlay from '@/components/customer/dashboard/LockedOverlay';
import { cn } from '@/lib/utils';

const CustomerDashboard = () => {
  const { hasCoach, hasPaymentPlan } = useAccessLevel();
  const navigate = useNavigate();
  
  // Only show Today's Program if user has coach or payment plan
  const canAccessPrograms = hasCoach || hasPaymentPlan;
  const needsAccess = !hasCoach && !hasPaymentPlan;

  const handleUpgrade = () => {
    navigate('/customer/payment/update-plan');
  };

  const handleFindCoach = () => {
    navigate('/customer/my-coach');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* State Banner */}
      <CustomerStateBanner />

      {/* Trial Countdown */}
      <TrialCountdown />

      {/* Header */}
      <WelcomeHeader />

      {/* Main Dashboard Content */}
      <div className="relative">
        <div className={cn("space-y-8", needsAccess && "blur-sm pointer-events-none select-none")}>
          <DailyCheckIn />
          <QuickStats />
          {canAccessPrograms && <TodaysProgram />}
        </div>
        {needsAccess && (
          <LockedOverlay
            title="Unlock your personalized dashboard"
            description="Start your free 7-day trial or subscribe to view everything inside your dashboard."
            benefits={[
              'Daily check-ins for mood, sleep, hydration, and energy',
              'Weekly insight cards with progress stats and goal tracking',
              'AI Coach programs tailored to your goals',
            ]}
            onUpgrade={handleUpgrade}
            onFindCoach={handleFindCoach}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
