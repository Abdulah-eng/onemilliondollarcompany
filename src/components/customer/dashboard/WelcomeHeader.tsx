// src/components/customer/dashboard/WelcomeHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Droplets, BatteryFull, Smile, BedDouble, Weight, TrendingUp, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes for WelcomeHeader
- `userName`: Fetch the user's first name from `profiles.full_name`.
- `plan`: Fetch the user's current subscription plan ('standard', 'premium', etc.).
- The value for each stat needs to be calculated from the user's historical data in `daily_logs` and `activity_logs`.
- The `goalAdherence` requires comparing completed tasks vs. assigned tasks over the last 7 days.
*/
const mockData = {
  userName: 'Alex',
  plan: 'standard', // Change to 'premium' to see all stats unlocked
  stats: {
    streak: 7,
    avgWater: '2.1 L',
    avgEnergy: 'Good',
    avgSleep: '7.5 hrs',
    avgMood: 'Positive',
    weightTrend: '-0.5 kg',
    goalAdherence: 85, // in percent
  },
};

const WelcomeHeader = () => {
  const { userName, plan, stats } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  const statItems = [
    { label: "7-Day Streak", value: `${stats.streak} Days`, icon: <Flame />, premium: false },
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets />, premium: false },
    { label: "Avg. Energy", value: stats.avgEnergy, icon: <BatteryFull />, premium: false },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble />, premium: true },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight />, premium: true },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp />, premium: true },
  ];

  return (
    <Card className="border-none bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg animate-fade-in-down overflow-hidden">
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold">Good {timeOfDay}, {userName}</h1>
        <p className="opacity-80 mt-1">Here is your weekly overview.</p>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
              isLocked={stat.premium && plan !== 'premium'}
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
      <div className="relative bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Lock className="text-white/70" />
            <p className="text-xs font-bold">Premium</p>
            <Button size="sm" variant="secondary" className="h-7 text-xs">Upgrade</Button>
        </div>
        <div className="blur-sm select-none">
          <div className="mx-auto w-fit rounded-full bg-white/10 p-2">{icon}</div>
          <p className="mt-2 font-bold text-lg">{value}</p>
          <p className="text-xs opacity-70">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors cursor-pointer">
      <div className="mx-auto w-fit rounded-full bg-white/10 p-2">{icon}</div>
      <p className="mt-2 font-bold text-lg">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
};

export default WelcomeHeader;
