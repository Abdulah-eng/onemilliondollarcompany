// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/*
TODO: Backend Integration Notes for CustomerDashboard
- This component is the main entry point and should orchestrate all data fetching.
- Use a library like React Query to fetch all necessary data in one place and pass it down as props to the child components.
*/
const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* --- Main Header --- */}
      <WelcomeHeader />

      {/* --- Alerts and Prompts --- */}
      <Alerts />

      {/* --- Main Dashboard Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Tasks) */}
        <div className="lg:col-span-2 space-y-8">
          <QuickStats />
          <DailyCheckIn />
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
    // TODO: Fetch a relevant tip from a 'tips' table based on user's goals.
    <Card className="bg-white shadow-md">
        <CardHeader><CardTitle>💡 Coach's Tip</CardTitle></CardHeader>
        <CardContent>
            <p className="text-gray-600">Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!</p>
        </CardContent>
    </Card>
);

export default CustomerDashboard;
