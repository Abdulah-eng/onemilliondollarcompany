// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Droplets, BedDouble, Weight, TrendingUp, Lock, HeartPulse, BatteryFull, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes
- `plan`: Fetch from a `subscriptions` table.
- All stat values and trends need to be calculated from `daily_logs` and `activity_logs`.
*/
const mockData = {
  plan: 'standard', // 'otp', 'standard', or 'premium'
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

const QuickStats = () => {
  const { plan, stats } = mockData;
  const planLevels = { otp: 1, standard: 2, premium: 3 };
  const userPlanLevel = planLevels[plan] || 0;

  const statItems = [
    { label: "7-Day Streak", value: `${stats.streak} Days`, icon: <Flame className="text-orange-500" />, requiredPlan: 'otp' },
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets className="text-blue-500" />, requiredPlan: 'otp' },
    { label: "Avg. Energy", value: stats.avgEnergy, icon: <BatteryFull className="text-green-500" />, requiredPlan: 'otp' },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble className="text-indigo-500" />, requiredPlan: 'otp' },
    { label: "Avg. Mood", value: stats.avgMood, icon: <HeartPulse className="text-rose-500" />, requiredPlan: 'otp' },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight className="text-sky-500" />, requiredPlan: 'premium', trend: 'down' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp className="text-purple-500" />, requiredPlan: 'premium', trend: 'up' },
  ];

  return (
    <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Your Weekly Stats</h2>
        <div className="p-1 -m-1">
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

const StatCard = ({ icon, label, value, isLocked, trend }) => (
  <Card className="min-w-[170px] flex-1 bg-slate-100/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-200">
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-slate-500">{icon}</div>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
      </div>
      
      {isLocked ? (
        <div className="flex flex-col items-start gap-1 mt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lock size={12} />
                <span>Premium Feature</span>
            </div>
            <Button size="sm" className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600">Upgrade</Button>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {trend && (
                <div className={cn("flex items-center", trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
                    {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </div>
            )}
        </div>
      )}
    </CardContent>
  </Card>
);

export default QuickStats;
