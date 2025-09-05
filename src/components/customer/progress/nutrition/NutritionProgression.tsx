import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Custom Tooltip for the charts, styled to match the theme
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
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

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeChart, setActiveChart] = useState('calories');

    // Sort data by date and get the last 7 days for the weekly chart
    const sortedWeeklyData = useMemo(() => {
        const sorted = [...data.macros].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.slice(-7);
    }, [data.macros]);

    // Get today's data (the last entry in the sorted array)
    const todayData = sortedWeeklyData[sortedWeeklyData.length - 1];
    
    // Calculate total calories consumed today
    const totalCaloriesConsumed = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    
    // Calculate remaining calories and macros
    const caloriesLeft = Math.max(data.recommended.kcal - totalCaloriesConsumed, 0);
    const proteinLeft = Math.max(data.recommended.protein - todayData.protein, 0);
    const carbsLeft = Math.max(data.recommended.carbs - todayData.carbs, 0);
    const fatLeft = Math.max(data.recommended.fat - todayData.fat, 0);

    // Get goal-oriented guidance
    const getGuidance = useMemo(() => {
        const proteinPercentage = (todayData.protein / data.recommended.protein) * 100;
        const carbsPercentage = (todayData.carbs / data.recommended.carbs) * 100;
        const fatPercentage = (todayData.fat / data.recommended.fat) * 100;

        if (proteinPercentage < 70) {
            return { title: "Boost Your Protein!", message: "You're a bit low on protein today. Try adding a lean protein source like chicken or fish to hit your target.", icon: "💪" };
        }
        if (carbsPercentage < 70) {
            return { title: "Need More Energy?", message: "Your carb intake is low. Carbs fuel your workouts! Consider adding whole grains, fruits, or starchy vegetables.", icon: "🏃" };
        }
        if (fatPercentage < 70) {
            return { title: "Healthy Fats are Key!", message: "Your fat intake is below target. Healthy fats from nuts, seeds, or avocado are crucial for hormone balance.", icon: "🥑" };
        }
        return { title: "Excellent Work Today!", message: "You're on track to hit your nutrition goals. Your balanced intake is helping you build a healthier you. Keep it up!", icon: "✅" };
    }, [todayData, data.recommended]);

    // Memoize chart data for performance
    const chartData = useMemo(() => {
        return sortedWeeklyData.map(day => ({
            name: format(new Date(day.date), 'EEE'),
            Calories: Math.round(day.protein * 4 + day.carbs * 4 + day.fat * 9),
            Protein: day.protein,
            Carbs: day.carbs,
            Fat: day.fat,
        }));
    }, [sortedWeeklyData]);

    const renderChart = () => {
        if (activeChart === 'calories') {
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

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col gap-6 transition-colors duration-500 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nutrition Overview</h3>
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span role="img" aria-label="fire" className="text-3xl">🔥</span>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{caloriesLeft}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Calories Left</p>
                    </div>
                </motion.div>
            </div>

            {/* Daily Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 transition-transform hover:scale-105"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <span role="img" aria-label="fire" className="text-2xl">🔥</span>
                    <p className="font-bold text-lg">{totalCaloriesConsumed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Consumed</p>
                </motion.div>
                <motion.div
                    className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 transition-transform hover:scale-105"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <span role="img" aria-label="chicken leg" className="text-2xl">🍗</span>
                    <p className="font-bold text-lg">{proteinLeft}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Protein Left</p>
                </motion.div>
                <motion.div
                    className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 transition-transform hover:scale-105"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <span role="img" aria-label="rice bowl" className="text-2xl">🍚</span>
                    <p className="font-bold text-lg">{carbsLeft}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Carbs Left</p>
                </motion.div>
                <motion.div
                    className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 transition-transform hover:scale-105"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <span role="img" aria-label="avocado" className="text-2xl">🥑</span>
                    <p className="font-bold text-lg">{fatLeft}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fat Left</p>
                </motion.div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {/* Weekly Analytics Section */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Weekly Trends</h3>
                    <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                        <button
                            className={cn("px-4 py-1 rounded-full transition-colors", { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeChart === 'calories' })}
                            onClick={() => setActiveChart('calories')}
                        >
                            Calories
                        </button>
                        <button
                            className={cn("px-4 py-1 rounded-full transition-colors", { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeChart === 'macros' })}
                            onClick={() => setActiveChart('macros')}
                        >
                            Macros
                        </button>
                    </div>
                </div>
                <div className="h-64">
                    {renderChart()}
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* Goal-Oriented Guidance */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
                <span role="img" aria-label="guidance icon" className="text-3xl mt-1">{getGuidance.icon}</span>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{getGuidance.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{getGuidance.message}</p>
                </div>
            </div>
        </motion.div>
    );
}
