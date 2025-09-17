// src/components/coach/createprogram/builders/CalendarHeader.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarHeaderProps {
  currentDay: string;
  onDayChange: (day: string) => void;
}

const getWeekDays = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const sortedDays = days.slice(todayIndex).concat(days.slice(0, todayIndex));
  return sortedDays;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDay, onDayChange }) => {
  const [offset, setOffset] = useState(0);
  const weekDays = getWeekDays();

  const handleNextWeek = () => setOffset(prev => prev + 1);
  const handlePrevWeek = () => setOffset(prev => prev - 1);

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-xl shadow-sm border">
      <Button variant="ghost" size="icon" onClick={handlePrevWeek}><ChevronLeft /></Button>
      <div className="flex-1 flex overflow-x-auto no-scrollbar justify-between items-center gap-2 md:gap-4">
        {weekDays.map(day => (
          <motion.div
            key={day}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors duration-200",
              currentDay === day ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
            onClick={() => onDayChange(day)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">{day.slice(0, 3)}</span>
            <span className="text-xs">{new Date().getDate()}</span> {/* simplified for example */}
          </motion.div>
        ))}
      </div>
      <Button variant="ghost" size="icon" onClick={handleNextWeek}><ChevronRight /></Button>
    </div>
  );
};

export default CalendarHeader;
