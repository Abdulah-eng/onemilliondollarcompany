// src/components/customer/progress/FitnessProgression.tsx
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ProgressRing = ({ value }: { value: number }) => (
    <div className="relative h-24 w-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
            <motion.circle
                cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                strokeLinecap="round" pathLength="100" strokeDasharray="100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - value }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{value}%</span>
        </div>
    </div>
);

const PRCard = ({ exercise }: { exercise: ProgressData['fitnessProgression']['exercises'][0] }) => (
    <div className="flex-shrink-0 w-[200px] bg-background/50 dark:bg-white/10 p-4 rounded-xl flex flex-col justify-between">
        <div>
            <p className="font-semibold">{exercise.exerciseName}</p>
            <p className="text-xs text-muted-foreground">Personal Record</p>
        </div>
        <div>
             <div className="flex items-center gap-2 text-primary">
                 <Trophy className="h-5 w-5" />
                 <p className="text-2xl font-bold">{exercise.personalRecord.value}{exercise.personalRecord.unit}</p>
            </div>
            <p className="text-xs text-muted-foreground">on {new Date(exercise.personalRecord.date).toLocaleDateString('en-us', {month: 'short', day: 'numeric'})}</p>
        </div>
    </div>
);

export default function FitnessProgression({ data }: { data: ProgressData['fitnessProgression'] }) {
    return (
        <motion.div 
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div>
                <h4 className="font-semibold mb-2">PR Timeline</h4>
                <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
                    {data.exercises.map(ex => <PRCard key={ex.exerciseName} exercise={ex} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Weekly Volume Trend (kg)</h4>
                     <div className="h-40 w-full">
                         <ResponsiveContainer>
                             <LineChart data={data.weeklyVolume} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                 <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                 <Tooltip />
                                 <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} />
                             </LineChart>
                         </ResponsiveContainer>
                     </div>
                </div>
                 <div className="flex flex-col items-center">
                    <h4 className="font-semibold mb-2">Consistency</h4>
                    <ProgressRing value={data.consistency} />
                 </div>
            </div>
        </motion.div>
    );
}
