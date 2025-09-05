import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';

// Custom Tooltip for the chart, with improved styling
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
                {payload.map((p: any, index: number) => (
                    <p key={index} className="text-xs text-gray-600 dark:text-gray-400" style={{ color: p.color }}>
                        {p.name}: <span className="font-semibold">{Math.round(p.value)} {p.unit}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function WeeklyChartCard({ weeklyData }: { weeklyData: ProgressData['nutrition']['macros'] }) {
    const [activeTab, setActiveTab] = useState('Calories');

    const chartData = useMemo(() => {
        // We only show the last 7 days for the weekly view
        const last7Days = weeklyData.slice(-7);
        return last7Days.map(day => ({
            name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            Calories: Math.round((day.protein * 4) + (day.carbs * 4) + (day.fat * 9)),
            Protein: day.protein,
            Carbs: day.carbs,
            Fat: day.fat,
        }));
    }, [weeklyData]);

    const renderChart = () => {
        if (activeTab === 'Calories') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Calories" fill="#8884d8" radius={[10, 10, 0, 0]} unit="Kcal" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="Protein" stroke="#10b981" unit="g" />
                        <Line type="monotone" dataKey="Carbs" stroke="#f59e0b" unit="g" />
                        <Line type="monotone" dataKey="Fat" stroke="#ef4444" unit="g" />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
    };

    const totalKcal = chartData.reduce((sum, day) => sum + day.Calories, 0);
    const averageKcal = Math.round(totalKcal / chartData.length);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="space-y-1 mb-4 sm:mb-0">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Weekly Analytics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average: <span className="font-semibold">{averageKcal} Kcal</span></p>
                </div>
                <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                    <button
                        className={cn("px-4 py-1 rounded-full transition-colors", { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeTab === 'Calories' })}
                        onClick={() => setActiveTab('Calories')}
                    >
                        Calories
                    </button>
                    <button
                        className={cn("px-4 py-1 rounded-full transition-colors", { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeTab === 'Macros' })}
                        onClick={() => setActiveTab('Macros')}
                    >
                        Macros
                    </button>
                </div>
            </div>
            <div className="h-64">
                {renderChart()}
            </div>
        </div>
    );
}
