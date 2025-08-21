// src/components/customer/dashboard/WelcomeBanner.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, Rocket } from 'lucide-react';

/*
TODO: Backend Integration Notes for WelcomeBanner
- Fetch the user's first name from the `profiles` table (`full_name` column).
- The `isFirstTimeLogin` flag should be determined by checking if the user's `plan` is 'none' or null in a 'subscriptions' table. This banner should only show once.
- The `hasNewProgram` flag should be true if there's a program assigned to the user that they haven't started yet. This could be a boolean flag like `has_viewed_new_program` in the user's profile that gets set to true after they click the "View Program" button.
*/
const mockData = {
  userName: 'Alex',
  isFirstTimeLogin: false, // Set to true to see the "Welcome" state
  hasNewProgram: true,    // Set to true to see the "New Program" state
};

const WelcomeBanner = () => {
  const { userName, isFirstTimeLogin, hasNewProgram } = mockData;

  if (isFirstTimeLogin) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <PartyPopper className="w-12 h-12 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">Welcome to TrainWise, {userName}!</h2>
            <p className="opacity-90">We're excited to have you. Let's find the perfect plan to start your journey.</p>
          </div>
          <Button variant="secondary" className="mt-2 sm:mt-0 sm:ml-auto">Choose a Plan</Button>
        </CardContent>
      </Card>
    );
  }

  if (hasNewProgram) {
    return (
      <Card className="bg-white border-2 border-emerald-400 shadow-lg">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 text-emerald-800">
          <Rocket className="w-12 h-12 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">Your New Program is Ready!</h2>
            <p>Your coach has assigned you a new plan. Let's check it out and get started.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 mt-2 sm:mt-0 sm:ml-auto">View Program</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Good Morning, {userName} 👋</h1>
      <p className="text-gray-500 mt-1">Let's make today a great day for your wellness.</p>
    </div>
  );
};

export default WelcomeBanner;
