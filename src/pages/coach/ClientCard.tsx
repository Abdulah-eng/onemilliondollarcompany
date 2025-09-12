// src/components/coach/clientCard/ClientProgress.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import DailyCheckIn from './ClientProgress/DailyCheckIn';
import ProgramFill from './ClientProgress/ProgramFill';
import WeightTrend from './ClientProgress/WeightTrend';

interface ClientProgressProps {
  insights: {
    dailyCheckIn: { water: number[]; energy: number[]; sleep: number[]; mood: number[] };
    programFill: { fitness: number; nutrition: number; wellness: number };
    weightTrend: number[];
    nextFollowUp: string;
  };
}

const ClientProgress: React.FC<ClientProgressProps> = ({ insights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Progress & Insights 📈</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProgramFill programFill={insights.programFill} />
            <DailyCheckIn dailyCheckIn={insights.dailyCheckIn} />
            <WeightTrend weightTrend={insights.weightTrend} nextFollowUp={insights.nextFollowUp} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientProgress;
