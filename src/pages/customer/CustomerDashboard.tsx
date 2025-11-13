// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysProgram from '@/components/customer/dashboard/TodaysFocus';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import CustomerStateBanner from '@/components/customer/dashboard/CustomerStateBanner';
import { useAccessLevel } from '@/contexts/AccessLevelContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TestTube } from 'lucide-react';

const CustomerDashboard = () => {
  const { hasCoach, hasPaymentPlan } = useAccessLevel();
  const navigate = useNavigate();
  
  // Only show Today's Program if user has coach or payment plan
  const canAccessPrograms = hasCoach || hasPaymentPlan;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* State Banner */}
      <CustomerStateBanner />

      {/* Header */}
      <WelcomeHeader />

      {/* Test Button - Temporary for debugging */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/customer/test-offer-payment-flow')}
          className="gap-2"
        >
          <TestTube className="w-4 h-4" />
          Test Offer Payment Flow
        </Button>
      </div>

      {/* Main Dashboard Content */}
      <DailyCheckIn />
      <QuickStats />
      
      {/* Today's Program - Only show if user has access */}
      {canAccessPrograms && <TodaysProgram />}
    </div>
  );
};

export default CustomerDashboard;
