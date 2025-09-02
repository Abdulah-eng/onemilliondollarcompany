// src/components/customer/progress/HeroProgressSnapshot.tsx
import { WeightEntry } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, Flame, Moon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StatChip = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-2 rounded-full bg-background/50 dark:bg-white/10 px-3 py-1.5 text-sm">
        {icon}
        <span className="font-semibold">{label}</span>
        <span className="text-muted-foreground">{value}</span>
    </div>
);

export default function HeroProgressSnapshot({
    weightEntries,
    streak,
    avgSleep,
    avgEnergy
}: {
    weightEntries: WeightEntry[];
    streak: number;
    avgSleep: number;
    avgEnergy: number;
}) {
    if (weightEntries.length < 2) return <div>Not enough data.</div>;

    const latestWeight = weightEntries[weightEntries.length - 1].weight;
    const startWeight = weightEntries[0].weight;
    const change = latestWeight - startWeight;
    const isDecreasing = change < 0;

    return (
        <motion.div 
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">Weight Trend</p>
                    <p className="text-3xl font-bold">{latestWeight.toFixed(1)} kg</p>
                    <div className={`flex items-center text-sm font-semibold ${isDecreasing ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isDecreasing ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        <span>{Math.abs(change).toFixed(1)} kg from start</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <StatChip icon={<Flame className="h-4 w-4 text-orange-500" />} label="Streak" value={`${streak} days`} />
                    <StatChip icon={<Moon className="h-4 w-4 text-purple-500" />} label="Avg Sleep" value={`${avgSleep.toFixed(1)}h`} />
                    <StatChip icon={<Zap className="h-4 w-4 text-yellow-500" />} label="Avg Energy" value={`${avgEnergy.toFixed(1)}/5`} />
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer>
                    <LineChart data={weightEntries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.5rem",
                            }}
                        />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
