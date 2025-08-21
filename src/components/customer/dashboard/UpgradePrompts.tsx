
// src/components/customer/dashboard/UpgradePrompts.tsx
import { Star, Zap, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/*
TODO: Backend Integration Notes for UpgradePrompts
- Fetch the user's current subscription status from a `subscriptions` table linked to the user's ID.
- The `plan` variable should be set to the subscription's `type` (e.g., 'trial', 'otp', 'standard').
- The `expiring` state would be determined by checking if the subscription's `end_date` is within a certain timeframe (e.g., the next 7 days).
*/
const mockData = {
  plan: 'standard', // Change this to 'none', 'trial', 'otp', 'standard', 'premium', 'expiring' to see all states
};

const UpgradePrompts = () => {
  const { plan } = mockData;

  switch (plan) {
    case 'none':
      return <UpgradeCard icon={<Star />} title="Unlock Your Full Potential" description="Choose a plan to get personalized workouts, nutrition guidance, and direct access to your coach." buttonText="View Plans" />;
    case 'trial':
      return <UpgradeCard icon={<Clock />} title="Your Trial is Ending Soon!" description="Upgrade now to keep your momentum going and retain access to all your premium features." buttonText="Upgrade Now" bgColor="bg-yellow-100" borderColor="border-yellow-400" />;
    case 'otp':
      return <UpgradeCard icon={<Zap />} title="Ready for the Next Step?" description="Upgrade to a Standard or Premium plan for ongoing support, progress tracking, and more." buttonText="Compare Plans" />;
    case 'standard':
       return <UpgradeCard icon={<Star />} title="Unlock Premium Features" description="Get advanced analytics, priority support, and exclusive content by upgrading to Premium." buttonText="Go Premium" />;
    case 'expiring':
       return <UpgradeCard icon={<Clock />} title="Your Plan is About to Expire" description="Renew now to ensure uninterrupted access to your personalized wellness journey." buttonText="Renew Plan" bgColor="bg-red-100" borderColor="border-red-400" />;
    default:
      return null; // Don't show a prompt for 'premium' or if there's no relevant state
  }
};

const UpgradeCard = ({ icon, title, description, buttonText, bgColor = 'bg-emerald-50', borderColor = 'border-emerald-300' }) => (
  <Card className={`${bgColor} ${borderColor} border-2 shadow-md`}>
    <CardContent className="p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
      <div className="text-emerald-600">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <Button className="bg-emerald-600 hover:bg-emerald-700 mt-2 sm:mt-0">{buttonText}</Button>
    </CardContent>
  </Card>
);

export default UpgradePrompts;
