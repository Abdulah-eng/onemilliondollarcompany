// src/components/coach/library/LibraryList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { LibraryItem, LibraryCategory } from '@/mockdata/library/mockLibrary';
import { AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  activeCategory: LibraryCategory;
  libraryData: LibraryItem[];
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

const LibraryList: React.FC<LibraryListProps> = ({ activeCategory, libraryData, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all'); // Placeholder for dynamic filtering

  const filteredItems = useMemo(() => {
    const categoryFiltered = libraryData.filter(item => item.category === activeCategory);
    if (!searchQuery) return categoryFiltered;

    const query = searchQuery.toLowerCase();
    return categoryFiltered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.introduction.toLowerCase().includes(query) ||
      (item.category === 'exercise' && item.muscleGroup.toLowerCase().includes(query)) ||
      (item.category === 'recipe' && item.allergies.toLowerCase().includes(query))
    );
  }, [libraryData, activeCategory, searchQuery]);
  
  // Note: Actual filtering based on dynamic tags is complex and omitted for brevity,
  // but the structure below allows for its implementation.

  return (
    <div className="space-y-6 pt-6">
      
      {/* Search and Filter Section (Vertical Layout) */}
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeCategory} library...`}
            className="pl-9 w-full h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Placeholder for additional filter tags (e.g., using horizontal scroll for mobile) */}
        {/*
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button variant={filterTag === 'all' ? 'default' : 'outline'} onClick={() => setFilterTag('all')} size="sm">All</Button>
          <Button variant={filterTag === 'custom' ? 'default' : 'outline'} onClick={() => setFilterTag('custom')} size="sm">My Custom</Button>
        </div>
        */}
      </div>

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
              <p className='text-sm mt-1'>Create a new item or clear your search.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LibraryList;
