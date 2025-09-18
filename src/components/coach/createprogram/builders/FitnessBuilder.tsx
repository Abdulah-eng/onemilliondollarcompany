'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import WorkoutDay, { WorkoutDayItem } from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';
import ExerciseLibrary from './ExerciseLibrary';
import DaySummary from './DaySummary';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DateCircles from './DateCircles';

interface FitnessBuilderProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const FitnessBuilder: React.FC<FitnessBuilderProps> = ({ onBack, onSave }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [workoutData, setWorkoutData] = useState<{ [day: string]: WorkoutDayItem[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExerciseItem[]>(mockExercises);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleUpdateItems = useCallback((day: string, items: WorkoutDayItem[]) => {
    setWorkoutData(prevData => ({
      ...prevData,
      [day]: items,
    }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    const results =
      query.length > 0
        ? mockExercises.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : mockExercises;
    setSearchResults(results);
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleSelectExercise = (exercise: ExerciseItem) => {
    const newItem: WorkoutDayItem = {
      id: `${exercise.id}-${Date.now()}`,
      exercise: exercise,
      sets: [0],
      reps: [0],
      comment: '',
    };
    const itemsForDay = workoutData[activeDay]
      ? [...workoutData[activeDay]]
      : [];
    itemsForDay.push(newItem);
    handleUpdateItems(activeDay, itemsForDay);
    setIsSheetOpen(false);
  };

  const currentDayItems = workoutData[activeDay] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col h-[calc(100vh-100px)]"
    >
      {/* Action Bar (mobile/tablet) */}
      <div className="flex md:hidden items-center justify-between p-4 bg-card rounded-xl shadow-md border mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(workoutData)}
          className="gap-2 shrink-0"
        >
          <Check className="h-4 w-4" /> Save Program
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 lg:gap-0 bg-card rounded-xl shadow-md border">
        {/* Left Column: Search & Library (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 border-r border-border h-full">
          <ExerciseLibrary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSelect={handleSelectExercise}
            onSearch={handleSearch}
          />
        </div>

        {/* Middle Column: Workout Day */}
        <div className="lg:col-span-1 flex-1 p-4 md:p-6 space-y-4">
          <div className="mb-4">
            <DateCircles activeDay={activeDay} onDayChange={setActiveDay} />
          </div>

          <WorkoutDay
            day={activeDay}
            items={currentDayItems}
            onItemsChange={items => handleUpdateItems(activeDay, items)}
            onAddClick={() => setIsSheetOpen(true)}
          />
        </div>

        {/* Right Column: Day Summary (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 border-l border-border h-full">
          <DaySummary items={currentDayItems} />
        </div>
      </div>

      {/* Mobile and Tablet Layout with Bottom Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Add Exercise</SheetTitle>
          </SheetHeader>
          <div className="w-full">
            {/* Only ExerciseLibrary on mobile/tablet */}
            <ExerciseLibrary
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSelect={handleSelectExercise}
              onSearch={handleSearch}
            />
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default FitnessBuilder;
