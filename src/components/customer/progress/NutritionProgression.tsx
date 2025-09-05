import { useState, useMemo } from 'react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    // Pie chart colors for the recommended intake
    const PIE_COLORS = ['#3B82F6', '#FBBF24', '#EF4444']; // Blue, Amber, Red

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
            { name: 'Protein', value: Math.round(totalMacros.protein / totalDays), color: '#34d399' }, // Green
            { name: 'Carbs', value: Math.round(totalMacros.carbs / totalDays), color: '#fbbf24' }, // Yellow
            { name: 'Fat', value: Math.round(totalMacros.fat / totalDays), color: '#f87171' }, // Red
            { name: 'Kcal', value: Math.round(totalMacros.kcal / totalDays), color: '#60a5fa' }, // Blue
        ];
    }, [data.macros]);

    // Data for the pie chart with recommended daily intake
    const recommendedIntake = useMemo(() => {
        const total = data.recommended.protein + data.recommended.carbs + data.recommended.fat;
        return [
            { name: 'Protein', value: data.recommended.protein, color: PIE_COLORS[0] },
            { name: 'Carbs', value: data.recommended.carbs, color: PIE_COLORS[1] },
            { name: 'Fat', value: data.recommended.fat, color: PIE_COLORS[2] },
        ];
    }, [data.recommended]);

    const displayRecentMeals = data.recentRecipes.slice(0, 3);
    const hasMoreMeals = data.recentRecipes.length > 3;

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col transition-colors duration-500 bg-white dark:bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            {/* Section 1: Macros Chart & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {/* Bar Chart */}
                <div className="h-48 w-full md:col-span-2 lg:col-span-1">
                    <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Nutrition Overview</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avgMacros} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                {avgMacros.map((macro, index) => (
                                    <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={macro.color} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={macro.color} stopOpacity={0.4} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} content={<CustomTooltip />} />
                            <Bar dataKey="value" barSize={30} radius={[10, 10, 0, 0]} >
                                {avgMacros.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Daily Recommendations Pie Chart */}
                <div className="w-full lg:col-span-2 mt-8 md:mt-0">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Daily Recommendations</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 h-48 mt-4">
                        <div className="h-full w-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        <linearGradient id="pieGradient1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#d1fae5" stopOpacity={0.5} />
                                        </linearGradient>
                                        <linearGradient id="pieGradient2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.5} />
                                        </linearGradient>
                                        <linearGradient id="pieGradient3" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#fee2e2" stopOpacity={0.5} />
                                        </linearGradient>
                                    </defs>
                                    <Pie
                                        data={recommendedIntake}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        labelLine={false}
                                    >
                                        {recommendedIntake.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`url(#pieGradient${index + 1})`} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-2">
                            {recommendedIntake.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <p className="text-sm text-gray-900 dark:text-white">{entry.name}: <span className="font-semibold">{entry.value}g</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <hr className="mt-6 md:mt-8 border-border/50" />

            {/* Section 2: Recent Meals */}
            <div className="pt-6 mt-6">
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
