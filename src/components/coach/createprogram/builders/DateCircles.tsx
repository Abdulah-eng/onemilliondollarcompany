'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek } from 'date-fns';

interface DateCirclesProps {
  activeDay: string; // ISO date string "yyyy-MM-dd"
  onDayChange: (day: string) => void;
  exerciseDates?: string[]; // list of ISO date strings with exercises
}

const DateCircles: React.FC<DateCirclesProps> = ({ activeDay, onDayChange, exerciseDates = [] }) => {
  const [currentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const week = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <div className="flex justify-center py-4 bg-background/50 backdrop-blur-sm rounded-xl px-2">
      <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto scroll-pl-4 scroll-pr-4">
        {week.map((date, index) => {
          const isoDate = format(date, 'yyyy-MM-dd');
          const dayName = format(date, 'EEE'); // Mon, Tue, etc.
          const dayNumber = format(date, 'd');
          const isToday = isoDate === format(new Date(), 'yyyy-MM-dd');
          const hasExercises = exerciseDates.includes(isoDate);

          return (
            <motion.div
              key={index}
              onClick={() => onDayChange(isoDate)}
              className={cn(
                "relative flex flex-col items-center p-2 rounded-full cursor-pointer transition-colors duration-200 min-w-[3rem] h-12 justify-center",
                activeDay === isoDate ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                isToday && "border-2 border-primary/50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-semibold">{dayName}</span>
              <span className="text-xs font-medium">{dayNumber}</span>

              {hasExercises && (
                <motion.span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DateCircles;
