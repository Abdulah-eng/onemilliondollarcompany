// src/components/coach/library/LibraryHeader.tsx
'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming Shadcn Tabs component
import { LibraryCategory } from '@/mockdata/library/mockLibrary';
import { cn } from '@/lib/utils';

interface LibraryHeaderProps {
  activeCategory: LibraryCategory;
  onCategoryChange: (category: LibraryCategory) => void;
  onNewItemClick: () => void;
  itemCount: number;
}

const categoryMap: { [key in LibraryCategory]: string } = {
  'exercise': 'Exercises 💪',
  'recipe': 'Recipes 🥗',
  'mental health': 'Mental Wellness 🧘‍♂️',
};

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ activeCategory, onCategoryChange, onNewItemClick, itemCount }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
      <div className='flex items-end gap-4'>
        <h1 className="text-4xl font-bold">Library</h1>
        <span className='text-muted-foreground text-lg hidden sm:inline-block'>({itemCount} items)</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as LibraryCategory)} className="flex-1">
          <TabsList className="w-full h-12 grid grid-cols-3">
            {(Object.keys(categoryMap) as LibraryCategory[]).map((category) => (
              <TabsTrigger key={category} value={category} className="text-sm">
                {categoryMap[category]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button onClick={onNewItemClick} className="w-full sm:w-auto h-12 flex-shrink-0">
          + New {categoryMap[activeCategory].split(' ')[0]}
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;
