// src/components/coach/createprogram/builders/FitnessBuilder.tsx
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react'; // ADD useMemo
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import WorkoutDay, { WorkoutDayItem } from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';
import ExerciseLibrary from './ExerciseLibrary';
import DaySummary from './DaySummary';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DateCircles from './DateCircles';
import { format, startOfWeek, addDays } from 'date-fns'; // ADD format, startOfWeek, addDays

interface FitnessBuilderProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const FitnessBuilder: React.FC<FitnessBuilderProps> = ({ onBack, onSave }) => {
  // CHANGE initial state to use a date, not a string day name
  const initialActiveDay = format(new Date(), 'yyyy-MM-dd');
  const [activeDay, setActiveDay] = useState(initialActiveDay); 
  
  // Map from ISO date string (yyyy-MM-dd) to WorkoutDayItem[]
  const [workoutData, setWorkoutData] = useState<{ [date: string]: WorkoutDayItem[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExerciseItem[]>(mockExercises);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Function to find the day name for a given ISO date
  const getDayName = (isoDate: string) => format(new Date(isoDate), 'EEEE');

  const handleUpdateItems = useCallback((date: string, items: WorkoutDayItem[]) => {
    setWorkoutData(prevData => ({
      ...prevData,
      [date]: items.map(item => ({...item, date: date})), // Ensure item date is updated, although not strictly needed for this logic
    }));
  }, []);

  // ... (handleSearch, useEffect, handleSelectExercise remain the same, 
  // but ensure handleSelectExercise uses activeDay which is now an ISO date)

  const handleSelectExercise = (exercise: ExerciseItem) => {
    const newItem: WorkoutDayItem = {
      id: `${exercise.id}-${Date.now()}`,
      exercise: exercise,
      sets: [0],
      reps: [0],
      comment: '',
      date: activeDay, // Add date field
    };
    const itemsForDay = workoutData[activeDay]
      ? [...workoutData[activeDay]]
      : [];
    itemsForDay.push(newItem);
    handleUpdateItems(activeDay, itemsForDay);
    setIsSheetOpen(false);
  };


  const currentDayItems = workoutData[activeDay] || [];

  // NEW: Compute the list of dates that have exercises
  const exerciseDates = useMemo(() => {
    return Object.entries(workoutData)
      .filter(([, items]) => items.length > 0)
      .map(([date]) => date);
  }, [workoutData]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      {/* ... Action Bar ... */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 lg:gap-4 bg-card rounded-xl shadow-md border">
        {/* Date Selector Header (Desktop only) */}
        <div className="hidden lg:block lg:col-span-5 border-b border-border p-4">
          {/* PASS exerciseDates prop */}
          <DateCircles activeDay={activeDay} onDayChange={setActiveDay} exerciseDates={exerciseDates} />
        </div>

        {/* ... Left Column ... */}

        {/* Middle Column: Workout Day - Now dominant */}
        <div className="lg:col-span-3 flex-1 p-4 md:p-6 lg:p-8 space-y-4">
          {/* Date selector (mobile/tablet only) */}
          <div className="mb-4 lg:hidden">
            {/* PASS exerciseDates prop */}
            <DateCircles activeDay={activeDay} onDayChange={setActiveDay} exerciseDates={exerciseDates} />
          </div>

          <WorkoutDay
            day={getDayName(activeDay)} // Pass the day name for display
            items={currentDayItems}
            onItemsChange={items => handleUpdateItems(activeDay, items)}
            onAddClick={() => setIsSheetOpen(true)}
          />
        </div>

        {/* ... Right Column & Sheet ... */}
      </div>
    </motion.div>
  );
};

export default FitnessBuilder;
