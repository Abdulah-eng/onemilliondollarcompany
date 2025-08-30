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
    { label: "Avg. Water", value: stats.avgWater, emoji: '💧', requiredPlan: 'otp', color: 'blue' },
    { label: "Avg. Energy", value: stats.avgEnergy, emoji: '⚡️', requiredPlan: 'otp', color: 'green' },
    { label: "Avg. Sleep", value: stats.avgSleep, emoji: '😴', requiredPlan: 'otp', color: 'indigo' },
    { label: "Avg. Mood", value: stats.avgMood, emoji: '😊', requiredPlan: 'otp', color: 'rose' },
    { label: "Weight Trend", value: stats.weightTrend, emoji: '⚖️', requiredPlan: 'premium', trend: 'down', color: 'sky' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, emoji: '🎯', requiredPlan: 'premium', trend: 'up', color: 'purple' },
  ];

  return (
    <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Weekly Stats</h2>
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

// Updated themes to be fully responsive for both light and dark modes
const statCardThemes = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-700/80 dark:text-blue-200',
    green: 'from-emerald-50 to-green-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-700/80 dark:text-emerald-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900 dark:bg-indigo-900/30 dark:border-indigo-700/80 dark:text-indigo-200',
    rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-700/80 dark:text-rose-200',
    sky: 'from-sky-50 to-sky-100 border-sky-200 text-sky-900 dark:bg-sky-900/30 dark:border-sky-700/80 dark:text-sky-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900 dark:bg-purple-900/30 dark:border-purple-700/80 dark:text-purple-200',
};

interface StatCardProps {
  emoji: string;
  label: string;
  value: string;
  isLocked: boolean;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ emoji, label, value, isLocked, trend, color }) => {
  const theme = statCardThemes[color];

  if (isLocked) {
    return (
      <Card className="min-w-[160px] flex-1 shadow-sm border bg-slate-100/80 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700">
        <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center gap-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-lg filter grayscale">{emoji}</span>
            <p className="text-xs font-semibold">{label}</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Lock size={12} />
              <span>Premium Feature</span>
            </div>
            <Button size="sm" className="h-7 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-full">Upgrade</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("min-w-[160px] flex-1 shadow-sm hover:shadow-lg transition-all duration-300 border bg-gradient-to-br dark:bg-none", theme)}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{emoji}</span>
                <p className="text-xs font-semibold">{label}</p>
            </div>
            
            <div className="flex items-baseline gap-1.5 mt-2">
                <p className="text-2xl font-bold dark:text-white">{value}</p>
                {trend && (
                    <div className={cn("flex items-center font-bold text-xs", trend === 'up' ? 'text-emerald-500' : 'text-rose-500')}>
                        {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
};

export default QuickStats;
