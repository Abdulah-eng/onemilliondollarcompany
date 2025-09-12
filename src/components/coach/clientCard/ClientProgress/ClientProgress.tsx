// src/components/coach/clientCard/ClientProgress/ClientProgress.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProgramFill from './ProgramFill';
import DailyCheckIn from './DailyCheckIn';
import WeightTrend from './WeightTrend';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';
import { Card } from '@/components/ui/card';
import { mockDailyCheckIn } from '@/mockdata/clientCard/mockDailyCheckIn';
import { mockWeightTrend } from '@/mockdata/clientCard/mockWeightTrend';
import { mockProgramFill } from '@/mockdata/clientCard/mockProgramFill';

interface ClientProgressProps {
  client: any; // Using 'any' for now since we're using mock data
}

const ClientProgress: React.FC<ClientProgressProps> = ({ client }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');
  
  // Use mock data directly
  const dailyCheckIn = mockDailyCheckIn;
  const weightTrend = mockWeightTrend;
  const programFill = mockProgramFill;

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

  const filteredDailyCheckIn = useMemo(() => filterDataByTimeRange(dailyCheckIn), [dailyCheckIn, timeRange]);
  const filteredWeightTrend = useMemo(() => filterDataByTimeRange(weightTrend), [weightTrend, timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-0">
          Progress & Insights 📈
        </h3>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <ProgramFill programFill={programFill} />
        </Card>
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <DailyCheckIn dailyCheckIn={filteredDailyCheckIn} timeRange={timeRange} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <WeightTrend weightTrend={filteredWeightTrend} timeRange={timeRange} />
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 h-96 rounded-xl shadow-lg flex items-center justify-center text-muted-foreground">
          [Detailed Insights Graph goes here]
        </Card>
      </div>
    </motion.div>
  );
};

export default ClientProgress;
