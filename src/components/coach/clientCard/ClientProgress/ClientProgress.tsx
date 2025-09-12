// src/components/coach/clientCard/ClientProgress/ClientProgress.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProgramFill from './ProgramFill';
import DailyCheckIn from './DailyCheckIn';
import WeightTrend from './WeightTrend';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';

interface ClientProgressProps {
  insights: {
    dailyCheckIn: { date: string; water: number; energy: number; sleep: number; mood: number }[];
    programFill: { fitness: number; nutrition: number; wellness: number };
    weightTrend: { date: string; weight: number }[];
    nextFollowUp: string;
  };
}

const ClientProgress: React.FC<ClientProgressProps> = ({ insights }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');

  const filterDataByTimeRange = (data: any[], dateField: string = 'date') => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '1week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }

    return data.filter(item => new Date(item[dateField]) >= cutoffDate);
  };

  const filteredDailyCheckIn = filterDataByTimeRange(insights.dailyCheckIn);
  const filteredWeightTrend = filterDataByTimeRange(insights.weightTrend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Progress & Insights 📈
        </h3>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgramFill programFill={insights.programFill} />
        <DailyCheckIn dailyCheckIn={filteredDailyCheckIn} timeRange={timeRange} />
        <WeightTrend
          weightTrend={filteredWeightTrend}
          nextFollowUp={insights.nextFollowUp}
          timeRange={timeRange}
        />
      </div>
    </motion.div>
  );
};

export default ClientProgress;
