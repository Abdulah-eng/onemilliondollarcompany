// src/components/customer/progress/HeroProgressSnapshot.tsx
import { useState } from 'react';
import { DailyCheckin, UserGoal } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Flame, Moon, Zap, Target, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

// A new, more prominent stat card with responsive sizing
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
    <div className="bg-background/50 dark:bg-white/5 p-3 sm:p-4 rounded-xl border border-border/50 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">{label}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
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
            <ResponsiveContainer width="100%" height="100%">
                {/* FIXED: margin left changed from -20 to 0 to prevent cutoff */}
                <LineChart data={last7DaysCheckins} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="shortDate" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}/>
                    <Line type="monotone" dataKey="sleepHours" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
    
    if (goal.type === 'BUILD_MUSCLE') {
         const data = [
            { name: 'Protein (g)', value: avgProtein, target: goal.targetValue },
            { name: 'Carbs (g)', value: avgCarbs },
        ];
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide/>
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
    
    return <p className="text-center text-muted-foreground">Goal type not supported yet.</p>;
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
    // --- NEW: State to manage the currently selected goal ---
    const [selectedGoal, setSelectedGoal] = useState<UserGoal | undefined>(goals?.[0]);

    if (!goals || goals.length === 0) {
        return <div>Set a goal to see your progress!</div>;
    }

    return (
        <motion.div
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left Side: Key Stats (more compact on mobile) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard icon={<Flame className="h-5 w-5" />} label="Workout Streak" value={`${streak} days`} color="bg-orange-500/20 text-orange-400" />
                <StatCard icon={<Moon className="h-5 w-5" />} label="Avg Sleep (7d)" value={`${avgSleep.toFixed(1)}h`} color="bg-purple-500/20 text-purple-400" />
                <StatCard icon={<Zap className="h-5 w-5" />} label="Avg Energy (7d)" value={`${avgEnergy.toFixed(1)}/5`} color="bg-yellow-500/20 text-yellow-400" />
                <StatCard icon={<Activity className="h-5 w-5" />} label="Kcal Burned (7d)" value={kcalBurned.toLocaleString()} color="bg-rose-500/20 text-rose-400" />
            </div>

            {/* Right Side: Goal Progression */}
            <div className="bg-background/50 dark:bg-white/5 p-4 rounded-xl border border-border/50 flex flex-col">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-primary/20 text-primary">
                         <Target className="h-5 w-5" />
                    </div>
                    <p className="font-semibold">Goal Progression</p>
                </div>
                
                {/* --- NEW: Goal selection tabs --- */}
                <div className="flex items-center gap-2 my-3 border-b border-border/50 pb-3">
                    {goals.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal)}
                            className={cn(
                                "text-xs font-semibold px-3 py-1.5 rounded-md transition-colors",
                                selectedGoal?.id === goal.id 
                                ? "bg-primary text-primary-foreground" 
                                : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {goal.title}
                        </button>
                    ))}
                </div>

                <div className="flex-grow min-h-[120px]">
                   {selectedGoal && <GoalChart goal={selectedGoal} dailyCheckins={dailyCheckins} avgProtein={avgProtein} avgCarbs={avgCarbs} />}
                </div>
            </div>
        </motion.div>
    );
}
