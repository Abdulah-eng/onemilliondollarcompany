// src/components/coach/library/LibraryHeader.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';

interface LibraryHeaderProps {
  activeCategory: LibraryCategory;
  onNewItemClick: () => void;
  itemCount: number;
}

const categoryMap: { [key in LibraryCategory]: string } = {
  'exercise': 'Exercises 💪',
  'recipe': 'Recipes 🥗',
  'mental health': 'Mental Wellness 🧘‍♂️',
};

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ activeCategory, onNewItemClick, itemCount }) => {
  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b">
      <div className='flex items-end gap-4'>
        <h1 className="text-4xl font-bold">Library</h1>
        <span className='text-muted-foreground text-lg hidden sm:inline-block'>({itemCount} items)</span>
      </div>

      <Button onClick={onNewItemClick} className="w-full sm:w-auto h-12 flex-shrink-0">
        + New {categoryMap[activeCategory].split(' ')[0]}
      </Button>
    </div>
  );
};

export default LibraryHeader;
