import { useState, useMemo } from 'react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import RecipeCard from './RecipeCard';

// Custom Tooltip for the chart, styled to match the theme
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-lg">
                <p className="text-sm font-bold text-foreground">{`${label}`}</p>
                <p className="text-xs text-muted-foreground">{`${payload[0].value}g`}</p>
            </div>
        );
    }
    return null;
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    // Calculate average macros and total calories for the chart
    const avgMacros = useMemo(() => {
        const totalMacros = data.macros.reduce((acc, curr) => ({
            protein: acc.protein + curr.protein,
            carbs: acc.carbs + curr.carbs,
            fat: acc.fat + curr.fat,
            kcal: acc.kcal + (curr.protein * 4) + (curr.carbs * 4) + (curr.fat * 9),
        }), { protein: 0, carbs: 0, fat: 0, kcal: 0 });

        const totalDays = data.macros.length || 1;

        return [
            { name: 'Protein', value: Math.round(totalMacros.protein / totalDays) },
            { name: 'Carbs', value: Math.round(totalMacros.carbs / totalDays) },
            { name: 'Fat', value: Math.round(totalMacros.fat / totalDays) },
            { name: 'Kcal', value: Math.round(totalMacros.kcal / totalDays) },
        ];
    }, [data.macros]);

    const displayRecentMeals = data.recentRecipes.slice(0, 3);
    const hasMoreMeals = data.recentRecipes.length > 3;

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col transition-colors duration-500 bg-white dark:bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            {/* Section 1: Macros Chart */}
            <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Nutrition Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={avgMacros} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} content={<CustomTooltip />} />
                                <Bar dataKey="value" barSize={30} fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around md:flex-col items-center gap-4 text-gray-900 dark:text-white">
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">{data.mealCompletion}%</p>
                            <p className="text-xs text-gray-500 dark:text-white/70">Meal Adherence</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{data.outsideMeals}</p>
                            <p className="text-xs text-gray-500 dark:text-white/70">Meals Out (7d)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Recent Meals */}
            <div className="border-t border-border/50 pt-6 mt-6">
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">🍲 Recent Meals</h3>
                <div className="space-y-4">
                    {displayRecentMeals.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                    {hasMoreMeals && (
                        <button className="w-full text-center text-sm font-semibold py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white transition-colors">
                            View More
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
