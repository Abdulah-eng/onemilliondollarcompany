import { useState, useMemo } from 'react';
import { DailyCheckin, UserGoal } from '@/mockdata/progress/mockProgressData';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Flame, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TimeRange = 7 | 30 | 90;
const timeRanges: TimeRange[] = [7, 30, 90];

// UPDATED: Added a color prop to make the value vibrant
const MiniStat = ({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className={cn("font-bold text-lg", color)}>{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  </div>
);

// UPDATED: Improved text contrast for dark backgrounds
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-lg">
        <p className="text-sm font-bold text-foreground">
          {`${payload[0].value?.toFixed(1)} ${payload[0].unit || ''}`}
        </p>
        <p className="text-xs text-white/70">{label}</p>
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
}: {
  streak: number;
  goals: UserGoal[];
  dailyCheckins: DailyCheckin[];
  nutrition: { macros: { date: string; protein: number; carbs: number; fat: number }[] };
  kcalBurned: number;
  avgEnergy: number;
}) {
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | undefined>(goals?.[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  // UPDATED: Added green color scheme for nutrition
  const goalColors = {
    IMPROVE_SLEEP: 'from-purple-500 to-indigo-500',    // Purple for mental health
    BUILD_MUSCLE: 'from-orange-500 to-red-500',       // Orange for fitness
    IMPROVE_NUTRITION: 'from-emerald-500 to-green-500', // Green for nutrition
  };
  const goalStrokeColor = {
    IMPROVE_SLEEP: '#a855f7',
    BUILD_MUSCLE: '#f97316',
    IMPROVE_NUTRITION: '#10b981',
  };

  const chartData = useMemo(() => {
    if (!selectedGoal) return [];
    
    // UPDATED: Logic to handle different data keys for each goal type
    const dataKeyMap = {
      IMPROVE_SLEEP: 'sleepHours',
      BUILD_MUSCLE: 'protein',
      IMPROVE_NUTRITION: 'protein', // Nutrition goal will also track protein for this example
    };
    const dataKey = dataKeyMap[selectedGoal.type as keyof typeof dataKeyMap];
    
    const sourceDataMap = {
      IMPROVE_SLEEP: dailyCheckins,
      BUILD_MUSCLE: nutrition.macros,
      IMPROVE_NUTRITION: nutrition.macros,
    };
    const sourceData = sourceDataMap[selectedGoal.type as keyof typeof sourceDataMap];

    return sourceData.slice(-timeRange).map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: d[dataKey as keyof typeof d] as number,
    }));
  }, [selectedGoal, timeRange, dailyCheckins, nutrition.macros]);

  const mainMetric = useMemo(() => {
    if (!chartData || chartData.length === 0) return { value: 'N/A', unit: '' };
    const avg = chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;
    return { value: avg.toFixed(1), unit: selectedGoal?.targetUnit || '' };
  }, [chartData, selectedGoal]);

  if (!selectedGoal) return null;

  return (
    <motion.div
      layout
      className={cn(
        'w-full rounded-3xl p-4 sm:p-6 text-white overflow-hidden flex flex-col transition-colors duration-500',
        goalColors[selectedGoal.type as keyof typeof goalColors]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- Goal Selection --- */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {goals.map(goal => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal)}
            className={cn(
              'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
              selectedGoal?.id === goal.id ? 'bg-white/90 text-black' : 'bg-white/20 hover:bg-white/30 text-white'
            )}
          >
            {goal.title}
          </button>
        ))}
      </div>

      {/* --- Main Metric & Chart --- */}
      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-5xl sm:text-6xl font-bold tracking-tighter">{mainMetric.value}</span>
            <span className="text-xl font-medium text-white/80">{mainMetric.unit}</span>
          </motion.div>
        </AnimatePresence>
        <p className="text-sm text-white/70">Average over last {timeRange} days</p>

        <div className="flex-grow w-full h-48 sm:h-56 mt-4 -mx-2">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${selectedGoal.type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#fff" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="value" unit={selectedGoal.targetUnit} stroke={goalStrokeColor[selectedGoal.type as keyof typeof goalStrokeColor]} strokeWidth={3} fillOpacity={1} fill={`url(#color${selectedGoal.type})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Time Range & Mini Stats --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/20">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn('px-3 py-1 text-xs font-semibold rounded-full', timeRange === range ? 'bg-white/90 text-black' : 'text-white/70 hover:bg-white/10')}
            >
              {range}D
            </button>
          ))}
        </div>
        {/* UPDATED: Passing color prop to MiniStat for vibrant values */}
        <div className="flex items-center gap-4 sm:gap-6">
          <MiniStat icon={<Flame className="h-6 w-6 text-orange-300" />} value={`${streak}`} label="Streak" color="text-orange-300" />
          <MiniStat icon={<Zap className="h-6 w-6 text-yellow-300" />} value={`${avgEnergy.toFixed(1)}/5`} label="Energy" color="text-yellow-300" />
          <MiniStat icon={<Activity className="h-6 w-6 text-rose-300" />} value={`${kcalBurned.toLocaleString()}`} label="Kcal" color="text-rose-300" />
        </div>
      </div>
    </motion.div>
  );
}
