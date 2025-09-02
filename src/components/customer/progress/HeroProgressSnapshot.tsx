import { useState, useMemo, useCallback } from 'react';
import { DailyCheckin, UserGoal } from '@/mockdata/progress/mockProgressData';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Flame, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type TimeRange = 7 | 30 | 90;
const timeRanges: TimeRange[] = [7, 30, 90];

// --- Mini Stat Card ---
const MiniStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="font-bold text-lg">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border/50 shadow">
        <p className="text-sm font-bold text-foreground">
          {`${payload[0].value?.toFixed(1)} ${payload[0].unit || ''}`}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }
  return null;
};

export default function HeroProgressSnapshot({
  streak,
  goals,
  dailyCheckins,
  nutrition,
  kcalBurned,
  avgEnergy,
  avgSleep,
}: {
  streak: number;
  goals: UserGoal[];
  dailyCheckins: DailyCheckin[];
  nutrition: { macros: { date: string; protein: number; carbs: number; fat: number }[] };
  kcalBurned: number;
  avgEnergy: number;
  avgSleep: number;
}) {
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | undefined>(goals?.[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  const chartData = useMemo(() => {
    if (!selectedGoal) return [];
    const dataKey = selectedGoal.type === 'IMPROVE_SLEEP' ? 'sleepHours' : 'protein';
    const sourceData = selectedGoal.type === 'IMPROVE_SLEEP' ? dailyCheckins : nutrition.macros;

    return sourceData.slice(-timeRange).map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: d[dataKey as keyof typeof d] as number,
    }));
  }, [selectedGoal, timeRange, dailyCheckins, nutrition.macros]);

  const mainMetric = useMemo(() => {
    if (!chartData.length) return { value: 'N/A', unit: '' };
    const avg = chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;
    return { value: avg.toFixed(1), unit: selectedGoal?.targetUnit || '' };
  }, [chartData, selectedGoal]);

  const handleSelectGoal = useCallback((goal: UserGoal) => setSelectedGoal(goal), []);
  const handleRangeChange = useCallback((range: TimeRange) => setTimeRange(range), []);

  const goalColors = {
    IMPROVE_SLEEP: 'from-purple-500 to-indigo-500',
    BUILD_MUSCLE: 'from-orange-500 to-red-500',
  } as const;
  const goalStrokeColor = {
    IMPROVE_SLEEP: '#a855f7',
    BUILD_MUSCLE: '#f97316',
  } as const;

  if (!selectedGoal) return null;

  return (
    <motion.div
      layout
      className={cn(
        'w-full rounded-3xl p-4 sm:p-6 text-white flex flex-col',
        'transition-colors duration-300',
        goalColors[selectedGoal.type as keyof typeof goalColors]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* --- TOP SECTION: Goal Selector --- */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {goals.map(goal => (
          <button
            key={goal.id}
            onClick={() => handleSelectGoal(goal)}
            className={cn(
              'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
              selectedGoal?.id === goal.id
                ? 'bg-white/90 text-black'
                : 'bg-white/20 hover:bg-white/30 text-white'
            )}
          >
            {goal.title}
          </button>
        ))}
      </div>

      {/* --- METRIC + CHART --- */}
      <div className="flex-grow flex flex-col">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl sm:text-6xl font-bold tracking-tighter">{mainMetric.value}</span>
          <span className="text-xl font-medium text-white/80">{mainMetric.unit}</span>
        </div>
        <p className="text-sm text-white/70">Average over last {timeRange} days</p>

        <div className="flex-grow w-full h-44 sm:h-56 mt-3 -mx-2">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color${selectedGoal.type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#fff" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="value"
                unit={selectedGoal.targetUnit}
                stroke={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#color${selectedGoal.type})`}
                isAnimationActive={false} // 🚀 Disables laggy animations
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- TIME RANGE + MINI STATS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/20">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full',
                timeRange === range ? 'bg-white/90 text-black' : 'text-white/70 hover:bg-white/10'
              )}
            >
              {range}D
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <MiniStat icon={<Flame className="h-6 w-6 text-orange-300" />} value={`${streak}`} label="Streak" />
          <MiniStat icon={<Zap className="h-6 w-6 text-yellow-300" />} value={`${avgEnergy.toFixed(1)}/5`} label="Energy" />
          <MiniStat icon={<Activity className="h-6 w-6 text-rose-300" />} value={`${kcalBurned.toLocaleString()}`} label="Kcal" />
        </div>
      </div>
    </motion.div>
  );
}
