// src/components/coach/library/LibraryList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, FilterIcon } from 'lucide-react';
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
  onCategoryChange: (category: LibraryCategory) => void; 
}

// MOCK DATA FOR DYNAMIC FILTERS (Used to populate the Select dropdown)
const mockFilters = {
    'exercise': ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
    'recipe': ['all', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'],
    'mental health': ['all', 'yoga', 'meditation', 'reflections', 'breathwork', 'exercise'],
};

const categoryMap: { [key in LibraryCategory]: string } = {
  'exercise': 'Exercises 💪',
  'recipe': 'Recipes 🥗',
  'mental health': 'Wellness 🧘‍♂️',
};

const LibraryList: React.FC<LibraryListProps> = ({ activeCategory, libraryData, onEdit, onDelete, onCategoryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all'); 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // State for mobile drawer

  React.useEffect(() => {
      // Reset filter when category changes
      setFilterTag('all');
  }, [activeCategory]);


  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let filtered = libraryData.filter(item => item.category === activeCategory);

    // 1. Search Filter (combined with dynamic field check)
    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.introduction.toLowerCase().includes(query)
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
                // Check if the item's name or content type matches the tag
                const activeFilters = mockFilters['mental health'];
                return activeFilters.includes(filterTag); 
            }
            return true;
        });
    }

    return filtered;
  }, [libraryData, activeCategory, searchQuery, filterTag]);


  const renderDynamicFilterSelect = (isMobileView: boolean) => {
    const filterOptions = mockFilters[activeCategory] || [];
    const placeholder = activeCategory === 'exercise' ? 'Muscle Group' : activeCategory === 'recipe' ? 'Allergies' : 'Activity Type';
    
    if (filterOptions.length <= 1) return null; 

    return (
      <Select value={filterTag} onValueChange={(val) => setFilterTag(val)}>
        <SelectTrigger className={`h-11 ${isMobileView ? 'w-full' : 'sm:max-w-[150px] lg:max-w-[200px]'}`}>
          <FilterIcon className="h-4 w-4 text-muted-foreground mr-2" />
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
      
      {/* ⭐ SEARCH & FILTER STACK (Vertical View) */}
      <div className="flex flex-col gap-4 w-full">
        
        {/* 1. Search Bar */}
        <div className="flex gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeCategory} library...`}
              className="pl-9 w-full h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Button (for Mobile Drawer/Desktop Quick Filter) */}
          <Button 
            variant="secondary" // Use secondary for contrast, matching the filter image style
            className="h-11 w-11 shrink-0 hidden sm:flex items-center justify-center"
            onClick={() => setIsMobileFilterOpen(true)} // Can be used to toggle a robust desktop filter view
          >
            <FilterIcon className='h-5 w-5' />
          </Button>
        </div>
        
        {/* 2. Category Tabs & Dynamic Filter Select */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:items-center">
            
            {/* Category Tabs (Full width on mobile, top of stack) */}
            <Tabs value={activeCategory} onValueChange={onCategoryChange} className="flex-1">
              <TabsList className="w-full h-10 grid grid-cols-3 max-w-full sm:max-w-md">
                {(Object.keys(categoryMap) as LibraryCategory[]).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-sm">
                    {categoryMap[category]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Dynamic Filter Select (Quick desktop filter) */}
            <div className='flex-shrink-0'>
                {renderDynamicFilterSelect(false)}
            </div>
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
            <motion.div 
              key="empty" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border"
            >
              <h4 className="text-lg font-medium">No {activeCategory} items found.</h4>
              <p className='text-sm mt-1'>Try clearing your filters or search term.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Placeholder for Mobile Filter Sheet/Drawer */}
      {/* You would integrate the Sheet/Drawer component here to use the renderDynamicFilterSelect(true) inside it */}
    </div>
  );
};

export default LibraryList;
