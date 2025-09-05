import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// Note: All old Recharts and RecipeCard components have been removed as requested.

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

// A simple component to render the semi-circular calorie bar
const CalorieArc = ({ consumed, recommended }) => {
    const percentage = Math.min(100, (consumed / recommended) * 100);
    const strokeDashoffset = 471 - (471 * percentage) / 100;

    return (
        <div className="relative w-40 h-20 overflow-hidden flex items-end justify-center">
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
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                {/* Foreground arc (consumed) */}
                <path
                    d="M 10 70 A 70 70 0 0 1 150 70"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="10"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: 471,
                        strokeDashoffset: strokeDashoffset,
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                    }}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span role="img" aria-label="calories" className="text-3xl mb-1">🔥</span>
                <span className="text-2xl font-bold">{consumed} <span className="text-sm font-normal">kcal</span></span>
                <span className="text-sm text-gray-500 font-medium">of {recommended} kcal</span>
            </div>
        </div>
    );
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTrend, setActiveTrend] = useState('1 Week');
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);

    const trendData = DUMMY_TREND_DATA[activeTrend];

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* TOP PART: Calorie Arc and Macro Bars */}
            <div className="flex flex-col items-center gap-6">
                <CalorieArc consumed={totalCaloriesToday} recommended={data.recommended.kcal} />
                <div className="w-full flex justify-between gap-4 text-center">
                    {/* Macro Bars */}
                    {Object.entries({
                        protein: todayData.protein,
                        fat: todayData.fat,
                        carbs: todayData.carbs
                    }).map(([macro, value]) => (
                        <div key={macro} className="flex-1">
                            <h4 className="text-lg font-bold capitalize text-gray-900 dark:text-white mb-1">{macro}</h4>
                            <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: MACRO_COLORS[macro] }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (value / data.recommended[macro]) * 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                ></motion.div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                                {value}g / {data.recommended[macro]}g
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {/* MIDDLE PART: Consumed and Burned */}
            <div className="grid grid-cols-2 gap-4 text-center text-gray-900 dark:text-white">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl p-4 flex flex-col items-center justify-center">
                    <span role="img" aria-label="consumed" className="text-3xl mb-2">🍽️</span>
                    <p className="text-xl font-bold">
                        {totalCaloriesToday} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm text-gray-500 font-medium dark:text-gray-400">Consumed</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl p-4 flex flex-col items-center justify-center">
                    <span role="img" aria-label="burned" className="text-3xl mb-2">🔥</span>
                    <p className="text-xl font-bold">
                        {DUMMY_BURNED_KCAL} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Kcal</span>
                    </p>
                    <p className="text-sm text-gray-500 font-medium dark:text-gray-400">Burned</p>
                </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {/* BOTTOM PART: Weight and Consumption Trend */}
            <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Your Progress</h3>
                <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1 mb-6 w-fit mx-auto">
                    {Object.keys(DUMMY_TREND_DATA).map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                "px-4 py-1 rounded-full transition-colors",
                                { 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm': activeTrend === timeframe }
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>
                
                {/* Visual Trend Indicator (Simple SVG for demo) */}
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 flex flex-col justify-between items-center relative">
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
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{point.date}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <p>Weight: <span className="font-bold text-gray-900 dark:text-white">{trendData[trendData.length - 1].weight} kg</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
