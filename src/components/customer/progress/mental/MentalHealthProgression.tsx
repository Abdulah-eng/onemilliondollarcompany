import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { BrainCircuit, Sun, Moon, Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressData } from '@/mockdata/progress/mockProgressData';

// Define colors for mental health metrics
const MENTAL_HEALTH_COLORS = {
    sleep: '#8b5cf6', // Violet
    stress: '#ef4444', // Red
    energy: '#fcd34d', // Yellow
    meditation: '#c084fc', // Purple for Meditation bars
    background: '#1f2937',
    foreground: '#d4d4d4',
};

// DUMMY TREND DATA for mental health
const DUMMY_MENTAL_HEALTH_TREND_DATA = {
    '7D': [
        { date: 'Dec 1', sleepHours: 7.5, stressLevel: 6, energyLevel: 7, meditationMinutes: 20, journalingCompleted: true, mood: 'good' },
        { date: 'Dec 2', sleepHours: 6.8, stressLevel: 7, energyLevel: 6, meditationMinutes: 15, journalingCompleted: false, mood: 'neutral' },
        { date: 'Dec 3', sleepHours: 8.0, stressLevel: 5, energyLevel: 8, meditationMinutes: 25, journalingCompleted: true, mood: 'great' },
        { date: 'Dec 4', sleepHours: 7.0, stressLevel: 6, energyLevel: 7, meditationMinutes: 20, journalingCompleted: true, mood: 'good' },
        { date: 'Dec 5', sleepHours: 7.2, stressLevel: 6, energyLevel: 7, meditationMinutes: 10, journalingCompleted: false, mood: 'neutral' },
        { date: 'Dec 6', sleepHours: 6.5, stressLevel: 8, energyLevel: 5, meditationMinutes: 0, journalingCompleted: true, mood: 'bad' },
        { date: 'Dec 7', sleepHours: 7.8, stressLevel: 5, energyLevel: 8, meditationMinutes: 30, journalingCompleted: true, mood: 'great' },
    ],
    '30D': [
        { date: 'Week 1', sleepHours: 7.2, stressLevel: 6.5, energyLevel: 7.0, meditationMinutes: 100, journalingCompleted: true, mood: 'good' },
        { date: 'Week 2', sleepHours: 7.0, stressLevel: 6.0, energyLevel: 7.5, meditationMinutes: 90, journalingCompleted: true, mood: 'good' },
        { date: 'Week 3', sleepHours: 6.9, stressLevel: 7.0, energyLevel: 6.8, meditationMinutes: 80, journalingCompleted: false, mood: 'neutral' },
        { date: 'Week 4', sleepHours: 7.5, stressLevel: 5.5, energyLevel: 8.0, meditationMinutes: 120, journalingCompleted: true, mood: 'great' },
    ],
    '90D': [
        { date: 'Month 1', sleepHours: 7.1, stressLevel: 6.8, energyLevel: 7.2, meditationMinutes: 350, journalingCompleted: true, mood: 'good' },
        { date: 'Month 2', sleepHours: 7.3, stressLevel: 6.2, energyLevel: 7.5, meditationMinutes: 400, journalingCompleted: true, mood: 'great' },
        { date: 'Month 3', sleepHours: 7.0, stressLevel: 6.5, energyLevel: 7.0, meditationMinutes: 380, journalingCompleted: true, mood: 'good' },
    ],
};

// Helper to calculate meditation streak
const getMeditationStreak = (data: typeof DUMMY_MENTAL_HEALTH_TREND_DATA['7D']) => {
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

// Helper to calculate yoga streak (using dummy data for now as not in DUMMY_MENTAL_HEALTH_TREND_DATA)
const getYogaStreak = () => {
    // This would typically come from actual yoga session data.
    // For now, returning a static or simplified value.
    return 5; // Example streak
};

// Helper to calculate journaling streak
const getJournalingStreak = (data: typeof DUMMY_MENTAL_HEALTH_TREND_DATA['7D']) => {
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
const MentalHealthTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600/50 shadow-lg min-w-[160px] text-white">
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
                    <hr className="border-gray-600 my-1" />
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

export default function MentalHealthProgression({ mentalHealth, dailyCheckins }: { mentalHealth: ProgressData['mentalHealth'], dailyCheckins: ProgressData['dailyCheckins'] }) {
    const [activeTrend, setActiveTrend] = useState('7D');
    const trendData = DUMMY_MENTAL_HEALTH_TREND_DATA[activeTrend as keyof typeof DUMMY_MENTAL_HEALTH_TREND_DATA];

    const latestData = trendData[trendData.length - 1];
    const avgSleepHours = (trendData.reduce((sum, d) => sum + d.sleepHours, 0) / trendData.length).toFixed(1);
    const avgStressLevel = (trendData.reduce((sum, d) => sum + d.stressLevel, 0) / trendData.length).toFixed(1);
    const avgEnergyLevel = (trendData.reduce((sum, d) => sum + d.energyLevel, 0) / trendData.length).toFixed(1);

    const meditationStreak = getMeditationStreak(DUMMY_MENTAL_HEALTH_TREND_DATA['7D']);
    const journalingStreak = getJournalingStreak(DUMMY_MENTAL_HEALTH_TREND_DATA['7D']);
    const yogaStreak = getYogaStreak();

    return (
        <motion.div
            className="w-full flex flex-col gap-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 sm:p-8 rounded-2xl bg-[#1f2937]">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Mental Wellness</h3>
                        <p className="text-sm text-gray-400">Your progress over the past {activeTrend === '7D' ? 'week' : activeTrend === '30D' ? 'month' : '3 months'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-teal-400">{meditationStreak}</p>
                        <p className="text-xs text-gray-400">Meditation Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-400">{journalingStreak}</p>
                        <p className="text-xs text-gray-400">Journaling Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-sky-400">{yogaStreak}</p>
                        <p className="text-xs text-gray-400">Yoga Streak</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 sm:px-8">
                <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Moon className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{latestData.sleepHours.toFixed(1)}</span>
                            <span className="text-sm font-medium text-gray-400">hrs</span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Sleep Today</p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Zap className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{latestData.stressLevel}</span>
                            <span className="text-sm font-medium text-gray-400">/ 10</span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Stress Today</p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                        <Sun className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{latestData.energyLevel}</span>
                            <span className="text-sm font-medium text-gray-400">/ 10</span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Energy Today</p>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 px-6 sm:px-8">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white mb-2">Your Mental Health Trend</h3>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTrend}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-1"
                            >
                                <p className="text-gray-400 text-sm">Average over {activeTrend}</p>
                                <div className="flex flex-col sm:flex-row items-baseline gap-4">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4 text-violet-400" />
                                        <p className="text-xl font-bold tracking-tight text-white">
                                            {avgSleepHours} <span className="text-sm font-medium text-gray-400 ml-1">hrs Sleep</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-red-400" />
                                        <p className="text-xl font-bold tracking-tight text-white">
                                            {avgStressLevel} <span className="text-sm font-medium text-gray-400 ml-1">Avg Stress</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-yellow-400" />
                                        <p className="text-xl font-bold tracking-tight text-white">
                                            {avgEnergyLevel} <span className="text-sm font-medium text-gray-400 ml-1">Avg Energy</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap px-6 sm:px-8">
                    {Object.keys(DUMMY_MENTAL_HEALTH_TREND_DATA).map(timeframe => (
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

                <div className="-mx-6 sm:-mx-8 md:mx-0">
                    <div className="h-72 sm:h-72 md:h-80 w-full overflow-visible">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={MENTAL_HEALTH_COLORS.sleep} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={MENTAL_HEALTH_COLORS.sleep} stopOpacity={0} />
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
                                <Tooltip content={<MentalHealthTooltip />} cursor={{ stroke: 'rgba(100,100,100,0.2)', strokeWidth: 1 }} />
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

                <div className="-mx-6 sm:-mx-8 md:mx-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 sm:px-8 md:px-0">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.sleep }}></div>
                                <span className="text-gray-400">Sleep (hrs)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.stress }}></div>
                                <span className="text-gray-400">Stress (Level)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MENTAL_HEALTH_COLORS.energy }}></div>
                                <span className="text-gray-400">Energy (Level)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: MENTAL_HEALTH_COLORS.meditation }}></div>
                                <span className="text-gray-400">Meditation (min)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
