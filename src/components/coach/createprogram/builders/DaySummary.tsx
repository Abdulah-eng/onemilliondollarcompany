'use client';

import React from 'react';
import { WorkoutDayItem } from './WorkoutDay';
import { Dumbbell, Heart, Utensils } from 'lucide-react';

interface DaySummaryProps {
  items: WorkoutDayItem[];
  activeDay: string; // ISO date string
}

const DaySummary: React.FC<DaySummaryProps> = ({ items, activeDay }) => {
  // filter items for active day
  const dayItems = items.filter(
    (item) => item.date && item.date.startsWith(activeDay) // match yyyy-MM-dd
  );

  return (
    <div className="p-4 md:p-6 space-y-6 h-full relative">
      <h3 className="text-xl font-bold">Daily Overview</h3>

      <div className="space-y-4 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-25rem)]">
        {dayItems.length > 0 ? (
          dayItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border shadow-sm"
            >
              <div className="shrink-0 pt-1">
                {item.exercise.type === 'exercise' && (
                  <Dumbbell className="h-4 w-4 text-primary" />
                )}
                {item.exercise.type === 'warm-up' && (
                  <Heart className="h-4 w-4 text-primary" />
                )}
                {item.exercise.type === 'stretch' && (
                  <Utensils className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  {item.exercise.name}
                </span>
                {item.exercise.type === 'exercise' && (
                  <span className="ml-2 text-muted-foreground">
                    - {item.sets.length} sets
                  </span>
                )}
                {item.comment && (
                  <p className="italic text-xs mt-1 truncate max-w-full">
                    "{item.comment}"
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No exercises for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySummary;
