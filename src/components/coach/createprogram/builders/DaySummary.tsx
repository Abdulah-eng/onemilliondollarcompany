'use client';

import React from 'react';
import { WorkoutDayItem } from './WorkoutDay';
import { cn } from '@/lib/utils';

interface DaySummaryProps {
  items: WorkoutDayItem[];
}

// Helper: map weekday numbers (0 = Sunday) to names
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DaySummary: React.FC<DaySummaryProps> = ({ items }) => {
  // Group exercises by weekday
  const exercisesByDay: Record<string, WorkoutDayItem[]> = {};
  items.forEach((item) => {
    const dayName = daysOfWeek[new Date(item.date).getDay()]; // assumes item.date exists
    if (!exercisesByDay[dayName]) {
      exercisesByDay[dayName] = [];
    }
    exercisesByDay[dayName].push(item);
  });

  return (
    <div className="p-4 md:p-6 space-y-6 h-full relative">
      <h3 className="text-xl font-bold">Weekly Overview</h3>

      {/* Weekdays row with indicators */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day) => {
          const hasExercises = !!exercisesByDay[day];
          return (
            <div key={day} className="relative p-2 rounded-lg border bg-card">
              <span className="block text-sm font-medium">{day}</span>
              {hasExercises && (
                <span
                  className={cn(
                    "absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed items */}
      <div className="space-y-4 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-25rem)]">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border shadow-sm"
            >
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  {item.exercise.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>Add exercises to see a summary.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySummary;
