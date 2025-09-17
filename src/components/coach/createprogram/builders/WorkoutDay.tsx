// src/components/coach/createprogram/builders/WorkoutDay.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Search, GripVertical } from 'lucide-react';
import { ExerciseItem, ExerciseType } from '@/mockdata/createprogram/mockExercises';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkoutDayItem {
  exercise: ExerciseItem;
  comment?: string;
  sets: number[];
  reps: number[];
}

interface WorkoutDayProps {
  day: string;
  items: WorkoutDayItem[];
  onItemsChange: (items: WorkoutDayItem[]) => void;
  onSearch: (query: string) => void;
  searchResults: ExerciseItem[];
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ day, items, onItemsChange, onSearch, searchResults }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAddItem = (exercise: ExerciseItem) => {
    onItemsChange([...items, { exercise, sets: [0], reps: [0] }]);
    setSearchQuery('');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleUpdateSetsReps = (itemIndex: number, setIndex: number, type: 'sets' | 'reps', value: string) => {
    const newItems = [...items];
    const numericValue = parseInt(value) || 0;
    newItems[itemIndex][type][setIndex] = numericValue;
    onItemsChange(newItems);
  };

  const handleAddSet = (itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].sets.push(0);
    newItems[itemIndex].reps.push(0);
    onItemsChange(newItems);
  };
  
  const handleRemoveSet = (itemIndex: number, setIndex: number) => {
    const newItems = [...items];
    if (newItems[itemIndex].sets.length > 1) {
      newItems[itemIndex].sets.splice(setIndex, 1);
      newItems[itemIndex].reps.splice(setIndex, 1);
      onItemsChange(newItems);
    }
  };

  const handleUpdateComment = (itemIndex: number, comment: string) => {
    const newItems = [...items];
    newItems[itemIndex].comment = comment;
    onItemsChange(newItems);
  };

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

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <h3 className="text-xl font-bold">{day}</h3>
      <DropdownMenu open={searchQuery.length > 2} onOpenChange={() => setSearchQuery('')}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search and add exercises..."
              className="pl-9 pr-16"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto w-auto p-1 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((exercise) => (
              <DropdownMenuItem
                key={exercise.id}
                onSelect={() => handleAddItem(exercise)}
                className="flex items-center gap-2"
              >
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getBadgeColor(exercise.type))}>
                  {exercise.type}
                </span>
                <span>{exercise.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">No results found.</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-4">
        <AnimatePresence>
          {items.map((item, itemIndex) => (
            <motion.div
              key={item.exercise.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 border rounded-lg relative group"
              layout
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className={cn("text-sm px-2 py-1 rounded-full font-medium", getBadgeColor(item.exercise.type))}>
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
                            onChange={(e) => handleUpdateSetsReps(itemIndex, setIndex, 'sets', e.target.value)}
                            className="w-full text-base"
                          />
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={item.reps[setIndex]}
                            onChange={(e) => handleUpdateSetsReps(itemIndex, setIndex, 'reps', e.target.value)}
                            className="w-full text-base"
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSet(itemIndex, setIndex)}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button variant="outline" className="w-full gap-2" onClick={() => handleAddSet(itemIndex)}>
                    <Plus className="h-4 w-4" /> Add Set
                  </Button>
                </div>
              )}
              
              <div className="mt-4 space-y-2">
                <Label>Optional Comment</Label>
                <Textarea
                  placeholder="e.g., Use light weights for this warm-up set."
                  value={item.comment}
                  onChange={(e) => handleUpdateComment(itemIndex, e.target.value)}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default WorkoutDay;
