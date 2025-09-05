import { useState, useMemo } from 'react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import RecipeCard from './RecipeCard';

// A new custom component for the radial progress bar
const RadialProgressChart = ({ calories, target, mealData }) => {
    // Calculate the percentage of the target reached
    const percentage = Math.min(100, (calories / target) * 100);
    const circumference = 2 * Math.PI * 50;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // A map to determine the color of each meal slice based on the percentage of total calories it represents
    const sliceData = useMemo(() => {
        const total = mealData.reduce((sum, meal) => sum + meal.kcal, 0);
        return mealData.map(meal => ({
            name: meal.name,
            value: (meal.kcal / total) * 100,
            color: meal.color,
        }));
    }, [mealData]);

    // Use a new SVG-based radial progress bar to create the layered effect
    return (
        <div className="relative flex items-center justify-center p-6">
            <svg className="w-64 h-64 transform -rotate-90">
                {/* Background circle */}
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="50"
                    cx="50%"
                    cy="50%"
                />
                {/* Foreground segments for each meal */}
                {sliceData.reduce((acc, slice) => {
                    const lastOffset = acc.length > 0 ? acc[acc.length - 1].offset : 0;
                    const newOffset = lastOffset + slice.value;
                    const dashoffset = circumference - (newOffset / 100) * circumference;
                    acc.push({
                        offset: newOffset,
                        dashoffset: dashoffset,
                        color: slice.color,
                    });
                    return acc;
                }, []).map((segment, index) => (
                    <circle
                        key={index}
                        className="transition-all duration-700 ease-out"
                        strokeWidth="12"
                        stroke={segment.color}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={segment.dashoffset}
                        fill="transparent"
                        r="50"
                        cx="50%"
                        cy="50%"
                    />
                ))}
            </svg>
            <div className="absolute text-center">
                <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{calories}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kcal Gained</p>
            </div>
            {/* Legend for the segments */}
            <div className="absolute top-0 right-0 p-4">
                {sliceData.map((slice, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} />
                        <p className="text-xs text-gray-600 dark:text-gray-300">{slice.name}: {slice.value.toFixed(0)}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    // Determine the colors for the pie charts and radial chart
    const PIE_COLORS_RECOMMENDED = ['#a855f7', '#facc15', '#f87171']; // Purple, Yellow, Red
    const PIE_COLORS_ACTUAL = ['#c084fc', '#fde047', '#fca5a5']; // Lighter versions

    const totalKcal = data.macros.reduce((sum, macro) => sum + (macro.protein * 4) + (macro.carbs * 4) + (macro.fat * 9), 0);

    const recommendedIntake = useMemo(() => {
        const total = data.recommended.protein + data.recommended.carbs + data.recommended.fat;
        return [
            { name: 'Carbs', value: data.recommended.carbs, color: PIE_COLORS_RECOMMENDED[0] },
            { name: 'Fat', value: data.recommended.fat, color: PIE_COLORS_RECOMMENDED[1] },
            { name: 'Protein', value: data.recommended.protein, color: PIE_COLORS_RECOMMENDED[2] },
        ];
    }, [data.recommended]);

    const actualIntake = useMemo(() => {
        const total = data.macros.reduce((acc, curr) => acc + curr.protein + curr.carbs + curr.fat, 0);
        const avgMacros = data.macros.reduce((acc, curr) => ({
            protein: acc.protein + curr.protein,
            carbs: acc.carbs + curr.carbs,
            fat: acc.fat + curr.fat,
        }), { protein: 0, carbs: 0, fat: 0 });
        const totalDays = data.macros.length || 1;

        return [
            { name: 'Carbs', value: Math.round(avgMacros.carbs / totalDays), color: PIE_COLORS_ACTUAL[0] },
            { name: 'Fat', value: Math.round(avgMacros.fat / totalDays), color: PIE_COLORS_ACTUAL[1] },
            { name: 'Protein', value: Math.round(avgMacros.protein / totalDays), color: PIE_COLORS_ACTUAL[2] },
        ];
    }, [data.macros]);
    
    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col transition-colors duration-500 bg-white dark:bg-[#1f2937] shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Nutrition Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Radial Progress Chart for Calories */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                    <RadialProgressChart
                        calories={totalKcal}
                        target={data.dailyTargetKcal}
                        mealData={data.recentRecipes.map(r => ({ name: r.name, kcal: r.calories, color: r.color || '#6366f1' }))} // Example colors
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Daily Target: {data.dailyTargetKcal} Kcal</p>
                </div>

                {/* Daily Calories & Macros Overview */}
                <div className="space-y-6">
                    {/* Daily Calories Bar */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Daily Calories</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalKcal} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Target: {data.dailyTargetKcal} kcal</p>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-4">
                            <motion.div
                                className="h-full bg-green-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (totalKcal / data.dailyTargetKcal) * 100)}%` }}
                                transition={{ duration: 0.7 }}
                            />
                        </div>
                    </div>
                    
                    {/* Macronutrient Pie Charts */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Nutrition Info</h3>
                        <div className="flex justify-around items-center gap-4">
                            {/* Recommended Pie Chart */}
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width={100} height={100}>
                                    <PieChart>
                                        <Pie data={recommendedIntake} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} innerRadius={20} labelLine={false}>
                                            {recommendedIntake.map((entry, index) => <Cell key={`cell-rec-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recommended</p>
                            </div>
                            
                            {/* Actual Pie Chart */}
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width={100} height={100}>
                                    <PieChart>
                                        <Pie data={actualIntake} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} innerRadius={20} labelLine={false}>
                                            {actualIntake.map((entry, index) => <Cell key={`cell-act-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Actual</p>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex flex-col space-y-1 text-sm">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white"><span className="w-2 h-2 rounded-full bg-red-500" /> Protein</div>
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white"><span className="w-2 h-2 rounded-full bg-amber-500" /> Fat</div>
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white"><span className="w-2 h-2 rounded-full bg-purple-500" /> Carbs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-700" />

            {/* Section 2: Recent Meals */}
            <div className="pt-6">
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">🍲 Recent Meals</h3>
                <div className="space-y-4">
                    {data.recentRecipes.slice(0, 3).map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                    {data.recentRecipes.length > 3 && (
                        <button className="w-full text-center text-sm font-semibold py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white transition-colors">
                            View More
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
