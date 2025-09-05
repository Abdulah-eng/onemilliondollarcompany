import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import RecipeCard from '../RecipeCard';

// Updated constants for the Pie Chart using colors from the provided image
const PIE_COLORS = ['#8b5cf6', '#f97316', '#ef4444']; // Purple, Orange, Red
const STROKE_COLOR = 'transparent'; // No stroke needed for this design

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTimeframe, setActiveTimeframe] = useState('Today');

    // Dynamically calculate consumption based on the active timeframe
    const consumedData = useMemo(() => {
        let timeframeData = [];
        if (activeTimeframe === 'Today') {
            timeframeData = data.macros.slice(-1);
        } else if (activeTimeframe === 'Week') {
            timeframeData = data.macros.slice(-7);
        } else { // Month
            timeframeData = data.macros.slice(-30);
        }

        const totalMacros = timeframeData.reduce((acc, curr) => ({
            protein: acc.protein + curr.protein,
            carbs: acc.carbs + curr.carbs,
            fat: acc.fat + curr.fat,
        }), { protein: 0, carbs: 0, fat: 0 });

        const totalDays = timeframeData.length || 1;

        const protein = Math.round(totalMacros.protein / totalDays);
        const carbs = Math.round(totalMacros.carbs / totalDays);
        const fat = Math.round(totalMacros.fat / totalDays);
        const total = protein + carbs + fat;

        return {
            protein,
            carbs,
            fat,
            total,
            calories: Math.round(protein * 4 + carbs * 4 + fat * 9),
        };
    }, [data.macros, activeTimeframe]);
    
    // Data for the Pie Chart
    const pieData = [
        { name: 'Carbs', value: consumedData.carbs, color: '#f59e0b' },
        { name: 'Protein', value: consumedData.protein, color: '#8b5cf6' },
        { name: 'Fat', value: consumedData.fat, color: '#ef4444' },
    ];

    // Get today's data for remaining calories, intake, and burned metrics
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    const caloriesLeft = Math.max(data.recommended.kcal - totalCaloriesToday, 0);

    const intake = todayData.kcal; // Assuming kcal in mock data is intake
    const burned = data.kcalBurnedLast7Days / 7; // Average daily burned calories

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col gap-6 transition-colors duration-500 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main Header and Timeframe Selector */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Remaining</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{caloriesLeft} Kcal</p>
                </div>
                <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                    {['Today', 'Week', 'Month'].map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTimeframe(timeframe)}
                            className={cn(
                                "px-4 py-1 rounded-full transition-colors",
                                { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeTimeframe === timeframe }
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>
            </div>

            {/* Smart Pie Chart and Macro Breakdown */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="h-48 w-48 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke={STROKE_COLOR}
                                        strokeWidth={4}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Macro breakdown details */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                    {pieData.map(macro => (
                        <div key={macro.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }}></div>
                                <span className="text-sm font-medium">{macro.name}</span>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white font-semibold">
                                {macro.value}g / {data.recommended[macro.name.toLowerCase()]}g
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {/* Intake & Burned Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center gap-4">
                    <span role="img" aria-label="salad bowl" className="text-3xl">🥗</span>
                    <div className="space-y-1">
                        <p className="font-bold text-xl">{intake} Cal</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Intake</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center gap-4">
                    <span role="img" aria-label="fire" className="text-3xl">🔥</span>
                    <div className="space-y-1">
                        <p className="font-bold text-xl">{Math.round(burned)} Cal</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Burned</p>
                    </div>
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* Today's Meals */}
            <div className="pt-6">
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Today's Meals</h3>
                <div className="space-y-4">
                    {data.recentRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                    <button className="w-full text-center text-sm font-semibold py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white transition-colors">
                        View All
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
