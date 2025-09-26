// src/components/coach/createprogram/builders/DateCircles.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek } from 'date-fns';
import WeekSelector from './WeekSelector'; // Import the new selector

// Define the days of the week based on starting Monday
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MAX_WEEKS = 4;

interface DateCirclesProps {
  activeDay: string;
  onDayChange: (day: string) => void;
  // New props for week management
  activeWeek: number;
  onWeekChange: (week: number) => void;
}

const DateCircles: React.FC<DateCirclesProps> = ({ activeDay, onDayChange, activeWeek, onWeekChange }) => {
  // Original date logic is simplified/removed, but we keep format/startOfWeek for calculation stability (optional)
  // We can simplify this to just map the weekday names, as the date numbers are no longer strictly relevant 
  // for a programmatic builder where "Monday" means "Week X, Day 1."
  
  // We'll calculate the date numbers for display just to keep the visual style similar
  const [currentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const week = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <div className="flex flex-col gap-2">
      {/* Week Selector component */}
      <WeekSelector
        currentWeek={activeWeek}
        maxWeeks={MAX_WEEKS}
        onWeekChange={onWeekChange}
      />
      
      {/* Day Circles */}
      <div className="flex justify-center py-4 bg-background/50 backdrop-blur-sm rounded-xl px-2">
        <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto scroll-pl-4 scroll-pr-4">
          {week.map((date, index) => {
            const dayName = WEEK_DAYS[index]; // Use fixed day names
            const dayNumber = format(date, 'd');
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && activeWeek === 1; // Only show 'today' marker for Week 1

            return (
              <motion.div
                key={dayName}
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
    </div>
  );
};

export default DateCircles;
