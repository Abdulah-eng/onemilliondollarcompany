'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Dumbbell, Heart, Utensils, Zap } from 'lucide-react';
import { ExerciseItem, ExerciseType } from '@/mockdata/createprogram/mockExercises';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ExerciseLibraryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ExerciseItem[];
  onSelect: (item: ExerciseItem) => void;
  onSearch: (query: string, filterType?: ExerciseType | 'all') => void;
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

const getIconForType = (type: ExerciseType) => {
  switch (type) {
    case 'warm-up':
      return <Heart className="h-4 w-4" />;
    case 'exercise':
      return <Dumbbell className="h-4 w-4" />;
    case 'stretch':
      return <Utensils className="h-4 w-4" />;
    case 'balance':
      return <Zap className="h-4 w-4" />;
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
}) => {
  const [filterType, setFilterType] = useState<ExerciseType | 'all'>('all');

  useEffect(() => {
    onSearch(searchQuery, filterType);
  }, [searchQuery, filterType, onSearch]);

  return (
    <div className="space-y-6 h-full flex flex-col p-4 md:p-6">
      <h3 className="text-xl font-bold">Exercise Library</h3>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter */}
        <Select value={filterType} onValueChange={(val) => setFilterType(val as ExerciseType | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 text-muted-foreground mr-2" />
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="flex items-center">
              All Types
            </SelectItem>
            <SelectItem value="warm-up" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-blue-700" /> Warm-up
            </SelectItem>
            <SelectItem value="exercise" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-green-700" /> Exercise
            </SelectItem>
            <SelectItem value="stretch" className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-purple-700" /> Stretch
            </SelectItem>
            <SelectItem value="balance" className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-700" /> Balance
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exercise Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
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
                {/* Image Placeholder */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {/* You can replace this with a real image from your data */}
                  <Image
                    src={`https://via.placeholder.com/64?text=${exercise.name.charAt(0).toUpperCase()}`}
                    alt={exercise.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {exercise.name}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-semibold capitalize flex items-center gap-1',
                        getBadgeColor(exercise.type)
                      )}
                    >
                      {getIconForType(exercise.type)}
                      <span className="hidden sm:inline-block">{exercise.type}</span>
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
