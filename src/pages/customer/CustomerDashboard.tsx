// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* --- Header and Welcome Section --- */}
      <WelcomeHeader />

      {/* --- Alerts and Prompts (Now visible) --- */}
      <Alerts />

      {/* --- Main Dashboard Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Tasks) */}
        <div className="lg:col-span-2 space-y-8">
          <DailyCheckIn />
          <QuickStats />
          <TodaysFocus />
        </div>

        {/* Right Column (Secondary Widgets) */}
        <div className="lg:col-span-1 space-y-8">
          <CoachTip />
        </div>
      </div>
    </div>
  );
};

// --- Widget Component ---
const CoachTip = () => (
    <Card className="bg-white shadow-md">
        <CardHeader><CardTitle>💡 Coach's Tip</CardTitle></CardHeader>
        <CardContent>
            <p className="text-gray-600">Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!</p>
        </CardContent>
    </Card>
);

export default CustomerDashboard;
