// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysProgram from '@/components/customer/dashboard/TodaysFocus';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import CustomerStateBanner from '@/components/customer/dashboard/CustomerStateBanner';
import TrialCountdown from '@/components/customer/TrialCountdown';
import { useAccessLevel } from '@/contexts/AccessLevelContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

      {/* Overall Subscription Banner */}
      {needsAccess && (
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Crown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Unlock Premium Features
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Subscribe or get a coach to access all features including daily check-ins, detailed stats, programs, and more.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleUpgrade}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </Button>
                <Button 
                  onClick={handleFindCoach}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find a Coach
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
