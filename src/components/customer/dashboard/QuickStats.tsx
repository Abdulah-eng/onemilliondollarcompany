// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, BedDouble, Weight, TrendingUp, Lock, HeartPulse, BatteryFull } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes
- `plan`: Fetch from a `subscriptions` table.
- All stat values and trends need to be calculated from `daily_logs` and `activity_logs`.
*/
const mockData = {
  plan: 'standard', // 'otp', 'standard', or 'premium'
  stats: {
    avgWater: '2.1 L',
    avgEnergy: 'Good',
    avgSleep: '7.5 hrs',
    avgMood: 'Positive',
    weightTrend: '-0.5 kg',
    goalAdherence: 85,
  },
};

const QuickStats = () => {
  const { plan, stats } = mockData;
  const planLevels = { otp: 1, standard: 2, premium: 3 };
  const userPlanLevel = planLevels[plan] || 0;

  const statItems = [
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets size={20} />, requiredPlan: 'otp' },
    { label: "Avg. Energy", value: stats.avgEnergy, icon: <BatteryFull size={20} />, requiredPlan: 'otp' },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble size={20} />, requiredPlan: 'otp' },
    { label: "Avg. Mood", value: stats.avgMood, icon: <HeartPulse size={20} />, requiredPlan: 'otp' },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight size={20} />, requiredPlan: 'premium' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp size={20} />, requiredPlan: 'premium' },
  ];

  return (
    <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Your Weekly Stats</h2>
        <div className="p-1 -m-1">
            <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {statItems.map((stat) => (
                    <StatCard
                    key={stat.label}
                    {...stat}
                    isLocked={planLevels[stat.requiredPlan] > userPlanLevel}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, isLocked }) => (
  <Card className={cn("min-w-[160px] flex-1 bg-slate-50 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-slate-200", isLocked && 'relative')}>
    <CardContent className="p-4">
      <div className={cn(isLocked && 'blur-sm select-none pointer-events-none')}>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-slate-500">{icon}</div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
        </div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10 bg-slate-50/80">
            <Lock size={18} className="text-slate-600" />
            <p className="text-xs font-bold text-slate-700">Premium</p>
            <Button size="sm" className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600">Upgrade</Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default QuickStats;
