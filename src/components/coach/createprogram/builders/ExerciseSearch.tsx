// src/components/coach/createprogram/builders/ExerciseSearch.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { ExerciseItem, ExerciseType } from '@/mockdata/createprogram/mockExercises';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ExerciseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ExerciseItem[];
  onAddExercise: (exercise: ExerciseItem) => void;
}

const getBadgeColor = (type: ExerciseType) => {
  switch (type) {
    case 'warm-up':
      return 'bg-blue-100 text-blue-700';
    case 'exercise':
      return 'bg-green-100 text-green-700';
    case 'stretch':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ searchQuery, setSearchQuery, searchResults, onAddExercise }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Card className="p-4 space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        <AnimatePresence>
          {searchResults.length > 0 ? (
            searchResults.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getBadgeColor(exercise.type))}>
                      {exercise.type}
                    </span>
                    <span className="font-semibold">{exercise.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate max-w-[calc(100%-40px)]">{exercise.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onAddExercise(exercise)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {searchQuery.length > 2 ? 'No exercises found.' : 'Start typing to search...'}
            </div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ExerciseSearch;
