import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import RecipeCard from './RecipeCard';

// Using the exact colors from your app's design
const COLORS = {
    carbs: '#f97316',    // Orange/yellow
    protein: '#a855f7',  // Purple
    fat: '#ef4444',      // Red
    bg: '#e2e8f0',       // Soft gray for background rings
};

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

        return {
            protein,
            carbs,
            fat,
            calories: Math.round(protein * 4 + carbs * 4 + fat * 9),
        };
    }, [data.macros, activeTimeframe]);

    // Data for the Pie Chart
    const pieData = [
        { name: 'Carbs', value: consumedData.carbs, color: COLORS.carbs },
        { name: 'Protein', value: consumedData.protein, color: COLORS.protein },
        { name: 'Fat', value: consumedData.fat, color: COLORS.fat },
    ];
    
    // Get today's data for remaining calories, intake, and burned metrics
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    const caloriesLeft = Math.max(data.recommended.kcal - totalCaloriesToday, 0);

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col gap-6 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* NEW: Remaining Kcal Header and Timeframe Selector */}
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

            {/* NEW: Pie Chart with concentric rings and Macro Breakdown */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="h-48 w-48 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {/* Outer ring for Carbs */}
                            <Pie
                                data={[{ name: 'Carbs', value: consumedData.carbs, fill: COLORS.carbs }, { name: 'Carbs-bg', value: Math.max(0, data.recommended.carbs - consumedData.carbs), fill: '#e2e8f0' }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={70}
                                startAngle={90}
                                endAngle={-270}
                                cornerRadius={8}
                            />
                            {/* Middle ring for Protein */}
                            <Pie
                                data={[{ name: 'Protein', value: consumedData.protein, fill: COLORS.protein }, { name: 'Protein-bg', value: Math.max(0, data.recommended.protein - consumedData.protein), fill: '#e2e8f0' }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={65}
                                innerRadius={55}
                                startAngle={90}
                                endAngle={-270}
                                cornerRadius={8}
                            />
                            {/* Inner ring for Fat */}
                            <Pie
                                data={[{ name: 'Fat', value: consumedData.fat, fill: COLORS.fat }, { name: 'Fat-bg', value: Math.max(0, data.recommended.fat - consumedData.fat), fill: '#e2e8f0' }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                innerRadius={40}
                                startAngle={90}
                                endAngle={-270}
                                cornerRadius={8}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Macro breakdown details with emojis */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                    <div className="flex items-center justify-between text-gray-900 dark:text-white text-sm font-semibold">
                        <p>Carbs</p>
                        <p>{todayData.carbs}g / {data.recommended.carbs}g</p>
                    </div>
                    <div className="flex items-center justify-between text-gray-900 dark:text-white text-sm font-semibold">
                        <p>Protein</p>
                        <p>{todayData.protein}g / {data.recommended.protein}g</p>
                    </div>
                    <div className="flex items-center justify-between text-gray-900 dark:text-white text-sm font-semibold">
                        <p>Fat</p>
                        <p>{todayData.fat}g / {data.recommended.fat}g</p>
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
