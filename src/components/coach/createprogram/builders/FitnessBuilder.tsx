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

  // Handle exercise search with enhanced filtering
  const handleSearch = useCallback((query: string, filterType?: any, muscleGroup?: string) => {
    let filtered = mockExercises;

    // Filter by exercise type
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(exercise => exercise.type === filterType);
    }

    // Filter by muscle group
    if (muscleGroup && muscleGroup !== 'all') {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroups.some(group => 
          group.toLowerCase() === muscleGroup.toLowerCase()
        )
      );
    }

    // Text search across name, description, and muscle groups
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.description.toLowerCase().includes(searchTerm) ||
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(searchTerm)
        )
      );
    }

    setSearchResults(filtered);
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
      className="flex-1 flex flex-col"
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
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 lg:gap-4 bg-card rounded-xl shadow-md border">
        {/* Date Selector Header (Desktop only) */}
        <div className="hidden lg:block lg:col-span-5 border-b border-border p-4">
          <DateCircles activeDay={activeDay} onDayChange={setActiveDay} />
        </div>

        {/* Left Column: Search & Library (Desktop only) - Compact for smaller width */}
        <div className="hidden lg:block lg:col-span-1 border-r border-border min-h-[calc(100vh-4rem)] overflow-y-auto bg-muted/20">
          <ExerciseLibrary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSelect={handleSelectExercise}
            onSearch={handleSearch}
            allExercises={mockExercises}
          />
        </div>

        {/* Middle Column: Workout Day - Now dominant */}
        <div className="lg:col-span-3 flex-1 p-4 md:p-6 lg:p-8 space-y-4">
          {/* Date selector (mobile/tablet only) */}
          <div className="mb-4 lg:hidden">
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
        <div className="hidden lg:block lg:col-span-1 border-l border-border min-h-[calc(100vh-4rem)] overflow-y-auto">
          <DaySummary items={currentDayItems} />
        </div>
      </div>

      {/* Mobile and Tablet Layout with Bottom Drawer - Enhanced */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] sm:h-[80vh] overflow-hidden pb-safe">
          <SheetHeader className="pb-4 border-b sticky top-0 bg-background z-10">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
            <SheetTitle className="text-lg font-semibold">Add Exercise</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-80px)] overflow-hidden mt-4">
            <ExerciseLibrary
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSelect={handleSelectExercise}
              onSearch={handleSearch}
              allExercises={mockExercises}
            />
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default FitnessBuilder;
