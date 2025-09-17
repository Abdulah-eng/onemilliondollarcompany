// src/components/coach/createprogram/builders/FitnessBuilder.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, PanelLeft } from 'lucide-react';
import WorkoutDay, { WorkoutDayItem } from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';
import ExerciseLibrary from './ExerciseLibrary';
import DaySummary from './DaySummary';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';

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

  const handleUpdateItems = useCallback((day: string, items: WorkoutDayItem[]) => {
    setWorkoutData(prevData => ({
      ...prevData,
      [day]: items,
    }));
  }, []);

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

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Dragging from library to workout day
    if (source.droppableId !== destination.droppableId) {
      const draggedItem = searchResults[source.index];
      if (!draggedItem) return;

      const newItem: WorkoutDayItem = {
        id: `${draggedItem.id}-${Date.now()}`,
        exercise: draggedItem,
        sets: [0],
        reps: [0],
      };

      const itemsForDay = workoutData[activeDay] ? [...workoutData[activeDay]] : [];
      itemsForDay.splice(destination.index, 0, newItem);
      handleUpdateItems(activeDay, itemsForDay);
      return;
    }
    
    // Reordering within the workout day
    const itemsForDay = [...(workoutData[activeDay] || [])];
    const [reorderedItem] = itemsForDay.splice(source.index, 1);
    itemsForDay.splice(destination.index, 0, reorderedItem);
    handleUpdateItems(activeDay, itemsForDay);
  };

  const currentDayItems = workoutData[activeDay] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-100px)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex-1 flex overflow-x-auto gap-2 md:gap-4 justify-center">
          {weekDays.map(day => (
            <Button
              key={day}
              variant={activeDay === day ? 'default' : 'outline'}
              onClick={() => setActiveDay(day)}
              className="rounded-full"
            >
              {day}
            </Button>
          ))}
        </div>
        <Button onClick={() => onSave(workoutData)} className="gap-2">
          <Check className="h-4 w-4" /> Save Program
        </Button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 flex-1">
          {/* Left Column: Search & Library */}
          <div className="lg:col-span-1">
            <Droppable droppableId="exercise-library" isDropDisabled>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="h-full">
                  <ExerciseLibrary
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Middle Column: Workout Day */}
          <div className="lg:col-span-1">
            <WorkoutDay
              day={activeDay}
              items={currentDayItems}
              onItemsChange={(items) => handleUpdateItems(activeDay, items)}
            />
          </div>

          {/* Right Column: Day Summary */}
          <div className="lg:col-span-1">
            <DaySummary items={currentDayItems} />
          </div>
        </div>

        {/* Mobile and Tablet Layout with Bottom Drawer */}
        <div className="lg:hidden flex flex-col flex-1">
          {/* Main Column */}
          <div className="flex-1">
            <WorkoutDay
              day={activeDay}
              items={currentDayItems}
              onItemsChange={(items) => handleUpdateItems(activeDay, items)}
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
              </SheetHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1 h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-4">Exercise Library</h3>
                  <Droppable droppableId="exercise-library" isDropDisabled>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 h-full">
                        <ExerciseLibrary
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          searchResults={searchResults}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                <div className="md:col-span-1 h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-4">Daily Overview</h3>
                  <DaySummary items={currentDayItems} />
                </div>
              </div>
            </SheetContent>
            </Sheet>
        </div>
      </DragDropContext>
    </motion.div>
  );
};

export default FitnessBuilder;
