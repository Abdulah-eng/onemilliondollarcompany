```tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LibraryItem, LibraryCategory, ExerciseItem, RecipeItem } from '@/mockdata/library/mockLibrary';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  activeCategory: LibraryCategory;
  libraryData: LibraryItem[];
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (category: LibraryCategory) => void; 
}

// Filter options per category
const filterOptionsMap: Record<LibraryCategory, string[]> = {
  exercise: ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
  recipe: ['all', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'],
  'mental health': ['all', 'yoga', 'meditation', 'reflections', 'breathwork'],
};

const categoryLabels: Record<LibraryCategory, string> = {
  exercise: 'Exercises 💪',
  recipe: 'Recipes 🥗',
  'mental health': 'Wellness 🧘‍♂️',
};

const LibraryList: React.FC<LibraryListProps> = ({
  activeCategory,
  libraryData,
  onEdit,
  onDelete,
  onCategoryChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  // Reset filter on category change
  useEffect(() => setFilterTag('all'), [activeCategory]);

  // Apply filters
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let items = libraryData.filter(item => item.category === activeCategory);

    if (query) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.introduction.toLowerCase().includes(query)
      );
    }

    if (filterTag !== 'all') {
      items = items.filter(item => {
        if (activeCategory === 'exercise') {
          return (item as ExerciseItem).muscleGroup.toLowerCase().includes(filterTag);
        }
        if (activeCategory === 'recipe') {
          return (item as RecipeItem).allergies.toLowerCase().includes(filterTag);
        }
        if (activeCategory === 'mental health') {
          return item.name.toLowerCase().includes(filterTag) ||
                 item.introduction.toLowerCase().includes(filterTag);
        }
        return true;
      });
    }

    return items;
  }, [libraryData, activeCategory, searchQuery, filterTag]);

  return (
    <div className="space-y-6 pt-6">
      {/* 🔍 Search + Category Tabs + Filters */}
      <div className="flex flex-col gap-4 w-full">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeCategory}...`}
            className="pl-9 w-full h-11"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category tabs + filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Tabs */}
          <Tabs value={activeCategory} onValueChange={onCategoryChange} className="flex-1">
            <TabsList className="w-full h-10 grid grid-cols-3 sm:max-w-md">
              {(Object.keys(categoryLabels) as LibraryCategory[]).map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-sm">
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filter (responsive) */}
          {filterOptionsMap[activeCategory].length > 1 && (
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="sm:max-w-[180px] h-11 text-sm">
                <Filter className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptionsMap[activeCategory].map(opt => (
                  <SelectItem key={opt} value={opt} className="capitalize">
                    {opt.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* 📚 Item grid */}
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
              <h4 className="text-lg font-medium">No {categoryLabels[activeCategory]} found</h4>
              <p className="text-sm mt-1">Try adjusting filters or create a new one.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LibraryList;
```
