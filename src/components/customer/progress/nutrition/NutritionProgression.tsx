import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Constants for the Pie Chart
const PIE_COLORS = ['#34d399', '#f59e0b', '#ef4444']; // Green (Protein), Yellow (Carbs), Red (Fat)
const STROKE_COLOR = '#e5e7eb'; // Tailwind gray-200

// Main Nutrition Progression component
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
        { name: 'Protein', value: consumedData.protein, color: PIE_COLORS[0] },
        { name: 'Carbs', value: consumedData.carbs, color: PIE_COLORS[1] },
        { name: 'Fat', value: consumedData.fat, color: PIE_COLORS[2] },
    ];
    
    // Calculate remaining calories for today's view
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    const caloriesLeft = Math.max(data.recommended.kcal - totalCaloriesToday, 0);

    // Get goal-oriented guidance
    const getGuidance = useMemo(() => {
        const proteinPercentage = (todayData.protein / data.recommended.protein) * 100;
        const carbsPercentage = (todayData.carbs / data.recommended.carbs) * 100;
        const fatPercentage = (todayData.fat / data.recommended.fat) * 100;

        if (proteinPercentage < 70) {
            return { title: "Boost Your Protein!", message: "You're a bit low on protein today. Add a lean protein source like chicken or fish to hit your target.", icon: "💪" };
        }
        if (carbsPercentage < 70) {
            return { title: "Need More Energy?", message: "Your carb intake is low. Carbs fuel your workouts! Consider adding whole grains, fruits, or starchy vegetables.", icon: "🏃" };
        }
        if (fatPercentage < 70) {
            return { title: "Healthy Fats are Key!", message: "Your fat intake is below target. Healthy fats from nuts, seeds, or avocado are crucial for hormone balance.", icon: "🥑" };
        }
        return { title: "Excellent Work Today!", message: "You're on track to hit your nutrition goals. Your balanced intake is helping you build a healthier you. Keep it up!", icon: "✅" };
    }, [todayData, data.recommended]);

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col gap-6 transition-colors duration-500 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header with Remaining Calories */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nutrition Overview</h3>
                <div className="flex items-center gap-2">
                    <span role="img" aria-label="fire" className="text-3xl">🔥</span>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{caloriesLeft}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Calories Left</p>
                    </div>
                </div>
            </div>

            {/* Smart Pie Chart and Timeframe Selector */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{consumedData.calories}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Kcal Avg</p>
                    </div>
                </div>
                
                {/* Timeframe & Macro Details */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-center md:justify-start gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                        {['Today', 'Week', 'Month'].map(timeframe => (
                            <button
                                key={timeframe}
                                onClick={() => setActiveTimeframe(timeframe)}
                                className={cn(
                                    "px-4 py-1 rounded-full text-sm font-semibold transition-colors",
                                    { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeTimeframe === timeframe }
                                )}
                            >
                                {timeframe}
                            </button>
                        ))}
                    </div>
                    
                    {/* Macro breakdown */}
                    <div className="flex flex-col gap-2">
                        {pieData.map(macro => (
                            <div key={macro.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }}></div>
                                    <span className="text-sm font-medium">{macro.name}</span>
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white font-semibold">{macro.value}g</span>
                            </div>
                        ))}
                    </div>
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
