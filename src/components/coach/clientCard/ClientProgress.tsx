// src/components/coach/clientCard/ClientProgress.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ClientProgress = ({ insights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg rounded-xl bg-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Progress & Insights 📈</h3>
            <Button variant="ghost" className="text-primary">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <p className="text-sm font-semibold text-muted-foreground">Program Progress</p>
              <p className="text-2xl font-bold">{insights.programProgress}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <p className="text-sm font-semibold text-muted-foreground">Avg. Check-in</p>
              <p className="text-2xl font-bold">{insights.avgDailyCheckIn}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <p className="text-sm font-semibold text-muted-foreground">Adherence</p>
              <p className="text-2xl font-bold">{insights.adherence}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <p className="text-sm font-semibold text-muted-foreground">Next Follow-up</p>
              <p className="text-sm font-bold mt-2">{insights.nextFollowUp}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientProgress;
