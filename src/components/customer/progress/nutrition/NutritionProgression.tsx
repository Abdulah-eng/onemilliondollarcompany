import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { TrendingUp, TrendingDown, Activity, Utensils, Zap, Scale } from 'lucide-react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

// Define colors to match the user's provided images
const MACRO_COLORS = {
    protein: '#6b21a8', // Deep Purple
    fat: '#ea580c',      // Deep Orange
    carbs: '#f97316',    // Bright Orange
    background: '#374151',
    foreground: '#d4d4d4',
};

// Enhanced data for comprehensive nutrition tracking with activity correlation
const DUMMY_BURNED_KCAL = 350;
const DUMMY_TREND_DATA = {
    '7D': [
        { date: 'Dec 1', weight: 70.2, consumed: 2100, burned: 450, activity: 65, net: 1650 },
        { date: 'Dec 2', weight: 69.8, consumed: 1950, burned: 380, activity: 45, net: 1570 },
        { date: 'Dec 3', weight: 70.0, consumed: 2200, burned: 520, activity: 80, net: 1680 },
        { date: 'Dec 4', weight: 69.5, consumed: 2000, burned: 400, activity: 60, net: 1600 },
        { date: 'Dec 5', weight: 69.7, consumed: 2150, burned: 470, activity: 70, net: 1680 },
        { date: 'Dec 6', weight: 69.3, consumed: 1900, burned: 320, activity: 40, net: 1580 },
        { date: 'Dec 7', weight: 69.1, consumed: 2050, burned: 410, activity: 55, net: 1640 },
    ],
    '30D': [
        { date: 'Week 1', weight: 71.0, consumed: 2100, burned: 420, activity: 65, net: 1680 },
        { date: 'Week 2', weight: 70.5, consumed: 2000, burned: 450, activity: 70, net: 1550 },
        { date: 'Week 3', weight: 70.0, consumed: 2050, burned: 380, activity: 55, net: 1670 },
        { date: 'Week 4', weight: 69.5, consumed: 1950, burned: 410, activity: 60, net: 1540 },
    ],
    '90D': [
        { date: 'Month 1', weight: 72.0, consumed: 2200, burned: 400, activity: 60, net: 1800 },
        { date: 'Month 2', weight: 71.5, consumed: 2100, burned: 430, activity: 65, net: 1670 },
        { date: 'Month 3', weight: 70.0, consumed: 2000, burned: 450, activity: 70, net: 1550 },
    ],
};

// Custom tooltip for nutrition trend chart with color-coded indicators
const NutritionTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600/50 shadow-lg min-w-[160px]">
                <p className="text-sm font-bold text-white mb-2">{label}</p>
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-purple-300">Weight: {data.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm bg-orange-400"></div>
                        <span className="text-orange-300">Consumed: {data.consumed} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm bg-red-400"></div>
                        <span className="text-red-300">Burned: {data.burned} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm bg-blue-400"></div>
                        <span className="text-blue-300">Activity: {data.activity}%</span>
                    </div>
                    <hr className="border-gray-600 my-1" />
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300">Net: {data.net} kcal</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const [activeTrend, setActiveTrend] = useState('7D');
    const todayData = data.macros[data.macros.length - 1];
    const totalCaloriesToday = Math.round(todayData.protein * 4 + todayData.carbs * 4 + todayData.fat * 9);

    const trendData = DUMMY_TREND_DATA[activeTrend as keyof typeof DUMMY_TREND_DATA];
    
    // Calculate trend insights
    const currentWeight = trendData[trendData.length - 1]?.weight || 0;
    const previousWeight = trendData[0]?.weight || currentWeight;
    const weightChange = currentWeight - previousWeight;
    const avgCaloriesConsumed = Math.round(trendData.reduce((sum, d) => sum + d.consumed, 0) / trendData.length);
    const avgCaloriesBurned = Math.round(trendData.reduce((sum, d) => sum + d.burned, 0) / trendData.length);

    const caloriePercentage = Math.min(100, (totalCaloriesToday / data.recommended.kcal) * 100);
    const fatPercentage = Math.min(100, (todayData.fat / data.recommended.fat) * 100);

    return (
        <motion.div
            className="w-full text-black bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* NEW HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                        <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-gray-800">Nutrition & Activity</h3>
                        <p className="text-sm text-gray-500">Your progress over the past {activeTrend === '7D' ? 'week' : activeTrend === '30D' ? 'month' : '3 months'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{avgCaloriesConsumed}<span className="text-sm font-medium">kcal</span></p>
                        <p className="text-xs text-gray-500">Avg. Consumed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{avgCaloriesBurned}<span className="text-sm font-medium">kcal</span></p>
                        <p className="text-xs text-gray-500">Avg. Burned</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-sky-400">{currentWeight.toFixed(1)}<span className="text-sm font-medium">kg</span></p>
                        <p className="text-xs text-gray-500">Current Weight</p>
                    </div>
                </div>
            </div>

            ---

            {/* TOP PART: Container with semi-circular gauge and macro bars */}
            <div className="rounded-xl p-6 flex flex-col items-center gap-6 overflow-visible bg-gray-50">
                <div className="relative w-56 h-32 flex justify-center items-center">
                    <svg width="224" height="128" viewBox="0 0 224 128" className="absolute">
                        <defs>
                            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        
                        <path
                            d="M 32 96 A 80 80 0 0 1 192 96"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />
                        
                        <motion.path
                            d="M 32 96 A 80 80 0 0 1 192 96"
                            fill="none"
                            stroke="url(#calorieGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 * (1 - Math.min(1, caloriePercentage / 100)) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                        
                    </svg>
                    
                    <div className="absolute flex flex-col items-center top-6">
                        <span role="img" aria-label="calories" className="text-2xl mb-1">🔥</span>
                        <span className="text-2xl font-bold text-gray-800">{totalCaloriesToday}</span>
                        <span className="text-sm text-gray-500">of {data.recommended.kcal} kcal</span>
                    </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            <span role="img" aria-label="protein">🥩</span> Protein
                        </div>
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

                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            <span role="img" aria-label="fat">🥑</span> Fat
                        </div>
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

                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            <span role="img" aria-label="carbs">🍞</span> Carbs
                        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                    className="bg-gray-100 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <span role="img" aria-label="consumed" className="text-2xl">🍽️</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-800">{totalCaloriesToday}</span>
                            <span className="text-sm font-medium text-gray-500">kcal</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consumed</p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-100 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <span role="img" aria-label="burned" className="text-2xl">🔥</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-800">{DUMMY_BURNED_KCAL}</span>
                            <span className="text-sm font-medium text-gray-500">kcal</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Burned</p>
                    </div>
                </motion.div>
            </div>

            ---

            {/* BOTTOM PART: Enhanced Trend Analysis */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-gray-800 mb-2">Your Progress</h3>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTrend}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-1"
                            >
                                <p className="text-gray-500 text-sm">Average over {activeTrend}</p>
                                <div className="flex flex-col sm:flex-row items-baseline gap-4">
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-4 w-4 text-purple-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-800">
                                            {currentWeight.toFixed(1)} <span className="text-sm font-medium text-gray-500 ml-1">kg Weight</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Utensils className="h-4 w-4 text-orange-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-800">
                                            {avgCaloriesConsumed} <span className="text-sm font-medium text-gray-500 ml-1">Avg Consumed</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-red-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-800">
                                            {avgCaloriesBurned} <span className="text-sm font-medium text-gray-500 ml-1">Avg Burned</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {Object.keys(DUMMY_TREND_DATA).map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
                                activeTrend === timeframe
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>

                <div>
                    <div className="h-72 sm:h-72 md:h-80 w-full overflow-visible">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="consumedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#4b5563"
                                    fontSize={12}
                                    tick={{ fill: '#4b5563' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="cal"
                                    stroke="#f97316"
                                    fontSize={11}
                                    tick={{ fill: '#f97316' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 100', 'dataMax + 100']}
                                />
                                <YAxis
                                    yAxisId="kg"
                                    orientation="right"
                                    stroke="#a855f7"
                                    fontSize={11}
                                    tick={{ fill: '#a855f7' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                />
                                <YAxis
                                    yAxisId="act"
                                    hide
                                    domain={[0, 100]}
                                />
                                <Tooltip content={<NutritionTooltip />} cursor={{ stroke: 'rgba(200,200,200,0.2)', strokeWidth: 1 }} />
                                <Bar
                                    yAxisId="act"
                                    dataKey="activity"
                                    fill="rgba(59, 130, 246, 0.2)"
                                    radius={[2, 2, 0, 0]}
                                />
                                <Area
                                    yAxisId="cal"
                                    type="monotone"
                                    dataKey="consumed"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#consumedGradient)"
                                />
                                <Line
                                    yAxisId="kg"
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2, fill: '#fff' }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MACRO_COLORS.protein }}></div>
                                <span className="text-gray-500">Weight (kg)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm"></div>
                                <span className="text-gray-500">Consumed (kcal)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-2 bg-blue-500/40 rounded-sm"></div>
                                <span className="text-gray-500">Activity (%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
