// src/components/coach/createprogram/builders/FitnessBuilder.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import WorkoutDay from './WorkoutDay';
import { mockExercises, ExerciseItem } from '@/mockdata/createprogram/mockExercises';

interface WorkoutDayData {
  items: any[];
}

interface FitnessBuilderProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FitnessBuilder: React.FC<FitnessBuilderProps> = ({ onBack, onSave }) => {
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [workoutData, setWorkoutData] = useState<{ [day: string]: WorkoutDayData }>({});
  const [searchResults, setSearchResults] = useState<ExerciseItem[]>([]);

  const handleToggleDay = (day: string) => {
    setActiveDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  const handleUpdateItems = (day: string, items: any[]) => {
    setWorkoutData(prevData => ({
      ...prevData,
      [day]: { items },
    }));
  };

  const handleSearch = (query: string) => {
    if (query.length > 2) {
      const results = mockExercises.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onSave(workoutData)} className="gap-2">
          <Check className="h-4 w-4" /> Save Program
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Select Workout Days</h2>
        <div className="flex flex-wrap gap-2">
          {weekDays.map(day => (
            <Button
              key={day}
              variant={activeDays.includes(day) ? 'default' : 'outline'}
              onClick={() => handleToggleDay(day)}
              className="rounded-full"
            >
              {day}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {activeDays.map(day => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <WorkoutDay
                day={day}
                items={workoutData[day]?.items || []}
                onItemsChange={(items) => handleUpdateItems(day, items)}
                onSearch={handleSearch}
                searchResults={searchResults}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FitnessBuilder;
