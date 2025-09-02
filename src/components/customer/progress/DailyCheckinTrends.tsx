// src/components/customer/progress/DailyCheckinTrends.tsx
import { DailyCheckin } from '@/mockdata/progress/mockProgressData';
import CheckinTrendCard from './CheckinTrendCard'; // We will create this component next
import { Droplets, Moon, Zap, Smile } from 'lucide-react';

interface DailyCheckinTrendsProps {
    checkins: DailyCheckin[];
    onCardClick: (title: string, content: React.ReactNode) => void;
}

export default function DailyCheckinTrends({ checkins, onCardClick }: DailyCheckinTrendsProps) {
    const last7Days = checkins.slice(-7);
    const avg = (key: keyof DailyCheckin) => last7Days.reduce((acc, curr) => acc + (curr[key] as number), 0) / last7Days.length;
    
    const trendData = [
        {
            title: "Water Intake",
            icon: "💧",
            value: `${avg('waterLiters').toFixed(1)} L`,
            data: last7Days,
            dataKey: "waterLiters",
            color: "blue",
            gradient: "from-blue-400 to-blue-600",
            insight: "Hydration is key for energy and muscle recovery. Keep it up!",
        },
        {
            title: "Sleep",
            icon: "😴",
            value: `${avg('sleepHours').toFixed(1)} hrs`,
            data: last7Days,
            dataKey: "sleepHours",
            color: "purple",
            gradient: "from-purple-400 to-purple-600",
            insight: "Quality sleep is when your body repairs itself. Aim for 7-9 hours.",
        },
        {
            title: "Energy",
            icon: "⚡️",
            value: `${avg('energyLevel').toFixed(1)} / 5`,
            data: last7Days,
            dataKey: "energyLevel",
            color: "yellow",
            gradient: "from-yellow-400 to-yellow-600",
            insight: "Your energy levels are directly linked to sleep and nutrition.",
        },
        {
            title: "Mood",
            icon: "😊",
            value: "Good", // This is simplified, a real app would calculate this
            data: last7Days.map(c => ({...c, moodScore: c.mood === 'great' ? 4 : c.mood === 'good' ? 3 : c.mood === 'okay' ? 2 : 1})),
            dataKey: "moodScore",
            color: "emerald",
            gradient: "from-emerald-400 to-emerald-600",
            insight: "Consistent workouts are a great way to boost your mood.",
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">Daily Check-in Trends</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                {trendData.map((trend) => (
                    <CheckinTrendCard 
                        key={trend.title}
                        {...trend}
                        onClick={() => onCardClick(trend.title, <p>{trend.insight}</p>)}
                    />
                ))}
            </div>
        </div>
    );
}
