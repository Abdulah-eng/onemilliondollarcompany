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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 h-full flex flex-col p-3 sm:p-4 lg:p-6 xl:p-8">
      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">Exercise Library</h3>

      {/* Search + Filter Row - Desktop Enhanced */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, muscle groups, descriptions..."
            className="pl-9 w-full h-11 sm:h-10 lg:h-11 xl:h-12 text-base sm:text-sm lg:text-base xl:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Section - Desktop Enhanced Layout */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch lg:gap-4">
          <div className="flex gap-2 flex-1 lg:flex-col lg:gap-3">
            {/* Exercise Type Filter - Desktop Enhanced */}
            <Select value={filterType} onValueChange={(val) => setFilterType(val as ExerciseType | 'all')}>
              <SelectTrigger className="flex-1 sm:w-44 lg:w-full h-11 sm:h-10 lg:h-11 xl:h-12 text-base sm:text-sm lg:text-base xl:text-lg">
                <Filter className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground mr-2" />
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

            {/* Muscle Group Filter - Desktop Enhanced */}
            <Select value={muscleGroupFilter} onValueChange={setMuscleGroupFilter}>
              <SelectTrigger className="flex-1 sm:w-44 lg:w-full h-11 sm:h-10 lg:h-11 xl:h-12 text-base sm:text-sm lg:text-base xl:text-lg">
                <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground mr-2" />
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

          {/* Clear Filters Button - Desktop Enhanced */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-base sm:text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-foreground transition-all duration-200 whitespace-nowrap bg-background hover:bg-muted border border-border rounded-md min-h-[44px] sm:min-h-auto lg:min-h-[48px] xl:min-h-[52px] touch-manipulation hover:shadow-sm"
            >
              <X className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              <span className="lg:inline">Clear Filters</span>
            </button>
          )}
        </div>

        {/* Active Filters Summary - Desktop Enhanced */}
        {hasActiveFilters && (
          <div className="text-sm sm:text-xs lg:text-sm text-muted-foreground px-1 lg:px-3 lg:py-2 lg:bg-muted/30 lg:rounded-lg lg:border">
            <span className="font-medium">Showing {searchResults.length} exercise{searchResults.length !== 1 ? 's' : ''}</span>
            {filterType !== 'all' && <span className="lg:block"> • Type: <span className="font-medium capitalize">{filterType}</span></span>}
            {muscleGroupFilter !== 'all' && <span className="lg:block"> • Muscle: <span className="font-medium capitalize">{muscleGroupFilter}</span></span>}
            {searchQuery && <span className="lg:block"> • Search: <span className="font-medium">"{searchQuery}"</span></span>}
          </div>
        )}
      </div>

      {/* Exercise Cards - Desktop Enhanced */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 lg:space-y-4 pr-1 sm:pr-2 lg:pr-3">
        <AnimatePresence>
          {searchResults.length > 0 ? (
            searchResults.map((exercise) => (
              <motion.div
                key={exercise.id}
                onClick={() => onSelect(exercise)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group flex items-center gap-3 sm:gap-4 lg:gap-5 p-4 lg:p-5 xl:p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 min-h-[80px] sm:min-h-[64px] lg:min-h-[96px] xl:min-h-[112px] touch-manipulation active:scale-[0.98] hover:bg-card/80"
              >
                {/* Image Placeholder - Desktop Enhanced */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex-shrink-0 rounded-lg lg:rounded-xl overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={`https://via.placeholder.com/96?text=${exercise.name.charAt(0).toUpperCase()}`}
                    alt={exercise.name}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                </div>

                {/* Content - Desktop Enhanced */}
                <div className="flex-1 flex flex-col justify-center min-w-0 gap-1 lg:gap-2">
                  <div className="flex items-start justify-between mb-1 sm:mb-1 lg:mb-2">
                    <h4 className="text-base sm:text-sm lg:text-lg xl:text-xl font-semibold text-foreground leading-tight pr-2 group-hover:text-primary transition-colors duration-200">
                      {exercise.name}
                    </h4>
                    <span
                      className={cn(
                        'text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5 rounded-full font-medium capitalize flex items-center gap-1 lg:gap-2 shrink-0 shadow-sm',
                        getBadgeColor(exercise.type)
                      )}
                    >
                      {getIconForType(exercise.type)}
                      <span className="hidden sm:inline-block lg:inline-block">{exercise.type}</span>
                    </span>
                  </div>
                  <p className="text-sm sm:text-xs lg:text-sm xl:text-base text-muted-foreground leading-relaxed">
                    {exercise.description && exercise.description.length > 0 
                      ? `${exercise.description.slice(0, 80)}${exercise.description.length > 80 ? '...' : ''}`
                      : exercise.muscleGroups.length > 0 
                        ? `Targets: ${exercise.muscleGroups.slice(0, 3).join(', ')}${exercise.muscleGroups.length > 3 ? '...' : ''}`
                        : 'General exercise'
                    }
                  </p>
                  {exercise.muscleGroups.length > 0 && (
                    <div className="hidden lg:flex flex-wrap gap-1 mt-1">
                      {exercise.muscleGroups.slice(0, 4).map((muscle, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md capitalize">
                          {muscle}
                        </span>
                      ))}
                      {exercise.muscleGroups.length > 4 && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                          +{exercise.muscleGroups.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 sm:p-4 lg:p-12 text-center text-muted-foreground">
              <div className="text-base sm:text-sm lg:text-lg xl:text-xl font-medium">
                {searchQuery.length > 2
                  ? 'No exercises found matching your criteria.'
                  : 'Start typing to search exercises...'}
              </div>
              {searchQuery.length > 2 && (
                <p className="text-sm lg:text-base text-muted-foreground/80 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
