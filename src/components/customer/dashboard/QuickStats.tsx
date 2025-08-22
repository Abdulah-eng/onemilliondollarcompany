// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, BedDouble, HeartPulse, Weight, BrainCircuit, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes for QuickStats
- All values and trends need to be calculated from user's historical data in `daily_logs` and `activity_logs`.
*/
const mockData = {
  streak: 7,
  sleepAvg: 'Good',
  energyTrend: 'up',
  moodAvg: 'Positive',
  weightTrend: 'down',
  mindfulnessMinutes: 15,
};

const QuickStats = () => {
  const { streak, sleepAvg, energyTrend, moodAvg, weightTrend, mindfulnessMinutes } = mockData;

  const stats = [
    { icon: <Flame className="text-orange-400" />, label: "Day Streak", value: `${streak} Days` },
    { icon: <BedDouble className="text-indigo-400" />, label: "Avg. Sleep", value: sleepAvg },
    { icon: <HeartPulse className="text-rose-400" />, label: "Avg. Mood", value: moodAvg },
    { icon: <TrendingUp className="text-emerald-500" />, label: "Energy Trend", value: "Improving", trend: energyTrend },
    { icon: <Weight className="text-sky-500" />, label: "Weight Trend", value: "-0.5 kg", trend: weightTrend },
    { icon: <BrainCircuit className="text-purple-400" />, label: "Mindfulness", value: `${mindfulnessMinutes} min` },
  ];

  return (
    // Add padding to the parent to prevent shadow clipping
    <div className="p-1 -m-1">
      {/* This grid is now responsive: 2 columns on small screens, 3 on medium and up */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
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
);

export default QuickStats;
