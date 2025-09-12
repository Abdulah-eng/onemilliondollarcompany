import React from 'react';
import { motion } from 'framer-motion';
import ProgramFill from './ClientProgress/ProgramFill';
import DailyCheckIn from './ClientProgress/DailyCheckIn';
import WeightTrend from './ClientProgress/WeightTrend';
import { Card, CardContent } from '@/components/ui/card';

const ClientProgress = ({ insights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-900">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Progress & Insights 📈</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DailyCheckIn dailyCheckIn={insights.dailyCheckIn} />
            <ProgramFill programFill={insights.programFill} />
            <WeightTrend weightTrend={insights.weight} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientProgress;
