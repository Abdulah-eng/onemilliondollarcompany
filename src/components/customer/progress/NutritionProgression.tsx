import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import DailySummaryCard from './DailySummaryCard';
import WeeklyChartCard from './WeeklyChartCard';
import GoalGuidance from './GoalGuidance';

// This is the main component that orchestrates the entire nutrition dashboard
export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    // We get the most recent day's data, which is the last entry in the macros array, for "today's" view.
    const todayData = data.macros[data.macros.length - 1];

    return (
        <motion.div
            className="w-full flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <DailySummaryCard
                        currentMacros={todayData}
                        recommendedMacros={data.recommended}
                    />
                </motion.div>
                <motion.div
                    className="lg:col-span-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <GoalGuidance
                        currentMacros={todayData}
                        recommendedMacros={data.recommended}
                    />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <WeeklyChartCard weeklyData={data.macros} />
            </motion.div>
        </motion.div>
    );
}
