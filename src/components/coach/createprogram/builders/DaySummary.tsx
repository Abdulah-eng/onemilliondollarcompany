// src/components/coach/createprogram/builders/DaySummary.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WorkoutDayItem } from './WorkoutDay';

interface DaySummaryProps {
  items: WorkoutDayItem[];
}

const DaySummary: React.FC<DaySummaryProps> = ({ items }) => {
  const formatSetsReps = (item: WorkoutDayItem) => {
    if (item.exercise.type !== 'exercise') return '';
    const sets = item.sets.length;
    const reps = item.reps.join(', ');
    return `${sets}x${reps}`;
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 h-full">
      <h3 className="text-xl font-bold">Daily Overview</h3>
      <div className="space-y-4 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-25rem)]">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.exercise.id + index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              <div className="font-semibold text-foreground shrink-0 w-24">
                {item.exercise.type.charAt(0).toUpperCase() + item.exercise.type.slice(1)}:
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">{item.exercise.name}</span>
                {item.exercise.type === 'exercise' && (
                  <span className="ml-2 text-muted-foreground">
                    - {item.sets.length} sets
                  </span>
                )}
                {item.comment && (
                  <p className="italic text-xs mt-1 truncate max-w-full">"{item.comment}"</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DaySummary;
