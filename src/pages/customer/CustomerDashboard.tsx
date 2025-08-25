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

      {/* --- Alerts and Prompts --- */}
      <Alerts />

      {/* --- Main Dashboard Content (Single-Column Layout) --- */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <DailyCheckIn />
        <QuickStats />
        <TodaysFocus />
        <CoachTip />
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
