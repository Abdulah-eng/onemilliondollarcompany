// src/components/coach/clientCard/ClientKeyMetrics.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Flame, Utensils, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientKeyMetrics = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">Actionable Insights <BarChart size={20} className="text-primary" /></h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-500" />
                <p className="font-semibold">Calories Burned</p>
              </div>
              <p className="font-bold">{stats.caloriesBurned}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils size={20} className="text-teal-500" />
                <p className="font-semibold">Macros</p>
              </div>
              <p className="font-bold">{stats.macros}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell size={20} className="text-indigo-500" />
                <p className="font-semibold">Minutes Meditated</p>
              </div>
              <p className="font-bold">{stats.minutesMedicated}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientKeyMetrics;
