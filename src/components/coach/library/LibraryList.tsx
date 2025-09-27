// src/components/coach/library/LibraryList.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Filter, Dumbbell, Zap, Heart, Utensils } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LibraryItem, LibraryCategory, ExerciseItem, RecipeItem, MentalHealthItem } from '@/mockdata/library/mockLibrary';
import LibraryCard from './LibraryCard';
import { Button } from '@/components/ui/button';

interface LibraryListProps {
  activeCategory: LibraryCategory;
  libraryData: LibraryItem[];
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (category: LibraryCategory) => void; // ⭐ Must be passed down from LibraryPage
}

// MOCK DATA FOR DYNAMIC FILTERS (Ideally these come from a database/API)
const mockFilters = {
    'exercise': ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
    'recipe': ['all', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'],
    'mental health': ['all', 'yoga', 'meditation', 'reflections', 'breathwork', 'exercise'],
};

const categoryMap: { [key in LibraryCategory]: string } = {
  'exercise': 'Exercises 💪',
  'recipe': 'Recipes 🥗',
  'mental health': 'Mental Wellness 🧘‍♂️',
};

const LibraryList: React.FC<LibraryListProps> = ({ activeCategory, libraryData, onEdit, onDelete, onCategoryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all'); 

  // Reset filter tag when category changes
  React.useEffect(() => {
      setFilterTag('all');
  }, [activeCategory]);


  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    let filtered = libraryData.filter(item => item.category === activeCategory);

    // 1. Search Filter
    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.introduction.toLowerCase().includes(query) ||
        (item.category === 'exercise' && (item as ExerciseItem).muscleGroup.toLowerCase().includes(query)) ||
        (item.category === 'recipe' && (item as RecipeItem).allergies.toLowerCase().includes(query))
      );
    }
    
    // 2. Dynamic Tag Filter
    if (filterTag !== 'all') {
        filtered = filtered.filter(item => {
            if (activeCategory === 'exercise') {
                return (item as ExerciseItem).muscleGroup.toLowerCase().includes(filterTag);
            }
            if (activeCategory === 'recipe') {
                return (item as RecipeItem).allergies.toLowerCase().includes(filterTag);
            }
            if (activeCategory === 'mental health') {
                // Assuming we can check if the activity name or type includes the tag
                const activityType = (item as MentalHealthItem).content?.[0]?.type || ''; // Simplified check
                const itemName = item.name.toLowerCase();
                return itemName.includes(filterTag) || activityType.includes(filterTag);
            }
            return true;
        });
    }

    return filtered;
  }, [libraryData, activeCategory, searchQuery, filterTag]);


  const renderFilterSelect = () => {
    const filterOptions = mockFilters[activeCategory] || [];
    const placeholder = activeCategory === 'exercise' ? 'Muscle Group' : activeCategory === 'recipe' ? 'Allergies' : 'Activity Type';

    return (
      <Select value={filterTag} onValueChange={(val) => setFilterTag(val)}>
        <SelectTrigger className="w-full sm:max-w-[150px] h-10 text-base sm:text-sm">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option} value={option} className='capitalize'>
              {option.replace('-', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };


  return (
    <div className="space-y-6 pt-6">
      
      {/* ⭐ NEW SEARCH & FILTER STACK (MODERN VERTICAL VIEW) */}
      <div className="flex flex-col gap-4 w-full">
        
        {/* 1. Search Bar */}
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeCategory} library...`}
            className="pl-9 w-full h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* 2. Category Tabs & Dynamic Filter Select */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:items-center">
            
            {/* Category Tabs (Moved from Header) */}
            <Tabs value={activeCategory} onValueChange={onCategoryChange} className="flex-1">
              <TabsList className="w-full sm:w-auto h-10 grid grid-cols-3 max-w-lg">
                {(Object.keys(categoryMap) as LibraryCategory[]).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-sm">
                    {categoryMap[category]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Dynamic Filter Select */}
            {renderFilterSelect()}
        </div>
      </div>
      
      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <LibraryCard 
                key={item.id} 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border">
              <h4 className="text-lg font-medium">No {activeCategory} items found.</h4>
              <p className='text-sm mt-1'>Try clearing your filters or search term.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LibraryList;
