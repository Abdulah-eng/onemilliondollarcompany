// src/components/customer/dashboard/WelcomeHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Droplets, BedDouble, Weight, TrendingUp, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes for WelcomeHeader
- `userName`: Fetch from `profiles.full_name`.
- `plan`: Fetch from a `subscriptions` table.
- All stat values and trends need to be calculated from `daily_logs` and `activity_logs`.
*/
const mockData = {
  userName: 'Alex',
  plan: 'standard', // 'standard' or 'premium'
  stats: {
    streak: 7,
    avgWater: '2.1 L',
    avgSleep: '7.5 hrs',
    weightTrend: '-0.5 kg',
    goalAdherence: 85,
  },
};

const WelcomeHeader = () => {
  const { userName, plan, stats } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  const statItems = [
    { label: "7-Day Streak", value: `${stats.streak} Days`, icon: <Flame size={18} />, premium: false },
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets size={18} />, premium: false },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble size={18} />, premium: true },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight size={18} />, premium: true },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp size={18} />, premium: true },
  ];

  return (
    <Card className="border-none bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg animate-fade-in-down overflow-hidden">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">Good {timeOfDay}, {userName}</h1>
        <p className="opacity-80 mt-1 text-sm">Here is your weekly overview.</p>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
