// src/components/coach/createprogram/builders/ExerciseLibrary.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ExerciseItem, ExerciseType } from '@/mockdata/createprogram/mockExercises';
import { cn } from '@/lib/utils';

interface ExerciseLibraryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ExerciseItem[];
  onSelect: (item: ExerciseItem) => void;
  onSearch: (query: string) => void;
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

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ searchQuery, setSearchQuery, searchResults, onSelect, onSearch }) => {

  useEffect(() => {
    // This hook ensures the search function is called whenever the searchQuery changes.
    // It is essential for the search results to appear.
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className="space-y-4 h-full flex flex-col p-4 md:p-6">
      <h3 className="text-xl font-bold">Exercise Library</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto">
        <AnimatePresence>
          {searchResults.length > 0 ? (
            searchResults.map((exercise) => (
              <motion.div
                key={exercise.id}
                onClick={() => onSelect(exercise)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getBadgeColor(exercise.type))}>
                      {exercise.type}
                    </span>
                    <span className="font-semibold text-sm">{exercise.name}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {searchQuery.length > 2 ? 'No exercises found.' : 'Start typing to search...'}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
