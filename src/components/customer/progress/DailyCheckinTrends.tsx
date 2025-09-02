// src/components/customer/progress/DailyCheckinTrends.tsx
import { DailyCheckin } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Droplets, Moon, Zap, Smile, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const TrendArrow = ({ change }: { change: number }) => {
    if (change === 0) return null;
    const isUp = change > 0;
    return (
        <div className={`flex items-center text-xs ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
    );
};

const MiniChart = ({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) => (
    <div className="w-20 h-8">
        <ResponsiveContainer>
            <LineChart data={data}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const MetricRow = ({ icon, title, value, unit, trend, data, dataKey, color }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    unit: string;
    trend: number;
    data: any[];
    dataKey: string;
    color: string;
}) => (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-${color}-500/20 text-${color}-500`}>{icon}</div>
            <div>
                <p className="font-semibold">{title}</p>
                <div className="flex items-baseline gap-1">
                     <span className="text-lg font-bold">{value}</span>
                     <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <TrendArrow change={trend} />
            <MiniChart data={data} dataKey={dataKey} color={`hsl(var(--${color}))`} />
        </div>
    </div>
);


export default function DailyCheckinTrends({ checkins }: { checkins: DailyCheckin[] }) {
    const last7Days = checkins.slice(-7);
    const avg = (key: keyof DailyCheckin) => last7Days.reduce((acc, curr) => acc + (curr[key] as number), 0) / last7Days.length;
    
    const avgWater = avg('waterLiters');
    const avgSleep = avg('sleepHours');
    const avgEnergy = avg('energyLevel');
    const avgMood = last7Days.reduce((acc, curr) => acc + (curr.mood === 'great' ? 4 : curr.mood === 'good' ? 3 : curr.mood === 'okay' ? 2 : 1), 0) / last7Days.length;

    const calculateTrend = (data: number[]) => {
        if (data.length < 2) return 0;
        const latest = data[data.length-1];
        const previous = data[data.length-2];
        return ((latest - previous) / previous) * 100;
    }
    
    return (
        <motion.div 
            className="bg-card dark:bg-[#0d1218] p-3 rounded-2xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <MetricRow icon={<Droplets className="h-5 w-5" />} title="Water Intake" value={avgWater.toFixed(1)} unit="L" trend={calculateTrend(last7Days.map(c => c.waterLiters))} data={last7Days} dataKey="waterLiters" color="blue" />
            <MetricRow icon={<Moon className="h-5 w-5" />} title="Sleep" value={avgSleep.toFixed(1)} unit="hrs" trend={calculateTrend(last7Days.map(c => c.sleepHours))} data={last7Days} dataKey="sleepHours" color="purple" />
            <MetricRow icon={<Zap className="h-5 w-5" />} title="Energy" value={avgEnergy.toFixed(1)} unit="/ 5" trend={calculateTrend(last7Days.map(c => c.energyLevel))} data={last7Days} dataKey="energyLevel" color="yellow" />
            <MetricRow icon={<Smile className="h-5 w-5" />} title="Mood" value={avgMood.toFixed(1)} unit="/ 4" trend={0} data={last7Days.map(c => ({...c, moodScore: c.mood === 'great' ? 4 : c.mood === 'good' ? 3 : c.mood === 'okay' ? 2 : 1}))} dataKey="moodScore" color="green" />
        </motion.div>
    );
}
