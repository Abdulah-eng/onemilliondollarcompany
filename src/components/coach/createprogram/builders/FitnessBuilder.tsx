// src/components/coach/createprogram/builders/FitnessBuilder.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, PanelLeft, PanelRight } from 'lucide-react';
import WorkoutDay from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';
import CalendarHeader from './CalendarHeader';
import ExerciseSearch from './ExerciseSearch';
import DaySummary from './DaySummary';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface WorkoutDayItem {
  exercise: ExerciseItem;
  comment?: string;
  sets: number[];
  reps: number[];
}

interface FitnessBuilderProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FitnessBuilder: React.FC<FitnessBuilderProps> = ({ onBack, onSave }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [workoutData, setWorkoutData] = useState<{ [day: string]: WorkoutDayItem[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExerciseItem[]>([]);

  const handleUpdateItems = (day: string, items: WorkoutDayItem[]) => {
    setWorkoutData(prevData => ({
      ...prevData,
      [day]: items,
    }));
  };

  const handleSearch = useCallback((query: string) => {
    if (query.length > 2) {
      const results = mockExercises.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleAddExercise = useCallback((exercise: ExerciseItem) => {
    const newItems = [...(workoutData[activeDay] || []), { exercise, sets: [0], reps: [0] }];
    handleUpdateItems(activeDay, newItems);
    setSearchQuery('');
  }, [activeDay, workoutData]);

  const currentDayItems = workoutData[activeDay] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onSave(workoutData)} className="gap-2">
          <Check className="h-4 w-4" /> Save Program
        </Button>
      </div>

      <div className="mb-6">
        <CalendarHeader
          currentDay={activeDay}
          onDayChange={setActiveDay}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 h-full">
        {/* Left Column: Search */}
        <div className="lg:col-span-1">
          <ExerciseSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onAddExercise={handleAddExercise}
          />
        </div>

        {/* Middle Column: Workout Day */}
        <div className="lg:col-span-1">
          <WorkoutDay
            day={activeDay}
            items={currentDayItems}
            onItemsChange={(items) => handleUpdateItems(activeDay, items)}
            onSearch={handleSearch}
            searchResults={searchResults}
          />
        </div>

        {/* Right Column: Day Summary */}
        <div className="lg:col-span-1">
          <DaySummary items={currentDayItems} />
        </div>
      </div>

      {/* Mobile and Tablet Layout with Bottom Drawer */}
      <div className="lg:hidden flex flex-col h-full gap-4">
        {/* Main Column */}
        <div className="flex-1">
          <WorkoutDay
            day={activeDay}
            items={currentDayItems}
            onItemsChange={(items) => handleUpdateItems(activeDay, items)}
            onSearch={handleSearch}
            searchResults={searchResults}
          />
        </div>

        {/* Bottom Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 h-16 w-16 md:h-12 md:w-12">
              <PanelLeft className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Builder Tools</SheetTitle>
              <SheetDescription>Search for exercises or view your daily summary.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold mb-4">Exercise Search</h3>
                <ExerciseSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  onAddExercise={handleAddExercise}
                />
              </div>
              <div className="md:col-span-1">
                <DaySummary items={currentDayItems} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
};

export default FitnessBuilder;
