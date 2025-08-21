// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/*
TODO: Backend Integration Notes for CustomerDashboard
- This component is the main entry point and should orchestrate all data fetching for the dashboard.
- Use a library like React Query to fetch all necessary data in one place:
  1. User's profile (`profiles` table)
  2. User's subscription status (`subscriptions` table)
  3. Today's assigned tasks (`assigned_workouts`, etc.)
  4. Daily check-in status (`daily_logs` table)
  5. Progress data and tips.
- Pass this data down as props to the child components.
*/
const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* --- Main Header --- */}
      <WelcomeHeader />

      {/* --- Alerts and Prompts --- */}
      <Alerts />

      {/* --- Today's Core Tasks --- */}
      <TodaysFocus />

      {/* --- Secondary Widgets in a Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickStats />
        <CoachTip />
      </div>
    </div>
  );
};

// --- Widget Components ---

const QuickStats = () => (
  // TODO: Fetch real stats: workout streak, weight change, etc.
  <Card className="lg:col-span-2">
    <CardHeader><CardTitle>Your Progress at a Glance</CardTitle></CardHeader>
    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
      <StatBox value="7" label="Day Streak" />
      <StatBox value="-1.2 kg" label="Weight Change" />
      <StatBox value="85%" label="Program Adherence" />
    </CardContent>
  </Card>
);

const StatBox = ({ value, label }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-2xl font-bold text-emerald-600">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const CoachTip = () => (
    // TODO: Fetch a relevant tip from a 'tips' table based on user's goals.
    <Card className="lg:col-span-1 bg-white">
        <CardHeader><CardTitle>💡 Coach's Tip</CardTitle></CardHeader>
        <CardContent>
            <p className="text-gray-600">Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!</p>
        </CardContent>
    </Card>
);

export default CustomerDashboard;
