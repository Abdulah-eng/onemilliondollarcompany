import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { Loader2, Crown, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (loading || planStatus.loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  const hasCoach = Boolean(profile.coach_id);
  const hasActivePlan = planStatus.hasActivePlan;
  const hasPaymentPlan = hasActivePlan;
  const hasCoachAccess = hasCoach;

  const handleUpgrade = () => {
    navigate('/customer/payment/update-plan');
  };

  const handleFindCoach = () => {
    navigate('/customer/my-coach');
  };

  // Settings page is accessible to all users
  if (requiredAccess === 'settings') {
    return <>{children}</>;
  }

  // Payment plan access: requires active subscription
  if (requiredAccess === 'payment') {
    if (!hasPaymentPlan) {
      return (
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
            <div className="text-center p-6 max-w-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get personalized insights and track your progress with detailed analytics.
              </p>
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
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find a Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Coach access: requires either coach OR payment plan
  if (requiredAccess === 'coach') {
    if (!hasCoachAccess && !hasPaymentPlan) {
      return (
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
            <div className="text-center p-6 max-w-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Get Coach Access
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Connect with a coach or subscribe to access personalized guidance and programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleUpgrade}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </Button>
                <Button 
                  onClick={handleFindCoach}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find a Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
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
