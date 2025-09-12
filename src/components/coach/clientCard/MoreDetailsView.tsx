// src/components/coach/clientCard/MoreDetailsView.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MoreDetailsView = ({ insights, onClose }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between pb-2">
        <Button variant="ghost" onClick={onClose} className="p-0 h-auto">
          <ArrowLeft size={24} className="mr-2" />
          <span className="text-lg font-semibold">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Progress Details</h1>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Detailed Graphs 📊</h2>
        {/* Placeholder for detailed insights graph */}
        <div className="bg-muted h-64 rounded-xl flex items-center justify-center text-muted-foreground">
          [More detailed progress graphs go here]
        </div>
      </div>
    </div>
  );
};

export default MoreDetailsView;
