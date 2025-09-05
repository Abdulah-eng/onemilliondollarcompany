import { motion } from 'framer-motion';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';

interface DailySummaryCardProps {
    currentMacros: ProgressData['nutrition']['macros'][0];
    recommendedMacros: ProgressData['nutrition']['recommended'];
}

const MacroBar = ({ label, consumed, total, color, icon }: { label: string; consumed: number; total: number; color: string; icon: string }) => {
    const percentage = Math.min((consumed / total) * 100, 100);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-2">
                    <span role="img" aria-label={label}>{icon}</span>
                    {label}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{consumed}g / {total}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                    className={cn("h-full rounded-full", color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                />
            </div>
        </div>
    );
};

export default function DailySummaryCard({ currentMacros, recommendedMacros }: DailySummaryCardProps) {
    const totalCaloriesConsumed = Math.round((currentMacros.protein * 4) + (currentMacros.carbs * 4) + (currentMacros.fat * 9));
    const caloriesLeft = Math.max(recommendedMacros.kcal - totalCaloriesConsumed, 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Today's Nutrition</h3>
                <div className="flex items-center gap-2">
                    <span role="img" aria-label="fire" className="text-3xl">🔥</span>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{caloriesLeft}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Calories Left</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <span role="img" aria-label="fire" className="text-2xl">🔥</span>
                    <p className="font-bold text-xl">{totalCaloriesConsumed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                </div>
                <div className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <span role="img" aria-label="chicken leg" className="text-2xl">🍗</span>
                    <p className="font-bold text-xl">{currentMacros.protein}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                </div>
                <div className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <span role="img" aria-label="rice bowl" className="text-2xl">🍚</span>
                    <p className="font-bold text-xl">{currentMacros.carbs}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                </div>
                <div className="p-4 rounded-xl flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <span role="img" aria-label="cooking oil drum" className="text-2xl">🛢️</span>
                    <p className="font-bold text-xl">{currentMacros.fat}g</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
                </div>
            </div>
            <div className="space-y-4">
                <MacroBar label="Protein" consumed={currentMacros.protein} total={recommendedMacros.protein} color="bg-emerald-500" icon="🍗" />
                <MacroBar label="Carbs" consumed={currentMacros.carbs} total={recommendedMacros.carbs} color="bg-amber-400" icon="🍚" />
                <MacroBar label="Fat" consumed={currentMacros.fat} total={recommendedMacros.fat} color="bg-red-500" icon="🛢️" />
            </div>
        </div>
    );
}
