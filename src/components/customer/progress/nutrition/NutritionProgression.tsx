import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProgressData } from '@/mockdata/progress/mockProgressData'; // Keeping this import

// Define colors to match the user's provided images
const MACRO_COLORS = {
    carbs: '#f97316', // Orange
    protein: '#a855f7', // Purple
    fat: '#ef4444', // Red
};

// Dummy data for the new trend graph and calories burned
const DUMMY_BURNED_KCAL = 350;
const DUMMY_TREND_DATA = {
    '1 Week': [
        { date: 'Mon', weight: 80, kcal: 2100 },
        { date: 'Tue', weight: 79.8, kcal: 2200 },
        { date: 'Wed', weight: 79.5, kcal: 2050 },
        { date: 'Thu', weight: 79.2, kcal: 2300 },
        { date: 'Fri', weight: 79.1, kcal: 2150 },
    ],
    '30 Days': [
        { date: 'Week 1', weight: 79, kcal: 2000 },
        { date: 'Week 2', weight: 78.5, kcal: 2100 },
        { date: 'Week 3', weight: 78.2, kcal: 1950 },
        { date: 'Week 4', weight: 78, kcal: 2200 },
    ],
    '6 Months': [
        { date: 'Jan', weight: 85, kcal: 2300 },
        { date: 'Apr', weight: 81, kcal: 2100 },
        { date: 'Jul', weight: 78, kcal: 2000 },
    ],
    '1 Year': [
        { date: 'Jan', weight: 90, kcal: 2500 },
        { date: 'Jul', weight: 80, kcal: 2100 },
    ],
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTrend, setActiveTrend] = useState('1 Week');
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);

    const trendData = DUMMY_TREND_DATA[activeTrend];

    // Calculate percentage for fat macro for the progress bar
    const fatPercentage = Math.min(100, (todayData.fat / data.recommended.fat) * 100);

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-[#1f2937] text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* TOP PART: The integrated Calorie Arc and Macro Bars */}
            <div className="flex flex-col items-center gap-6">
                <div className="w-full grid grid-cols-3 items-center justify-between">
                    {/* Protein Macro Bar (Left) */}
                    <div className="flex flex-col items-start gap-2">
                        <h4 className="text-sm font-bold">Protein</h4>
                        <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-gray-700">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.protein }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.protein / data.recommended.protein) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <p className="text-xs font-medium text-gray-400">
                            {todayData.protein}g / {data.recommended.protein}g
                        </p>
                    </div>

                    {/* Calorie Arc (Center) */}
                    <div className="relative w-full h-20 flex flex-col items-center justify-center">
                        <svg
                            width="160"
                            height="80"
                            viewBox="0 0 160 80"
                            className="absolute transform scale-y-[-1] origin-bottom"
                        >
                            {/* Background arc */}
                            <path
                                d="M 10 70 A 70 70 0 0 1 150 70"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="10"
                                strokeLinecap="round"
                            />
                            {/* Fat foreground arc */}
                            <motion.path
                                d="M 10 70 A 70 70 0 0 1 150 70"
                                fill="none"
                                stroke={MACRO_COLORS.fat}
                                strokeWidth="10"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: Math.min(1, fatPercentage / 100) }}
                                transition={{ duration: 0.5 }}
                            />
                            {/* Outer calorie foreground arc */}
                            <motion.path
                                d="M 10 70 A 70 70 0 0 1 150 70"
                                fill="none"
                                stroke={MACRO_COLORS.carbs}
                                strokeWidth="10"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: Math.min(1, totalCaloriesToday / data.recommended.kcal) }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center top-1/2 -translate-y-1/2 mt-10">
                            <span role="img" aria-label="calories" className="text-3xl mb-1">🔥</span>
                            <span className="text-2xl font-bold">{totalCaloriesToday}</span>
                            <span className="text-xs text-gray-400 font-medium">{data.recommended.kcal} kcal</span>
                        </div>
                    </div>

                    {/* Carbs Macro Bar (Right) */}
                    <div className="flex flex-col items-end gap-2 text-right">
                        <h4 className="text-sm font-bold">Carbs</h4>
                        <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-gray-700">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.carbs }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.carbs / data.recommended.carbs) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <p className="text-xs font-medium text-gray-400">
                            {todayData.carbs}g / {data.recommended.carbs}g
                        </p>
                    </div>
                </div>
                {/* Fat Macro Bar (Hidden for now as it's inside the arc as requested) */}
                {/* The fat bar is now a component of the central arc, as seen in the image. */}
            </div>

            <hr className="my-4 border-gray-700" />

            {/* MIDDLE PART: Consumed and Burned */}
            <div className="flex justify-around items-center text-center">
                <div className="flex flex-col items-center gap-2">
                    <span role="img" aria-label="consumed" className="text-3xl">🍽️</span>
                    <p className="text-base font-bold">
                        {totalCaloriesToday} <span className="text-sm font-normal text-gray-400">Kcal</span>
                    </p>
                    <p className="text-xs text-gray-400 font-medium">Consumed</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span role="img" aria-label="burned" className="text-3xl">🔥</span>
                    <p className="text-base font-bold">
                        {DUMMY_BURNED_KCAL} <span className="text-sm font-normal text-gray-400">Kcal</span>
                    </p>
                    <p className="text-xs text-gray-400 font-medium">Burned</p>
                </div>
            </div>

            <hr className="my-4 border-gray-700" />

            {/* BOTTOM PART: Weight and Consumption Trend */}
            <div>
                <h3 className="text-lg font-bold tracking-tight mb-4">Your Progress</h3>
                <div className="flex items-center text-xs font-semibold text-gray-400 bg-gray-800 rounded-full p-1 mb-4 w-fit mx-auto">
                    {Object.keys(DUMMY_TREND_DATA).map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                "px-3 py-1 rounded-full transition-colors",
                                { 'bg-gray-700 text-white shadow-sm': activeTrend === timeframe }
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>

                <div className="w-full h-40 bg-gray-800 rounded-2xl p-4 flex flex-col justify-between items-center relative">
                    <div className="flex w-full justify-between items-end h-full">
                        {trendData.map((point, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-2 rounded-t-full transition-all duration-300"
                                    style={{
                                        height: `${(point.weight - Math.min(...trendData.map(d => d.weight))) / (Math.max(...trendData.map(d => d.weight)) - Math.min(...trendData.map(d => d.weight))) * 80 + 20}%`,
                                        backgroundColor: '#a855f7',
                                    }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-2">{point.date}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-4 left-4 text-sm font-medium text-gray-500">
                        <p>Weight: <span className="font-bold text-white">{trendData[trendData.length - 1].weight} kg</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
