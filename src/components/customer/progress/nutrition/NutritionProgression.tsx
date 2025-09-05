import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import RecipeCard from './RecipeCard';

// Using the exact colors from the provided image and a light gray for background
const PIE_COLORS = ['#f97316', '#a855f7', '#ef4444']; // Orange, Purple, Red (Adjusted order to match the image)
const PIE_BG_COLOR = '#e2e8f0'; // Light gray for the background of the pie chart rings

// Dummy data for burned calories and weight trends to demonstrate the new sections
const DUMMY_BURNED_KCAL = 350;
const DUMMY_WEIGHT_TRENDS = [
    { label: '1 Week', value: '-1.2 kg' },
    { label: '30 Days', value: '-2.5 kg' },
    { label: '6 Months', value: '-10 kg' },
    { label: '1 Year', value: '-15 kg' },
];

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTimeframe, setActiveTimeframe] = useState('Today');
    const [activeTrend, setActiveTrend] = useState('1 Week');

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

        return {
            protein,
            carbs,
            fat,
            calories: Math.round(protein * 4 + carbs * 4 + fat * 9),
        };
    }, [data.macros, activeTimeframe]);
    
    // Get today's data for remaining calories
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    const caloriesLeft = Math.max(data.recommended.kcal - totalCaloriesToday, 0);

    // Data for the Pie Chart
    const pieDataCarbs = [
        { name: 'Carbs', value: consumedData.carbs, fill: PIE_COLORS[0] },
        { name: 'Carbs-bg', value: Math.max(0, data.recommended.carbs - consumedData.carbs), fill: PIE_BG_COLOR },
    ];
    const pieDataProtein = [
        { name: 'Protein', value: consumedData.protein, fill: PIE_COLORS[1] },
        { name: 'Protein-bg', value: Math.max(0, data.recommended.protein - consumedData.protein), fill: PIE_BG_COLOR },
    ];
    const pieDataFat = [
        { name: 'Fat', value: consumedData.fat, fill: PIE_COLORS[2] },
        { name: 'Fat-bg', value: Math.max(0, data.recommended.fat - consumedData.fat), fill: PIE_BG_COLOR },
    ];

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Remaining Kcal Header and Timeframe Selector */}
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex flex-col">
                    <p className="text-base font-medium text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{caloriesLeft} Kcal</p>
                </div>
                <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1 self-center md:self-auto">
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

            {/* Pie Chart and Macro Breakdown */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                <div className="h-48 w-48 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {/* Outer ring for Carbs */}
                            <Pie data={pieDataCarbs} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={70} startAngle={90} endAngle={-270} cornerRadius={8} />
                            {/* Middle ring for Protein */}
                            <Pie data={pieDataProtein} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={55} startAngle={90} endAngle={-270} cornerRadius={8} />
                            {/* Inner ring for Fat */}
                            <Pie data={pieDataFat} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={40} startAngle={90} endAngle={-270} cornerRadius={8} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Macro breakdown details */}
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[0] }}></span>
                        <div className="flex flex-grow justify-between items-center text-sm font-medium text-gray-900 dark:text-white">
                            <p>Carbs</p>
                            <p className="font-bold">{todayData.carbs}g / <span className="text-gray-500 dark:text-gray-400 font-normal">{data.recommended.carbs}g</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }}></span>
                        <div className="flex flex-grow justify-between items-center text-sm font-medium text-gray-900 dark:text-white">
                            <p>Protein</p>
                            <p className="font-bold">{todayData.protein}g / <span className="text-gray-500 dark:text-gray-400 font-normal">{data.recommended.protein}g</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[2] }}></span>
                        <div className="flex flex-grow justify-between items-center text-sm font-medium text-gray-900 dark:text-white">
                            <p>Fat</p>
                            <p className="font-bold">{todayData.fat}g / <span className="text-gray-500 dark:text-gray-400 font-normal">{data.recommended.fat}g</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* NEW: Calories Consumed & Burned Section */}
            <div className="grid grid-cols-2 gap-4 text-center text-gray-900 dark:text-white">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold flex items-center gap-2">
                        {totalCaloriesToday} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span role="img" aria-label="consumed">🍽️</span> Consumed
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold flex items-center gap-2">
                        {DUMMY_BURNED_KCAL} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span role="img" aria-label="burned">🔥</span> Burned
                    </p>
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* NEW: Weight Trend Indicator */}
            <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Weight Trend</h3>
                <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 -mx-6 px-6 scrollbar-hidden">
                    {DUMMY_WEIGHT_TRENDS.map((trend) => (
                        <button
                            key={trend.label}
                            onClick={() => setActiveTrend(trend.label)}
                            className={cn(
                                "flex flex-col items-center justify-center flex-shrink-0 w-32 h-24 rounded-2xl p-4 transition-colors border-2",
                                activeTrend === trend.label
                                    ? "bg-purple-600 border-purple-600 text-white shadow-lg"
                                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            )}
                        >
                            <span className="text-2xl font-bold">{trend.value}</span>
                            <span className={cn("text-sm mt-1", activeTrend === trend.label ? "text-purple-200" : "text-gray-500 dark:text-gray-400")}>{trend.label}</span>
                        </button>
                    ))}
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
