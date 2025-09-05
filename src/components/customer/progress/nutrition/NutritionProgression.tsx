import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';
import RecipeCard from './RecipeCard';

// Using the exact colors from your app's design
const COLORS = {
    calorieBudget: '#f97316', // Orange for the main calorie budget ring
    fat: '#fbbf24',           // Yellow for Fat progress
    carbs: '#34d399',         // Green for Carbs progress
    protein: '#ef4444',       // Red for Protein progress
    bgLight: '#e2e8f0',       // Light gray for background rings/bars
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    // We keep activeTimeframe for potential future use or if other parts of the component need it,
    // but it's not directly used in the new visual elements you requested.
    const [activeTimeframe, setActiveTimeframe] = useState('Today'); 

    // Dynamically calculate consumption based on the active timeframe
    const consumedData = useMemo(() => {
        // For this specific design, we only care about 'Today's' consumption for the display
        const todayMacros = data.macros[data.macros.length - 1];

        const protein = todayMacros.protein;
        const carbs = todayMacros.carbs;
        const fat = todayMacros.fat;

        return {
            protein,
            carbs,
            fat,
            calories: Math.round(protein * 4 + carbs * 4 + fat * 9),
        };
    }, [data.macros]);

    // Get today's data for metrics
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);
    
    // Values for the new design
    const intakeCalories = todayData.kcal; // Assuming kcal from mock data represents intake
    const exerciseCalories = Math.round(data.kcalBurnedLast7Days / 7); // Average daily burned for "Exercise"
    const youCanEat = Math.max(data.recommended.kcal - intakeCalories + exerciseCalories, 0); // Simplified calculation

    // Progress percentage for the main calorie budget ring
    // This is a simplified calculation; adjust as per your exact logic for "remaining" vs "total budget"
    const calorieProgress = Math.min((intakeCalories / data.recommended.kcal) * 100, 100);
    const calorieRingData = [
        { name: 'progress', value: calorieProgress, color: COLORS.calorieBudget },
        { name: 'remaining', value: 100 - calorieProgress, color: COLORS.bgLight },
    ];


    // Helper for macro progress bars
    const getMacroProgress = (current: number, total: number) => Math.min((current / total) * 100, 100);

    return (
        <motion.div
            className="w-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col gap-6 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Calorie Budget Header */}
            <div className="flex justify-end items-center mb-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-white">
                    <p className="font-semibold text-lg">Calorie Budget</p>
                    <button aria-label="Edit calorie budget">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-7.572 7.929l-2.486 4.406 4.025-1.545 1.561-4.088-3.1-1.189zM15 10a1 1 0 11-2 0 1 1 0 012 0z" />
                        </path><path fillRule="evenodd" d="M2 12.5a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calorie Progress Ring and Stats */}
            <div className="flex items-center justify-between text-center mb-6">
                <div className="flex-1">
                    <p className="text-lg text-gray-700 dark:text-gray-300">Intake</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{intakeCalories}</p>
                </div>

                <div className="relative h-48 w-48 flex items-center justify-center flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{ value: 100 }]} // Background for the full circle
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60}
                                fill={COLORS.bgLight}
                                isAnimationActive={false}
                            />
                            <Pie
                                data={[{ value: calorieProgress, fill: COLORS.calorieBudget }, { value: 100 - calorieProgress, fill: 'transparent' }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60}
                                startAngle={90}
                                endAngle={-270 + (360 * (calorieProgress / 100))} // Only draw based on progress
                                isAnimationActive={false}
                                cornerRadius={20} // Rounded edges for the progress bar
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-lg text-gray-700 dark:text-gray-300">You Can Eat</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">{youCanEat}</p>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-lg text-gray-700 dark:text-gray-300">Exercise</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{exerciseCalories}</p>
                </div>
            </div>

            {/* Macro Progress Bars */}
            <div className="space-y-4">
                {/* Fat */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Fat</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {todayData.fat}/{data.recommended.fat}
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${getMacroProgress(todayData.fat, data.recommended.fat)}%`,
                                backgroundColor: COLORS.fat,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Carbs */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Carbs</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {todayData.carbs}/{data.recommended.carbs}
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${getMacroProgress(todayData.carbs, data.recommended.carbs)}%`,
                                backgroundColor: COLORS.carbs,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Protein */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Protein</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {todayData.protein}/{data.recommended.protein}
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${getMacroProgress(todayData.protein, data.recommended.protein)}%`,
                                backgroundColor: COLORS.protein,
                            }}
                        ></div>
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
