'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek } from 'date-fns';

interface DateCirclesProps {
  activeDay: string;
  onDayChange: (day: string) => void;
}

const DateCircles: React.FC<DateCirclesProps> = ({ activeDay, onDayChange }) => {
  const [currentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const week = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <div className="flex justify-center py-4 bg-background/50 backdrop-blur-sm rounded-xl px-2">
      <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto scroll-pl-4 scroll-pr-4">
        {week.map((date, index) => {
          const dayName = format(date, 'EEEE');
          const dayNumber = format(date, 'd');
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <motion.div
              key={index}
              onClick={() => onDayChange(dayName)}
              className={cn(
                "flex flex-col items-center p-2 rounded-full cursor-pointer transition-colors duration-200 min-w-[3rem] h-12 justify-center",
                activeDay === dayName ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                isToday && "border-2 border-primary/50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-semibold">{dayName.slice(0, 3)}</span>
              <span className="text-xs font-medium">{dayNumber}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DateCircles;
