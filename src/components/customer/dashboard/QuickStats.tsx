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
    { label: "7-Day Streak", value: `${stats.streak} Days`, icon: <Flame />, requiredPlan: 'otp', color: 'orange' },
    { label: "Avg. Water", value: stats.avgWater, icon: <Droplets />, requiredPlan: 'otp', color: 'blue' },
    { label: "Avg. Energy", value: stats.avgEnergy, icon: <BatteryFull />, requiredPlan: 'otp', color: 'green' },
    { label: "Avg. Sleep", value: stats.avgSleep, icon: <BedDouble />, requiredPlan: 'otp', color: 'indigo' },
    { label: "Avg. Mood", value: stats.avgMood, icon: <HeartPulse />, requiredPlan: 'otp', color: 'rose' },
    { label: "Weight Trend", value: stats.weightTrend, icon: <Weight />, requiredPlan: 'premium', trend: 'down', color: 'sky' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, icon: <TrendingUp />, requiredPlan: 'premium', trend: 'up', color: 'purple' },
  ];

  return (
    <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Your Weekly Stats</h2>
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

const statCardThemes = {
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-900',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    green: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900',
    rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-900',
    sky: 'from-sky-50 to-sky-100 border-sky-200 text-sky-900',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
    locked: 'bg-slate-100 border-slate-200 text-slate-800',
};

const StatCard = ({ icon, label, value, isLocked, trend, color }) => {
  const theme = isLocked ? statCardThemes.locked : statCardThemes[color];
  
  return (
    <Card className={cn("min-w-[160px] flex-1 shadow-sm hover:shadow-lg transition-all duration-300 border bg-gradient-to-br", theme)}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-1 text-slate-600">
                {icon}
                <p className="text-xs font-semibold">{label}</p>
            </div>
            
            {isLocked ? (
                <div className="flex flex-col items-start gap-1 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Lock size={12} />
                        <span>Premium</span>
                    </div>
                    <Button size="sm" className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600">Upgrade</Button>
                </div>
            ) : (
                <div className="flex items-baseline gap-1.5 mt-2">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    {trend && (
                        <div className={cn("flex items-center font-bold text-xs", trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
                            {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        </div>
                    )}
                </div>
            )}
        </CardContent>
    </Card>
  );
};

export default QuickStats;
