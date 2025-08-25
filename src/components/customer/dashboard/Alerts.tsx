// src/components/customer/dashboard/Alerts.tsx
import { AlertCircle, CalendarCheck2, Star, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

/*
TODO: Backend Integration Notes for Alerts
- All flags (`needsCheckIn`, `plan`, `isFirstTimeLogin`, etc.) need to be fetched and determined from the user's profile and subscription status.
- This component should receive the user's state as props from the main dashboard page.
*/
const mockData = {
  plan: 'standard', // 'none', 'trial', 'otp', 'standard', 'expiring'
  needsCheckIn: true,
  // FIX: Set these to false to allow the component to render for demonstration.
  isFirstTimeLogin: false,
  hasNewProgram: false,
};

const Alerts = () => {
  const { plan, needsCheckIn, isFirstTimeLogin, hasNewProgram } = mockData;

  // Don't show alerts for new users or if they just got a new program,
  // as the WelcomeBanner already handles this.
  if (isFirstTimeLogin || hasNewProgram) return null;

  return (
    <div className="space-y-4">
      {/* Actionable Items */}
      {needsCheckIn && <AlertCard icon={<CalendarCheck2 />} title="Daily Check-in Pending" description="Log your progress for today." buttonText="Check In" theme="blue" />}
      
      {/* Upgrade & Subscription Prompts */}
      {plan === 'none' && <AlertCard icon={<Star />} title="Unlock Your Full Potential" description="Choose a plan to get personalized coaching." buttonText="View Plans" theme="orange" />}
      {plan === 'trial' && <AlertCard icon={<Clock />} title="Your Trial is Ending Soon!" description="Upgrade now to keep your momentum going." buttonText="Upgrade Now" theme="yellow" />}
      {plan === 'otp' && <AlertCard icon={<Zap />} title="Ready for Ongoing Support?" description="Upgrade to a subscription for continuous progress." buttonText="Compare Plans" theme="orange" />}
      {plan === 'standard' && <AlertCard icon={<Star />} title="Unlock Premium Features" description="Get advanced analytics and priority support." buttonText="Go Premium" theme="orange" />}
      {plan === 'expiring' && <AlertCard icon={<Clock />} title="Your Plan is About to Expire" description="Renew now to ensure uninterrupted access." buttonText="Renew Plan" theme="red" />}
    </div>
  );
};

const themes = {
  blue: 'from-blue-500 to-sky-600',
  yellow: 'from-yellow-500 to-amber-600',
  red: 'from-red-500 to-rose-600',
  orange: 'from-orange-500 to-amber-500',
};

const AlertCard = ({ icon, title, description, buttonText, theme }) => (
  <div className={`p-4 rounded-lg flex items-center gap-4 bg-gradient-to-r ${themes[theme]} text-white shadow-lg`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
    <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white flex-shrink-0">{buttonText}</Button>
  </div>
);

export default Alerts;
