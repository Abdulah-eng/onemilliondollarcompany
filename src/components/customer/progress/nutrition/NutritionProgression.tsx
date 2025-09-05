import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        // A placeholder for 30-day data
        { date: 'Week 1', weight: 79, kcal: 2000 },
        { date: 'Week 2', weight: 78.5, kcal: 2100 },
        { date: 'Week 3', weight: 78.2, kcal: 1950 },
        { date: 'Week 4', weight: 78, kcal: 2200 },
    ],
    '6 Months': [
        // A placeholder for 6-month data
        { date: 'Jan', weight: 85, kcal: 2300 },
        { date: 'Apr', weight: 81, kcal: 2100 },
        { date: 'Jul', weight: 78, kcal: 2000 },
    ],
    '1 Year': [
        // A placeholder for 1-year data
        { date: 'Jan', weight: 90, kcal: 2500 },
        { date: 'Jul', weight: 80, kcal: 2100 },
    ],
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTrend, setActiveTrend] = useState('1 Week');
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);

    const trendData = DUMMY_TREND_DATA[activeTrend];

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-[#1f2937] text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* TOP PART: Calorie Arc and Macro Bars */}
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-40 h-20 flex flex-col items-center justify-center">
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
                        {/* Foreground arc (consumed) */}
                        <motion.path
                            d="M 10 70 A 70 70 0 0 1 150 70"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: Math.min(1, totalCaloriesToday / data.recommended.kcal) }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center top-1/2 -translate-y-1/2 mt-10">
                        <span role="img" aria-label="calories" className="text-2xl mb-1">🔥</span>
                        <span className="text-3xl font-bold">{totalCaloriesToday}</span>
                        <span className="text-sm text-gray-400 font-medium">{data.recommended.kcal} kcal</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-4 text-center">
                    {/* Macro Bars */}
                    <div className="flex flex-col items-center">
                        <h4 className="text-sm font-bold capitalize text-white mb-2">Protein</h4>
                        <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-700">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.protein }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.protein / data.recommended.protein) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <p className="text-xs font-medium text-white mt-2">
                            {todayData.protein}g / <span className="text-gray-400">{data.recommended.protein}g</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="text-sm font-bold capitalize text-white mb-2">Fat</h4>
                        <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-700">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.fat }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.fat / data.recommended.fat) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <p className="text-xs font-medium text-white mt-2">
                            {todayData.fat}g / <span className="text-gray-400">{data.recommended.fat}g</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="text-sm font-bold capitalize text-white mb-2">Carbs</h4>
                        <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-700">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.carbs }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.carbs / data.recommended.carbs) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <p className="text-xs font-medium text-white mt-2">
                            {todayData.carbs}g / <span className="text-gray-400">{data.recommended.carbs}g</span>
                        </p>
                    </div>
                </div>
            </div>

            ---

            {/* MIDDLE PART: Consumed and Burned */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-800 rounded-3xl p-4 flex flex-col items-center justify-center">
                    <span role="img" aria-label="consumed" className="text-3xl mb-2">🍽️</span>
                    <p className="text-xl font-bold">
                        {totalCaloriesToday} <span className="text-sm font-normal text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm text-gray-400 font-medium">Consumed</p>
                </div>
                <div className="bg-gray-800 rounded-3xl p-4 flex flex-col items-center justify-center">
                    <span role="img" aria-label="burned" className="text-3xl mb-2">🔥</span>
                    <p className="text-xl font-bold">
                        {DUMMY_BURNED_KCAL} <span className="text-sm font-normal text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm text-gray-400 font-medium">Burned</p>
                </div>
            </div>

            ---

            {/* BOTTOM PART: Weight and Consumption Trend */}
            <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-white">Your Progress</h3>
                <div className="flex items-center text-sm font-semibold text-gray-400 bg-gray-800 rounded-full p-1 mb-6 w-fit mx-auto">
                    {Object.keys(DUMMY_TREND_DATA).map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                "px-4 py-1 rounded-full transition-colors",
                                { 'bg-gray-700 text-white shadow-sm': activeTrend === timeframe }
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>
                
                {/* Visual Trend Indicator (Simple SVG for demo) */}
                <div className="w-full h-40 bg-gray-800 rounded-2xl p-4 flex flex-col justify-between items-center relative">
                    {/* Placeholder for a dynamic line graph */}
                    <div className="flex w-full justify-between items-end h-full">
                        {trendData.map((point, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                {/* The height of the bar is a visual representation of progress */}
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
