// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysProgram from '@/components/customer/dashboard/TodaysFocus';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import CustomerStateBanner from '@/components/customer/dashboard/CustomerStateBanner';
import { useAccessLevel } from '@/contexts/AccessLevelContext';

const CustomerDashboard = () => {
  const { hasCoach, hasPaymentPlan } = useAccessLevel();
  
  // Only show Today's Program if user has coach or payment plan
  const canAccessPrograms = hasCoach || hasPaymentPlan;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* State Banner */}
      <CustomerStateBanner />

      {/* Header */}
      <WelcomeHeader />

      {/* Main Dashboard Content */}
      <DailyCheckIn />
      <QuickStats />
      
      {/* Today's Program - Only show if user has access */}
      {canAccessPrograms && <TodaysProgram />}
    </div>
  );
};

export default CustomerDashboard;
