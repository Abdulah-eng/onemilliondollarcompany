import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { Utensils, Flame, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

// Define colors to match the user's provided images
const MACRO_COLORS = {
    protein: '#6b21a8', // Deep Purple
    fat: '#ea580c',     // Deep Orange
    carbs: '#f97316',   // Bright Orange
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

    const trendData = DUMMY_TREND_DATA[activeTrend];
    
    // Calculate trend insights
    const currentWeight = trendData[trendData.length - 1]?.weight || 0;
    const previousWeight = trendData[0]?.weight || currentWeight;
    const weightChange = currentWeight - previousWeight;
    const avgCaloriesConsumed = Math.round(trendData.reduce((sum, d) => sum + d.consumed, 0) / trendData.length);
    const avgCaloriesBurned = Math.round(trendData.reduce((sum, d) => sum + d.burned, 0) / trendData.length);

    const caloriePercentage = Math.min(100, (totalCaloriesToday / data.recommended.kcal) * 100);
    const fatPercentage = Math.min(100, (todayData.fat / data.recommended.fat) * 100);

    return (
        <>
            {/* TOP PART: Container with semi-circular gauge and macro bars */}
            <div className="rounded-2xl p-6 flex flex-col items-center gap-6 overflow-visible">
                {/* Semi-circular calorie gauge */}
                <div className="relative w-56 h-32 flex justify-center items-center">
                    <svg width="224" height="128" viewBox="0 0 224 128" className="absolute">
                        <defs>
                            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        
                        {/* Background arc */}
                        <path
                            d="M 32 96 A 80 80 0 0 1 192 96"
                            fill="none"
                            stroke="#4b5563"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />
                        
                        {/* Progress arc */}
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
                    
                    {/* Center content */}
                    <div className="absolute flex flex-col items-center top-6">
                        <span role="img" aria-label="calories" className="text-2xl mb-1">🔥</span>
                        <span className="text-2xl font-bold text-white">{totalCaloriesToday}</span>
                        <span className="text-sm text-gray-300">of {data.recommended.kcal} kcal</span>
                    </div>
                </div>

                {/* Three macro bars - responsive layout */}
                <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
                    {/* Protein */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-300 uppercase tracking-wide">Protein</div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.protein }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.protein / data.recommended.protein) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                        </div>
                        <div className="text-xs text-gray-300">
                            {todayData.protein} / {data.recommended.protein} g
                        </div>
                    </div>

                    {/* Fat */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-300 uppercase tracking-wide">Fat</div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.fat }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.fat / data.recommended.fat) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            />
                        </div>
                        <div className="text-xs text-gray-300">
                            {todayData.fat} / {data.recommended.fat} g
                        </div>
                    </div>

                    {/* Carbs */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="text-xs font-medium text-gray-300 uppercase tracking-wide">Carbs</div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: MACRO_COLORS.carbs }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (todayData.carbs / data.recommended.carbs) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            />
                        </div>
                        <div className="text-xs text-gray-300">
                            {todayData.carbs} / {data.recommended.carbs} g
                        </div>
                    </div>
                </div>
            </div>

            {/* MIDDLE PART: Consumed and Burned */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Consumed Card */}
                <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{totalCaloriesToday}</span>
                            <span className="text-sm font-medium text-gray-400">kcal</span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Consumed</p>
                    </div>
                </motion.div>

                {/* Burned Card */}
                <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{DUMMY_BURNED_KCAL}</span>
                            <span className="text-sm font-medium text-gray-400">kcal</span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Burned</p>
                    </div>
                </motion.div>
            </div>

            {/* BOTTOM PART: Enhanced Trend Analysis */}
            <div className="space-y-4 sm:space-y-6">
                {/* Header with main metrics */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white mb-2">Your Progress</h3>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTrend}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-1"
                            >
                                <p className="text-gray-400 text-sm">Current Weight</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-white">
                                        {currentWeight}
                                        <span className="text-lg font-medium text-gray-400 ml-1">kg</span>
                                    </p>
                                    <div className={cn(
                                        "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                                        weightChange < 0 
                                            ? "bg-green-500/20 text-green-400" 
                                            : "bg-orange-500/20 text-orange-400"
                                    )}>
                                        {weightChange < 0 ? (
                                            <TrendingDown className="h-3 w-3" />
                                        ) : (
                                            <TrendingUp className="h-3 w-3" />
                                        )}
                                        {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Avg metrics */}
                    <div className="flex flex-col gap-2 text-right">
                        <div className="flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-gray-400">Avg Consumed:</span>
                            <span className="text-sm font-bold text-white">{avgCaloriesConsumed} kcal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-gray-400">Avg Burned:</span>
                            <span className="text-sm font-bold text-white">{avgCaloriesBurned} kcal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-400">Net Surplus:</span>
                            <span className="text-sm font-bold text-white">
                                {avgCaloriesConsumed - avgCaloriesBurned} kcal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center gap-2 flex-wrap">
                    {Object.keys(DUMMY_TREND_DATA).map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
                                activeTrend === timeframe 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-white/90 dark:text-black' 
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white'
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>

                {/* Full-bleed Chart container */}
                <div className="-mx-6 sm:-mx-8 md:mx-0">
                    {/* Enhanced Chart with Multiple Y-Axes */}
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
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tick={{ fill: '#9ca3af' }} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            {/* Calories Y-axis (left) */}
                            <YAxis 
                                yAxisId="cal"
                                stroke="#f97316" 
                                fontSize={11}
                                tick={{ fill: '#f97316' }}
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 100', 'dataMax + 100']}
                            />
                            {/* Weight Y-axis (right) */}
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
                            {/* Activity Y-axis (hidden) */}
                            <YAxis 
                                yAxisId="act"
                                hide
                                domain={[0, 100]}
                            />
                            <Tooltip content={<NutritionTooltip />} cursor={{ stroke: 'rgba(100,100,100,0.2)', strokeWidth: 1 }} />
                            
                            {/* Activity bars (background, using activity axis) */}
                            <Bar 
                                yAxisId="act"
                                dataKey="activity" 
                                fill="rgba(59, 130, 246, 0.2)" 
                                radius={[2, 2, 0, 0]} 
                            />
                            
                            {/* Consumed calories area (using calories axis) */}
                            <Area 
                                yAxisId="cal"
                                type="monotone" 
                                dataKey="consumed" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#consumedGradient)" 
                            />
                            
                            {/* Weight line (using weight axis) */}
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

                {/* Enhanced Legend - Full bleed to align with chart */}
                <div className="-mx-6 sm:-mx-8 md:mx-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 sm:px-8 md:px-0">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-gray-400">Weight (kg)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm"></div>
                            <span className="text-gray-400">Consumed (kcal)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-2 bg-blue-500/40 rounded-sm"></div>
                            <span className="text-gray-400">Activity (%)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400"/>
                        <p className="font-bold text-white text-sm">
                            {avgCaloriesConsumed - avgCaloriesBurned} kcal{' '}
                            <span className="font-normal text-gray-400">Net Surplus</span>
                        </p>
                     </div>
                    </div>
                </div>
            </div>
        </>
    );
}
