// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowUp, ArrowDown } from 'lucide-react';
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
    { label: "7-Day Streak", value: `${stats.streak} Days`, emoji: '🔥', requiredPlan: 'otp' },
    { label: "Avg. Water", value: stats.avgWater, emoji: '💧', requiredPlan: 'otp' },
    { label: "Avg. Energy", value: stats.avgEnergy, emoji: '⚡️', requiredPlan: 'otp' },
    { label: "Avg. Sleep", value: stats.avgSleep, emoji: '😴', requiredPlan: 'otp' },
    { label: "Avg. Mood", value: stats.avgMood, emoji: '😊', requiredPlan: 'otp' },
    { label: "Weight Trend", value: stats.weightTrend, emoji: '⚖️', requiredPlan: 'premium', trend: 'down' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, emoji: '🎯', requiredPlan: 'premium', trend: 'up' },
  ];

  return (
    <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Your Weekly Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statItems.map((stat) => (
                <StatCard
                key={stat.label}
                {...stat}
                isLocked={planLevels[stat.requiredPlan] > userPlanLevel}
                />
            ))}
        </div>
    </div>
  );
};

const StatCard = ({ emoji, label, value, isLocked, trend }) => {
  const theme = isLocked 
    ? 'bg-slate-100 border-slate-200 text-slate-800'
    : 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 text-emerald-900';
  
  return (
    <Card className={cn("shadow-sm hover:shadow-lg transition-all duration-300 border", theme)}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-1 text-slate-600">
                <span className="text-lg">{emoji}</span>
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
