// src/components/customer/progress/HeroProgressSnapshot.tsx
import { DailyCheckin, UserGoal } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Flame, Moon, Zap, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// A new, more prominent stat card
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
    <div className="bg-background/50 dark:bg-white/5 p-4 rounded-xl border border-border/50 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

// Component for the dynamic goal chart
const GoalChart = ({ goal, dailyCheckins, avgProtein, avgCarbs }: { 
    goal: UserGoal, 
    dailyCheckins: DailyCheckin[], 
    avgProtein: number, 
    avgCarbs: number 
}) => {
    const last7DaysCheckins = dailyCheckins.slice(-7).map(d => ({
        ...d,
        shortDate: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
    }));

    if (goal.type === 'IMPROVE_SLEEP') {
        return (
            <div className="h-full w-full">
                <ResponsiveContainer>
                    <LineChart data={last7DaysCheckins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="shortDate" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}/>
                        <Line type="monotone" dataKey="sleepHours" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
    
    if (goal.type === 'BUILD_MUSCLE') {
         const data = [
            { name: 'Protein', value: avgProtein, target: goal.targetValue },
            { name: 'Carbs', value: avgCarbs },
        ];
        return (
             <div className="h-full w-full">
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide/>
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}/>
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
    
    return <p>Goal type not supported yet.</p>;
};

export default function HeroProgressSnapshot({
    streak,
    avgSleep,
    avgEnergy,
    kcalBurned,
    goals,
    dailyCheckins,
    avgProtein,
    avgCarbs,
}: {
    streak: number;
    avgSleep: number;
    avgEnergy: number;
    kcalBurned: number;
    goals: UserGoal[];
    dailyCheckins: DailyCheckin[];
    avgProtein: number;
    avgCarbs: number;
}) {
    const primaryGoal = goals[0]; // Assume the first goal is the primary one

    return (
        <motion.div
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left Side: Key Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Flame className="h-5 w-5" />} label="Workout Streak" value={`${streak} days`} color="bg-orange-500/20 text-orange-400" />
                <StatCard icon={<Moon className="h-5 w-5" />} label="Avg Sleep (7d)" value={`${avgSleep.toFixed(1)}h`} color="bg-purple-500/20 text-purple-400" />
                <StatCard icon={<Zap className="h-5 w-5" />} label="Avg Energy (7d)" value={`${avgEnergy.toFixed(1)}/5`} color="bg-yellow-500/20 text-yellow-400" />
                <StatCard icon={<Activity className="h-5 w-5" />} label="Kcal Burned (7d)" value={kcalBurned.toLocaleString()} color="bg-rose-500/20 text-rose-400" />
            </div>

            {/* Right Side: Goal Progression */}
            {primaryGoal && (
                <div className="bg-background/50 dark:bg-white/5 p-4 rounded-xl border border-border/50 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-primary/20 text-primary">
                             <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold">{primaryGoal.title}</p>
                            <p className="text-xs text-muted-foreground">Progress towards your primary goal</p>
                        </div>
                    </div>
                    <div className="flex-grow min-h-[120px]">
                       <GoalChart goal={primaryGoal} dailyCheckins={dailyCheckins} avgProtein={avgProtein} avgCarbs={avgCarbs} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
