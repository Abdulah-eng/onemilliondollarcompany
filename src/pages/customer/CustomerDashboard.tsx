// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerDashboard = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* --- Header and Welcome Section --- */}
      <WelcomeHeader />

      {/* --- Alerts and Prompts --- */}
      <Alerts />

      {/* --- Main Dashboard Content (Always Stacked) --- */}
      <DailyCheckIn />
      <QuickStats />
      <TodaysFocus />
      <CoachTip />
    </div>
  );
};

// --- Widget Component ---
const CoachTip = () => (
  <Card className="bg-white shadow-md">
    <CardHeader>
      <CardTitle>💡 Coach's Tip</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">
        Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!
      </p>
    </CardContent>
  </Card>
);

export default CustomerDashboard;
