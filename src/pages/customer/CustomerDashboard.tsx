// src/pages/customer/CustomerDashboard.tsx
import WelcomeHeader from '@/components/customer/dashboard/WelcomeHeader';
import TodaysProgram from '@/components/customer/dashboard/TodaysFocus';
import Alerts from '@/components/customer/dashboard/Alerts';
import QuickStats from '@/components/customer/dashboard/QuickStats';
import DailyCheckIn from '@/components/customer/dashboard/DailyCheckIn';
import DailyCheckinPrompt from '@/components/customer/progress/DailyCheckinPrompt';
import CustomerStateBanner from '@/components/customer/dashboard/CustomerStateBanner';

const CustomerDashboard = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <DailyCheckinPrompt />
      {/* State Banner */}
      <CustomerStateBanner />

      {/* Header */}
      <WelcomeHeader />

      {/* Alerts */}
      <Alerts />

      {/* Main Dashboard Content */}
      <DailyCheckIn />
      <QuickStats />
      <TodaysProgram />
    </div>
  );
};

export default CustomerDashboard;
