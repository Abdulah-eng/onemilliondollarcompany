// src/pages/customer/CustomerDashboard.tsx
import WelcomeBanner from '@/components/customer/dashboard/WelcomeBanner';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import ActionItems from '@/components/customer/dashboard/ActionItems';
import UpgradePrompts from '@/components/customer/dashboard/UpgradePrompts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/*
TODO: Backend Integration Notes for CustomerDashboard
- This component will become the main entry point for the customer's authenticated experience.
- It should contain the primary data-fetching logic (e.g., using React Query) to get all the necessary data for the child components.
- The fetched data (user profile, subscription status, today's tasks, etc.) will then be passed down as props to the individual components.
*/
const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="space-y-4">
        <UpgradePrompts />
        <ActionItems />
      </div>

      <TodaysFocus />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressSnapshot />
        <MotivationCard />
        <CoachTipCard />
      </div>
    </div>
  );
};

// --- Placeholder Widget Components ---

const ProgressSnapshot = () => (
  // TODO: Fetch recent progress data (e.g., weight change from 'daily_logs', workout streak from 'activity_logs').
  <Card className="lg:col-span-1">
    <CardHeader><CardTitle>Progress Snapshot</CardTitle></CardHeader>
    <CardContent>
      <p className="text-gray-600">Your weekly progress will be shown here. Keep up the great work!</p>
    </CardContent>
  </Card>
);

const MotivationCard = () => (
  // TODO: Fetch a random motivational quote from a 'quotes' table in Supabase.
  <Card className="lg:col-span-1 bg-gradient-to-br from-teal-50 to-emerald-100">
    <CardHeader><CardTitle>Quote of the Day</CardTitle></CardHeader>
    <CardContent>
      <p className="text-gray-700 italic">"The only bad workout is the one that didn't happen."</p>
    </CardContent>
  </Card>
);

const CoachTipCard = () => (
    // TODO: Fetch a relevant tip. This could be from a 'tips' table, filtered by the user's primary goal (from 'onboarding_details').
    <Card className="lg:col-span-1">
        <CardHeader><CardTitle>💡 Coach's Tip</CardTitle></CardHeader>
        <CardContent>
            <p className="text-gray-600">Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!</p>
        </CardContent>
    </Card>
);

export default CustomerDashboard;
