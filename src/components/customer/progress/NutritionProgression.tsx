// src/components/customer/progress/NutritionProgression.tsx
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const ProgressRing = ({ value, label }: { value: number, label: string }) => (
    <div className="relative h-28 w-28">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold">{value}%</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    </div>
);

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const avgMacros = data.macros.reduce((acc, curr) => ({
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbs,
        fat: acc.fat + curr.fat,
    }), { protein: 0, carbs: 0, fat: 0 });

    const totalDays = data.macros.length;
    const chartData = [
        { name: 'Protein', value: Math.round(avgMacros.protein / totalDays), fill: '#34d399' },
        { name: 'Carbs', value: Math.round(avgMacros.carbs / totalDays), fill: '#fbbf24' },
        { name: 'Fat', value: Math.round(avgMacros.fat / totalDays), fill: '#f87171' },
    ];

    return (
        <motion.div 
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Average Macros (g)</h4>
                    <div className="h-48 w-full">
                        <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <ProgressRing value={data.mealCompletion} label="Meal Completion" />
                     <div className="text-center">
                        <p className="text-2xl font-bold">{data.outsideMeals}</p>
                        <p className="text-xs text-muted-foreground">Outside Meals Logged (7d)</p>
                     </div>
                </div>
            </div>
        </motion.div>
    );
}
