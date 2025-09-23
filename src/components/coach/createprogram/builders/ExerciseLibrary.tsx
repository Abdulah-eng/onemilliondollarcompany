// src/components/coach/createprogram/builders/ExerciseLibrary.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Corrected import
import { Search, Filter, Dumbbell, Heart, Utensils, Zap, X } from 'lucide-react';
import { ExerciseItem, ExerciseType } from '@/mockdata/createprogram/mockExercises';
import { cn } from '@/lib/utils';

interface ExerciseLibraryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ExerciseItem[];
  onSelect: (item: ExerciseItem) => void;
  onSearch: (query: string, filterType?: ExerciseType | 'all', muscleGroup?: string) => void;
  allExercises: ExerciseItem[];
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

const getIconForType = (type: ExerciseType) => {
  switch (type) {
    case 'warm-up':
      return <Heart className="h-4 w-4" />;
    case 'exercise':
      return <Dumbbell className="h-4 w-4" />;
    case 'stretch':
      return <Utensils className="h-4 w-4" />;
    default:
      return <Filter className="h-4 w-4" />;
  }
};

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelect,
  onSearch,
  allExercises,
}) => {
  const [filterType, setFilterType] = useState<ExerciseType | 'all'>('all');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('all');

  // Get unique muscle groups from all exercises
  const uniqueMuscleGroups = React.useMemo(() => {
    const groups = new Set<string>();
    allExercises.forEach(exercise => {
      exercise.muscleGroups.forEach(group => {
        if (group) groups.add(group);
      });
    });
    return Array.from(groups).sort();
  }, [allExercises]);

  useEffect(() => {
    onSearch(searchQuery, filterType, muscleGroupFilter);
  }, [searchQuery, filterType, muscleGroupFilter, onSearch]);

  const handleClearFilters = () => {
    setFilterType('all');
    setMuscleGroupFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterType !== 'all' || muscleGroupFilter !== 'all' || searchQuery.length > 0;

  return (
    <div className="space-y-3 sm:space-y-4 h-full flex flex-col p-3 sm:p-4 md:p-6">
      <h3 className="text-lg sm:text-xl font-bold">Exercise Library</h3>

      {/* Search + Filter Row */}
      <div className="space-y-3 sm:space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, muscle groups, descriptions..."
            className="pl-9 w-full h-11 sm:h-10 text-base sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Row - Mobile optimized */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2 flex-1">
            {/* Exercise Type Filter */}
            <Select value={filterType} onValueChange={(val) => setFilterType(val as ExerciseType | 'all')}>
              <SelectTrigger className="flex-1 sm:w-44 h-11 sm:h-10 text-base sm:text-sm">
                <Filter className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Exercise Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="warm-up">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-700" /> Warm-up
                  </div>
                </SelectItem>
                <SelectItem value="exercise">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-green-700" /> Exercise
                  </div>
                </SelectItem>
                <SelectItem value="stretch">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-purple-700" /> Stretch
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Muscle Group Filter */}
            <Select value={muscleGroupFilter} onValueChange={setMuscleGroupFilter}>
              <SelectTrigger className="flex-1 sm:w-44 h-11 sm:h-10 text-base sm:text-sm">
                <Zap className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscles</SelectItem>
                {uniqueMuscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    <div className="flex items-center gap-2 capitalize">
                      <Zap className="h-3 w-3" />
                      {group}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button - Mobile optimized */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 text-base sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap bg-background border border-border rounded-md min-h-[44px] sm:min-h-auto touch-manipulation"
            >
              <X className="h-4 w-4 sm:h-3 sm:w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="text-sm sm:text-xs text-muted-foreground px-1">
            Showing {searchResults.length} exercise{searchResults.length !== 1 ? 's' : ''}
            {filterType !== 'all' && ` • Type: ${filterType}`}
            {muscleGroupFilter !== 'all' && ` • Muscle: ${muscleGroupFilter}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Exercise Cards - Mobile optimized */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2">
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
                className="group flex items-center gap-3 sm:gap-4 p-4 rounded-xl border border-gray-200 bg-card shadow-sm hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 min-h-[80px] sm:min-h-[64px] touch-manipulation active:scale-[0.98]"
              >
                {/* Image Placeholder - Mobile optimized */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={`https://via.placeholder.com/64?text=${exercise.name.charAt(0).toUpperCase()}`}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content - Mobile optimized */}
                <div className="flex-1 flex flex-col justify-center min-w-0 gap-1">
                  <div className="flex items-start justify-between mb-1 sm:mb-1">
                    <h4 className="text-base sm:text-sm font-semibold text-foreground leading-tight pr-2">
                      {exercise.name}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium capitalize flex items-center gap-1 shrink-0',
                        getBadgeColor(exercise.type)
                      )}
                    >
                      {getIconForType(exercise.type)}
                      <span className="hidden sm:inline-block">{exercise.type}</span>
                    </span>
                  </div>
                  <p className="text-sm sm:text-xs text-muted-foreground leading-relaxed">
                    {exercise.muscleGroups.length > 0 
                      ? `Muscles: ${exercise.muscleGroups.slice(0, 2).join(', ')}${exercise.muscleGroups.length > 2 ? '...' : ''}`
                      : 'General exercise'
                    }
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 sm:p-4 text-center text-muted-foreground">
              <div className="text-base sm:text-sm">
                {searchQuery.length > 2
                  ? 'No exercises found.'
                  : 'Start typing to search...'}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
