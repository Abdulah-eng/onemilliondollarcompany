// src/components/coach/createprogram/builders/FitnessBuilder.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Plus, GripVertical, X, ArrowLeft } from 'lucide-react';
import WorkoutDay, { WorkoutDayItem } from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';
import ExerciseLibrary from './ExerciseLibrary';
import DaySummary from './DaySummary';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const handleSelectExercise = (exercise: ExerciseItem) => {
    const newItem: WorkoutDayItem = {
      id: `${exercise.id}-${Date.now()}`,
      exercise: exercise,
      sets: [0],
      reps: [0],
      comment: ''
    };
    const itemsForDay = workoutData[activeDay] ? [...workoutData[activeDay]] : [];
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
      className="flex-1 flex flex-col h-[calc(100vh-100px)] space-y-4"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-md border">
        <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex-1 flex overflow-x-auto gap-2 md:gap-4 justify-center">
          {weekDays.map(day => (
            <Button
              key={day}
              variant={activeDay === day ? 'default' : 'outline'}
              onClick={() => setActiveDay(day)}
              className="rounded-full shrink-0"
            >
              {day}
            </Button>
          ))}
        </div>
        <Button onClick={() => onSave(workoutData)} className="gap-2 shrink-0">
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{activeDay}</h3>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={() => setIsSheetOpen(true)} className="gap-2 lg:hidden">
                            <Plus className="h-4 w-4" /> Add Exercise
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                        <SheetHeader className="mb-4">
                            <SheetTitle>Add Exercise & Summary</SheetTitle>
                        </SheetHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <ExerciseLibrary
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    searchResults={searchResults}
                                    onSelect={handleSelectExercise}
                                    onSearch={handleSearch}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <DaySummary items={currentDayItems} />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <Button onClick={() => setIsSheetOpen(true)} className="gap-2 hidden lg:inline-flex">
                    <Plus className="h-4 w-4" /> Add Exercise
                </Button>
            </div>

            <div className="space-y-4 min-h-[100px] border-2 border-dashed border-gray-200 rounded-xl p-4">
                <AnimatePresence>
                    {currentDayItems.length > 0 ? (
                      currentDayItems.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 border rounded-lg relative group bg-card"
                          layout
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className={cn("text-sm px-2 py-1 rounded-full font-medium", item.exercise.type === 'exercise' ? 'bg-green-100 text-green-700' : item.exercise.type === 'warm-up' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}>
                                {item.exercise.type}
                              </span>
                              <span className="font-semibold text-lg flex-1 truncate">{item.exercise.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-50 hover:opacity-100"
                              onClick={() => handleRemoveItem(itemIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
          
                          {item.exercise.type === 'exercise' && (
                            <div className="space-y-3">
                              {item.sets.map((setVal, setIndex) => (
                                <motion.div
                                  key={setIndex}
                                  className="flex gap-2 items-end"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <div className="flex-1">
                                    <label className="block text-xs text-muted-foreground">Set {setIndex + 1}</label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Sets"
                                        value={item.sets[setIndex]}
                                        onChange={(e) => {
                                          const newSets = [...item.sets];
                                          newSets[setIndex] = parseInt(e.target.value) || 0;
                                          const updatedItems = [...currentDayItems];
                                          updatedItems[itemIndex].sets = newSets;
                                          handleUpdateItems(activeDay, updatedItems);
                                        }}
                                        className="w-full text-base"
                                      />
                                      <Input
                                        type="number"
                                        placeholder="Reps"
                                        value={item.reps[setIndex]}
                                        onChange={(e) => {
                                          const newReps = [...item.reps];
                                          newReps[setIndex] = parseInt(e.target.value) || 0;
                                          const updatedItems = [...currentDayItems];
                                          updatedItems[itemIndex].reps = newReps;
                                          handleUpdateItems(activeDay, updatedItems);
                                        }}
                                        className="w-full text-base"
                                      />
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    const updatedItems = [...currentDayItems];
                                    if (updatedItems[itemIndex].sets.length > 1) {
                                      updatedItems[itemIndex].sets.splice(setIndex, 1);
                                      updatedItems[itemIndex].reps.splice(setIndex, 1);
                                      handleUpdateItems(activeDay, updatedItems);
                                    }
                                  }}>
                                    <X className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </motion.div>
                              ))}
                              <Button variant="outline" className="w-full gap-2" onClick={() => {
                                const updatedItems = [...currentDayItems];
                                updatedItems[itemIndex].sets.push(0);
                                updatedItems[itemIndex].reps.push(0);
                                handleUpdateItems(activeDay, updatedItems);
                              }}>
                                <Plus className="h-4 w-4" /> Add Set
                              </Button>
                            </div>
                          )}
                          
                          <div className="mt-4 space-y-2">
                            <Label>Optional Comment</Label>
                            <Textarea
                              placeholder="e.g., Use light weights for this warm-up set."
                              value={item.comment}
                              onChange={(e) => {
                                const updatedItems = [...currentDayItems];
                                updatedItems[itemIndex].comment = e.target.value;
                                handleUpdateItems(activeDay, updatedItems);
                              }}
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-12">
                          <Plus className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30"/>
                          <p className="font-semibold">Start building your workout</p>
                          <p className="text-sm">Add exercises to {activeDay} to get started.</p>
                      </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Right Column: Day Summary (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 border-l border-border h-full">
          <DaySummary items={currentDayItems} />
        </div>
      </div>
    </motion.div>
  );
};

export default FitnessBuilder;
