import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { BrainCircuit, Wind } from 'lucide-react';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';

// Helper to calculate meditation streak
const getMeditationStreak = (data: ProgressData['mentalHealth']['meditationMinutes']) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].minutes > 0) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// Helper to calculate yoga streak
const getYogaStreak = (data: ProgressData['mentalHealth']['yogaSessions']) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].completed) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// Helper to calculate journaling streak - using mood as proxy since journalingCompleted doesn't exist
const getJournalingStreak = (data: ProgressData['dailyCheckins']) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].mood === 'great' || data[i].mood === 'good') {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// Custom Tooltip for the combined chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600/50 shadow-lg min-w-[150px] text-white">
                <p className="text-sm font-bold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={`tooltip-${index}`} className="flex justify-between items-center text-xs">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="font-semibold">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function MentalHealthProgression({ mentalHealth, dailyCheckins }: { mentalHealth: ProgressData['mentalHealth'], dailyCheckins: ProgressData['dailyCheckins'] }) {
    const last7DaysCheckins = dailyCheckins.slice(-7);
    const last7DaysMeditation = mentalHealth.meditationMinutes.slice(-7);

    // Combine data for the dual-axis chart
    const combinedChartData = last7DaysCheckins.map((checkin, index) => ({
        ...checkin,
        meditationMinutes: last7DaysMeditation[index]?.minutes || 0,
    }));
    
    const yogaStreak = getYogaStreak(mentalHealth.yogaSessions);
    const journalingStreak = getJournalingStreak(dailyCheckins);
    const meditationStreak = getMeditationStreak(mentalHealth.meditationMinutes);

    return (
        <motion.div
            className="w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col gap-8 bg-[#1f2937] text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header and Streaks Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Mental Wellness</h3>
                        <p className="text-sm text-gray-400">Your progress over the past week</p>
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

            ---
            
            {/* Combined Chart Section */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg text-white">Mindfulness & Stress Trend</h4>
                <div className="h-60 w-full bg-gray-800 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={combinedChartData}>
                            <defs>
                                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })} 
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <YAxis 
                                yAxisId="meditation"
                                orientation="left"
                                stroke="#c084fc" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#c084fc', fontSize: 12 }}
                            />
                            <YAxis 
                                yAxisId="stress"
                                orientation="right"
                                stroke="#f87171" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[1, 10]}
                                label={{ value: 'Stress Level', angle: 90, position: 'insideRight', fill: '#f87171', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Meditation Minutes (Bar Chart) */}
                            <Bar 
                                yAxisId="meditation" 
                                dataKey="meditationMinutes" 
                                fill="#c084fc" 
                                radius={[4, 4, 0, 0]} 
                                name="Meditation"
                            />

                            {/* Stress Level (Line Chart) */}
                            <Line 
                                yAxisId="stress"
                                type="monotone" 
                                dataKey="stressLevel" 
                                stroke="#f87171" 
                                strokeWidth={2}
                                name="Stress Level"
                                dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#f87171', strokeWidth: 2, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            ---

            {/* Insights Section */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg text-white">Insights</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Wind className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Mindful Breathing</p>
                            <p className="text-xs text-gray-400">
                                You've meditated for **{mentalHealth.meditationMinutes.reduce((sum, entry) => sum + entry.minutes, 0)}** minutes this week.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Wind className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Relaxation</p>
                            <p className="text-xs text-gray-400">
                                Your average stress level is **{Math.round(last7DaysCheckins.reduce((sum, entry) => sum + entry.stressLevel, 0) / last7DaysCheckins.length)}** out of 10.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
