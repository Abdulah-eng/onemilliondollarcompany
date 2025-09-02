import { useState, useMemo } from 'react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Brzycki formula for estimating 1-Rep Max
const calculateE1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return weight / (1.0278 - 0.0278 * reps);
};

// Updated ProgressRing to work on a dark, colored background
const ProgressRing = ({ value, color }: { value: number, color: string }) => (
    <div className="relative h-28 w-28">
        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)'}}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <motion.circle
                cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="10"
                strokeLinecap="round" pathLength="100" strokeDasharray="100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - value }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}%</span>
            <span className="text-xs text-white/70 -mt-1">Consistency</span>
        </div>
    </div>
);

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

    const chartData = useMemo(() => {
        return selectedExercise.history.map(session => ({
            date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            e1RM: calculateE1RM(session.weight, session.reps),
        }));
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
                        className={cn('text-sm font-semibold px-3 py-1.5 rounded-full transition-all', selectedExercise.exerciseName === ex.exerciseName ? 'bg-white/90 text-black' : 'bg-white/20 hover:bg-white/30 text-white')}
                    >
                        {ex.exerciseName}
                    </button>
                ))}
            </div>

            {/* --- MIDDLE: PR and Consistency --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedExercise.exerciseName}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <Trophy className="h-12 w-12 text-yellow-300" />
                        <div>
                            <p className="text-white/80 text-lg">Personal Record</p>
                            <p className="text-5xl font-bold tracking-tighter">
                                {selectedExercise.personalRecord.value}
                                <span className="text-3xl font-medium text-white/80 ml-1">{selectedExercise.personalRecord.unit}</span>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <ProgressRing value={data.consistency} color="#fcd34d" />
            </div>
            
            {/* --- BOTTOM: Strength Trend Chart --- */}
            <div>
                 <p className="text-sm font-semibold text-white/80 mb-2">Strength Trend (est. 1-Rep Max)</p>
                 <div className="w-full h-48 -mx-2">
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorFitness" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#fff" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="e1RM" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorFitness)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </motion.div>
    );
}
