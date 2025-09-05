import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProgressData } from '@/mockdata/progress/mockProgressData';

// Define colors to match the user's provided images
const MACRO_COLORS = {
    protein: '#6b21a8', // Deep Purple
    fat: '#ea580c',     // Deep Orange
    carbs: '#f97316',   // Bright Orange
    background: '#374151',
    foreground: '#d4d4d4',
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

    const caloriePercentage = Math.min(100, (totalCaloriesToday / data.recommended.kcal) * 100);
    const fatPercentage = Math.min(100, (todayData.fat / data.recommended.fat) * 100);

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-[#1f2937] text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* TOP PART: White container with semi-circular gauge and macro bars */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-6">
                {/* Semi-circular calorie gauge */}
                <div className="relative w-48 h-24 flex justify-center items-center">
                    <svg width="192" height="96" viewBox="0 0 192 96" className="absolute">
                        <defs>
                            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        
                        {/* Background arc */}
                        <path
                            d="M 24 72 A 72 72 0 0 1 168 72"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                        
                        {/* Progress arc */}
                        <motion.path
                            d="M 24 72 A 72 72 0 0 1 168 72"
                            fill="none"
                            stroke="url(#calorieGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: Math.min(1, caloriePercentage / 100) }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                        
                        {/* End knob */}
                        <motion.circle
                            cx={24 + 144 * Math.min(1, caloriePercentage / 100)}
                            cy={72}
                            r="6"
                            fill="url(#calorieGradient)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        />
                    </svg>
                    
                    {/* Center content */}
                    <div className="absolute flex flex-col items-center top-4">
                        <span role="img" aria-label="calories" className="text-2xl mb-1">🔥</span>
                        <span className="text-2xl font-bold text-gray-900">{totalCaloriesToday}</span>
                        <span className="text-sm text-gray-500">of {data.recommended.kcal} kcal</span>
                    </div>
                </div>

                {/* Three macro bars horizontally */}
                <div className="w-full flex justify-between gap-4">
                    {/* Protein */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Protein</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.protein }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.protein / data.recommended.protein) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {todayData.protein} / {data.recommended.protein} g
                        </div>
                    </div>

                    {/* Fat */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fat</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.fat }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.fat / data.recommended.fat) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {todayData.fat} / {data.recommended.fat} g
                        </div>
                    </div>

                    {/* Carbs */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Carbs</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.carbs }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.carbs / data.recommended.carbs) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            {todayData.carbs} / {data.recommended.carbs} g
                        </div>
                    </div>
                </div>
            </div>

            ---

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

            ---

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
