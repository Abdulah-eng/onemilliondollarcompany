import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { BrainCircuit, Wind, Sun, Moon, Zap } from 'lucide-react'; // Added Sun, Moon, Zap for icons
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { cn } from '@/lib/utils';

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
                    <div className="flex items-center
