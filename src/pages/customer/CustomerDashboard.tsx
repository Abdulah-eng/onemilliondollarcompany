// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysFocus from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';

const CustomerDashboard = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <WelcomeHeader />

      {/* Alerts */}
      <Alerts />

      {/* Main Dashboard Content */}
      <DailyCheckIn />
      <QuickStats />
      <TodaysFocus />
    </div>
  );
};

export default CustomerDashboard;
