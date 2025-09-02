import { useState, useMemo } from 'react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

// Brzycki formula for estimating 1-Rep Max
const calculateE1RM = (weight: number, reps: number) => {
    if (reps < 1) return 0;
    if (reps === 1) return weight;
    return weight / (1.0278 - 0.0278 * reps);
};

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-lg">
        <p className="text-sm font-bold text-foreground">{`~${payload[0].value?.toFixed(0)} kg e-1RM`}</p>
        <p className="text-xs text-white/70">{label}</p>
      </div>
    );
  }
  return null;
};

export default function FitnessProgression({ data }: { data: ProgressData['fitnessProgression'] }) {
    const [selectedExercise, setSelectedExercise] = useState(data.exercises[0]);

    const exerciseData = useMemo(() => {
        const history = selectedExercise.history || [];
        if (history.length === 0) {
            return { chartData: [], highest: 0, lowest: 0 };
        }

        const chartData = history.map(session => ({
            date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            e1RM: calculateE1RM(session.weight, session.reps),
        }));

        const e1RMs = chartData.map(d => d.e1RM);
        const highest = Math.max(...e1RMs);
        const lowest = Math.min(...e1RMs);

        return { chartData, highest, lowest };
    }, [selectedExercise]);

    return (
        <motion.div
            layout
            className="w-full rounded-3xl p-4 sm:p-6 text-white overflow-hidden flex flex-col bg-gradient-to-br from-orange-500 to-red-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* --- TOP: Exercise Selection --- */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                {data.exercises.map(ex => (
                    <button
                        key={ex.exerciseName}
                        onClick={() => setSelectedExercise(ex)}
                        className={cn(
                            'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
                            selectedExercise.exerciseName === ex.exerciseName ? 'bg-white/90 text-black' : 'bg-white/20 hover:bg-white/30 text-white'
                        )}
                    >
                        {ex.exerciseName}
                    </button>
                ))}
            </div>

            {/* --- MIDDLE: Main PR Metric & High/Low Stats --- */}
            <div className="flex items-start justify-between gap-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedExercise.exerciseName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-white/80 text-lg">Personal Record</p>
                        <p className="text-5xl sm:text-6xl font-bold tracking-tighter">
                            {selectedExercise.personalRecord.value}
                            <span className="text-3xl font-medium text-white/80 ml-1">{selectedExercise.personalRecord.unit}</span>
                        </p>
                    </motion.div>
                </AnimatePresence>
                <div className="flex flex-col gap-2 text-right flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <p className="font-bold">{exerciseData.highest.toFixed(0)} kg</p>
                        <ArrowUpCircle className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold">{exerciseData.lowest.toFixed(0)} kg</p>
                        <ArrowDownCircle className="h-5 w-5 text-white/70" />
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: Chart & Consistency Stat --- */}
            <div className="flex-grow w-full h-40 mt-4 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exerciseData.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorFitness" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#fff" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="e1RM" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorFitness)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-semibold text-white/80">Strength Trend (est. 1-Rep Max)</p>
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-yellow-300"/>
                    <p className="font-bold">{data.consistency}% <span className="font-normal text-white/70">Consistency</span></p>
                </div>
            </div>
        </motion.div>
    );
}
