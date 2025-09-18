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
    case 'balance':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelect,
  onSearch,
}) => {
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className="space-y-4 h-full flex flex-col p-4 md:p-6">
      <h3 className="text-xl font-bold">Exercise Library</h3>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
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
                className="group flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-card shadow-sm hover:shadow-lg transition cursor-pointer hover:-translate-y-1"
              >
                {/* Image / Icon */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {exercise.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {exercise.name}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-semibold capitalize',
                        getBadgeColor(exercise.type)
                      )}
                    >
                      {exercise.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Muscle: {exercise.muscleGroups?.[0] || 'General'}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {searchQuery.length > 2
                ? 'No exercises found.'
                : 'Start typing to search...'}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
