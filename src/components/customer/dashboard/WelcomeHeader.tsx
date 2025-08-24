// src/components/customer/dashboard/WelcomeHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Droplets, BedDouble, Weight, TrendingUp, Lock, HeartPulse, Battery } from 'lucide-react';

/*
TODO: Backend Integration Notes for WelcomeHeader
- `userName`: Fetch from `profiles.full_name`.
- `plan`: Fetch from a `subscriptions` table. Should be 'otp', 'standard', or 'premium'.
- All stat values and trends need to be calculated from `daily_logs` and `activity_logs`.
*/
const mockData = {
  userName: 'Alex',
  plan: 'standard', // Change to 'premium' to unlock all stats
  quote: "The secret of getting ahead is getting started.",
  stats: {
    streak: 7,
    avgWater: '2.1 L',
    avgEnergy: 'Good',
    avgSleep: '7.5 hrs',
    avgMood: 'Positive',
    weightTrend: '-0.5 kg',
    goalAdherence: 85,
  },
};

const WelcomeHeader = () => {
  const { userName, plan, quote, stats } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  // Define all stats with their plan requirements
  const statItems = [
    { label: "7-Day Streak", value: `${stats.streak} Days`, icon: <Flame size={16} />, requiredPlan: 'otp' },
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets size={16} />, requiredPlan: 'otp' },
    { label: "Avg. Energy", value: stats.avgEnergy, icon: <Battery size={16} />, requiredPlan: 'otp' },
    { label: "Avg. Mood", value: stats.avgMood, icon: <HeartPulse size={16} />, requiredPlan: 'otp' },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble size={16} />, requiredPlan: 'otp' },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight size={16} />, requiredPlan: 'premium' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp size={16} />, requiredPlan: 'premium' },
  ];
  
  const planLevels = { otp: 1, standard: 2, premium: 3 };
  const userPlanLevel = planLevels[plan] || 0;

  return (
    <Card className="border-none bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg animate-fade-in-down overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold">Good {timeOfDay}, {userName}</h1>
                <p className="opacity-80 mt-1 text-sm italic">"{quote}"</p>
            </div>
            <span className="text-3xl transform -rotate-12 opacity-50">☀️</span>
        </div>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {statItems.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
              isLocked={planLevels[stat.requiredPlan] > userPlanLevel}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ icon, label, value, isLocked }) => {
  if (isLocked) {
    return (
      <div className="relative bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm flex flex-col justify-center items-center min-h-[90px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
            <Lock size={16} className="text-white/70" />
            <p className="text-[10px] font-bold">Premium</p>
            <Button size="sm" variant="secondary" className="h-6 px-2 text-[10px]">Upgrade</Button>
        </div>
        <div className="blur-sm select-none pointer-events-none">
          <div className="mx-auto w-fit rounded-full bg-white/10 p-2">{icon}</div>
          <p className="mt-1 font-semibold text-sm">{value}</p>
          <p className="text-[10px] opacity-70">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors cursor-pointer flex flex-col justify-center min-h-[90px]">
      <div className="mx-auto w-fit rounded-full bg-white/10 p-2">{icon}</div>
      <p className="mt-1 font-semibold text-sm">{value}</p>
      <p className="text-[10px] opacity-70">{label}</p>
    </div>
  );
};

export default WelcomeHeader;
