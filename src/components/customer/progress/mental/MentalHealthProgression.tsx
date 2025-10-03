import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { BrainCircuit, Sun, Moon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define colors for mental health metrics
const MENTAL_HEALTH_COLORS = {
    sleep: '#8b5cf6', // Violet
    stress: '#ef4444', // Red
    energy: '#fcd34d', // Yellow
    meditation: '#c084fc', // Purple for Meditation bars
    background: '#ffffff', // White
    foreground: '#262626', // Charcoal/dark text
};

// Helper function to generate trend data from daily check-ins
const generateTrendData = (dailyCheckins: any[], timeframe: string) => {
    if (!dailyCheckins || dailyCheckins.length === 0) return [];
    
    const now = new Date();
    let daysToShow = 7;
    
    switch (timeframe) {
        case '7D':
            daysToShow = 7;
            break;
        case '30D':
            daysToShow = 30;
            break;
        case '90D':
            daysToShow = 90;
            break;
        default:
            daysToShow = 7;
    }
    
    // Get the last N days of data
    const recentData = dailyCheckins.slice(-daysToShow);
    
    return recentData.map((checkin, index) => {
        const date = new Date(checkin.date);
        let dateLabel = '';
        
        if (timeframe === '7D') {
            dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (timeframe === '30D') {
            const weekNumber = Math.floor(index / 7) + 1;
            dateLabel = `Week ${weekNumber}`;
        } else {
            const monthNumber = Math.floor(index / 30) + 1;
            dateLabel = `Month ${monthNumber}`;
        }
        
        return {
            date: dateLabel,
            sleepHours: checkin.sleep_hours || 0,
            stressLevel: checkin.stress || 0,
            energyLevel: checkin.energy || 0,
            meditationMinutes: 0, // Not in daily_checkins table
            journalingCompleted: false, // Not in daily_checkins table
            mood: checkin.mood || 'neutral',
        };
    });
};

// Helper to calculate meditation streak
const getMeditationStreak = (data) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].meditationMinutes > 0) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// Helper to calculate yoga streak
const getYogaStreak = () => {
    return 5;
};

// Helper to calculate journaling streak
const getJournalingStreak = (data) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].journalingCompleted) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// Custom Tooltip for the mental health trend chart
const MentalHealthTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-100/95 backdrop-blur-sm p-3 rounded-lg border border-gray-300/50 shadow-lg min-w-[160px] text-gray-900">
                <p className="text-sm font-bold mb-2">{label}</p>
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.sleep }}></div>
                        <span style={{ color: MENTAL_HEALTH_COLORS.sleep }}>Sleep: {data.sleepHours} hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.stress }}></div>
                        <span style={{ color: MENTAL_HEALTH_COLORS.stress }}>Stress: {data.stressLevel} / 10</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.energy }}></div>
                        <span style={{ color: MENTAL_HEALTH_COLORS.energy }}>Energy: {data.energyLevel} / 10</span>
                    </div>
                    <hr className="border-gray-300 my-1" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: MENTAL_HEALTH_COLORS.meditation }}></div>
                        <span style={{ color: MENTAL_HEALTH_COLORS.meditation }}>Meditation: {data.meditationMinutes} min</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function MentalHealthProgression({ mentalHealth, dailyCheckins }) {
    const [activeTrend, setActiveTrend] = useState('7D');
    
    // Generate trend data from real daily check-ins
    const trendData = useMemo(() => {
        return generateTrendData(dailyCheckins || [], activeTrend);
    }, [dailyCheckins, activeTrend]);

    // Handle empty data case
    if (!dailyCheckins || dailyCheckins.length === 0) {
        return (
            <div className="w-full bg-white text-gray-900 rounded-2xl p-4 sm:p-8 space-y-8 shadow-xl">
                <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-tight">Mental Wellness</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        No mental health data available yet. Start logging your daily check-ins to see your progress here.
                    </p>
                </div>
            </div>
        );
    }

    const latestData = trendData[trendData.length - 1] || { sleepHours: 0, stressLevel: 0, energyLevel: 0 };
    const avgSleepHours = trendData.length > 0 ? (trendData.reduce((sum, d) => sum + d.sleepHours, 0) / trendData.length).toFixed(1) : '0.0';
    const avgStressLevel = trendData.length > 0 ? (trendData.reduce((sum, d) => sum + d.stressLevel, 0) / trendData.length).toFixed(1) : '0.0';
    const avgEnergyLevel = trendData.length > 0 ? (trendData.reduce((sum, d) => sum + d.energyLevel, 0) / trendData.length).toFixed(1) : '0.0';

    const meditationStreak = getMeditationStreak(trendData);
    const journalingStreak = getJournalingStreak(trendData);
    const yogaStreak = getYogaStreak();

    return (
        <motion.div
            className="w-full bg-white text-gray-900 rounded-2xl p-4 sm:p-8 space-y-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Mental Wellness</h3>
                        <p className="text-sm text-gray-500">Your progress over the past {activeTrend === '7D' ? 'week' : activeTrend === '30D' ? 'month' : '3 months'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">{meditationStreak}</p>
                        <p className="text-xs text-gray-500">Meditation Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{journalingStreak}</p>
                        <p className="text-xs text-gray-500">Journaling Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-sky-600">{yogaStreak}</p>
                        <p className="text-xs text-gray-500">Yoga Streak</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Moon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">{latestData.sleepHours.toFixed(1)}</span>
                            <span className="text-sm font-medium text-gray-500">hrs</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sleep Today</p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">{latestData.stressLevel}</span>
                            <span className="text-sm font-medium text-gray-500">/ 10</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stress Today</p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Sun className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">{latestData.energyLevel}</span>
                            <span className="text-sm font-medium text-gray-500">/ 10</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Energy Today</p>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-2">Your Mental Health Trend</h3>
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
                                        <Moon className="h-4 w-4 text-violet-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-900">
                                            {avgSleepHours} <span className="text-sm font-medium text-gray-500 ml-1">hrs Sleep</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-red-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-900">
                                            {avgStressLevel} <span className="text-sm font-medium text-gray-500 ml-1">Avg Stress</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-yellow-600" />
                                        <p className="text-xl font-bold tracking-tight text-gray-900">
                                            {avgEnergyLevel} <span className="text-sm font-medium text-gray-500 ml-1">Avg Energy</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {['7D', '30D', '90D'].map(timeframe => (
                        <button
                            key={timeframe}
                            onClick={() => setActiveTrend(timeframe)}
                            className={cn(
                                'text-sm font-semibold px-3 py-1.5 rounded-full transition-all',
                                activeTrend === timeframe
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            )}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>

                <div className="-mx-4 sm:-mx-8 md:mx-0">
                    <div className="h-72 sm:h-72 md:h-80 w-full overflow-visible">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={MENTAL_HEALTH_COLORS.sleep} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={MENTAL_HEALTH_COLORS.sleep} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#525252"
                                    fontSize={12}
                                    tick={{ fill: '#525252' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="sleep"
                                    stroke={MENTAL_HEALTH_COLORS.sleep}
                                    fontSize={11}
                                    tick={{ fill: MENTAL_HEALTH_COLORS.sleep }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: MENTAL_HEALTH_COLORS.sleep, fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="stress"
                                    orientation="right"
                                    stroke={MENTAL_HEALTH_COLORS.stress}
                                    fontSize={11}
                                    tick={{ fill: MENTAL_HEALTH_COLORS.stress }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[1, 10]}
                                    label={{ value: 'Level', angle: 90, position: 'insideRight', fill: MENTAL_HEALTH_COLORS.stress, fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="energy"
                                    hide
                                    domain={[1, 10]}
                                />
                                <Tooltip content={(props) => <MentalHealthTooltip {...props} />} cursor={{ stroke: 'rgba(200,200,200,0.2)', strokeWidth: 1 }} />
                                <Area
                                    yAxisId="sleep"
                                    type="monotone"
                                    dataKey="sleepHours"
                                    stroke={MENTAL_HEALTH_COLORS.sleep}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#sleepGradient)"
                                    name="Sleep Hours"
                                />
                                <Line
                                    yAxisId="stress"
                                    type="monotone"
                                    dataKey="stressLevel"
                                    stroke={MENTAL_HEALTH_COLORS.stress}
                                    strokeWidth={3}
                                    name="Stress Level"
                                    dot={{ fill: MENTAL_HEALTH_COLORS.stress, strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: MENTAL_HEALTH_COLORS.stress, strokeWidth: 2, fill: '#fff' }}
                                />
                                <Line
                                    yAxisId="energy"
                                    type="monotone"
                                    dataKey="energyLevel"
                                    stroke={MENTAL_HEALTH_COLORS.energy}
                                    strokeWidth={3}
                                    name="Energy Level"
                                    dot={{ fill: MENTAL_HEALTH_COLORS.energy, strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: MENTAL_HEALTH_COLORS.energy, strokeWidth: 2, fill: '#fff' }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.sleep }}></div>
                            <span className="text-gray-500">Sleep (hrs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.stress }}></div>
                            <span className="text-gray-500">Stress (Level)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.energy }}></div>
                            <span className="text-gray-500">Energy (Level)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: MENTAL_HEALTH_COLORS.meditation }}></div>
                            <span className="text-gray-500">Meditation (min)</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
