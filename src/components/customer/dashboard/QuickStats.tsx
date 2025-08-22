// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, BedDouble, HeartPulse, Weight, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes for QuickStats
- All values and trends need to be calculated from user's historical data in `daily_logs` and `activity_logs`.
- `streak`: Consective days with a completed workout.
- `sleepAvg`: Average sleep rating for the last 7 days.
- `energyTrend`: Compare the last 3 days' average energy to the previous 3 days.
- `moodAvg`: Average mood rating for the last 7 days.
- `weightTrend`: Compare the latest weight entry to the one from 7 days ago.
*/
const mockData = {
  streak: 7,
  sleepAvg: 'Good',
  energyTrend: 'up',
  moodAvg: 'Positive',
  weightTrend: 'down',
};

const QuickStats = () => {
  const { streak, sleepAvg, energyTrend, moodAvg, weightTrend } = mockData;

  const stats = [
    { icon: <Flame className="text-orange-400" />, label: "Day Streak", value: `${streak} Days` },
    { icon: <BedDouble className="text-indigo-400" />, label: "Avg. Sleep", value: sleepAvg },
    { icon: <HeartPulse className="text-rose-400" />, label: "Avg. Mood", value: moodAvg },
    { icon: <TrendingUp className="text-emerald-500" />, label: "Energy Trend", value: "Improving", trend: energyTrend },
    { icon: <Weight className="text-sky-500" />, label: "Weight Trend", value: "-0.5 kg", trend: weightTrend },
  ];

  return (
    // FIX: Add padding to the parent to prevent shadow clipping on the scrolling container
    <div className="p-1 -m-1">
      {/* On mobile, this is a horizontal scroll container. On desktop, it's a grid. */}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  // Each card has a minimum width for scrolling, but is flexible for the grid
  <div className="min-w-[180px] md:min-w-0 flex-1">
    <Card className="bg-slate-50 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-slate-200/50 p-2 rounded-lg">
            {icon}
          </div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
        </div>
        <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-slate-800">{value}</p>
            {trend && (
                <div className={cn(
                    "flex items-center text-xs font-bold",
                    trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                )}>
                    {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default QuickStats;
