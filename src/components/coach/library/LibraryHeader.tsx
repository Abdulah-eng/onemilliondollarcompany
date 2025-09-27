```tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';

interface LibraryHeaderProps {
  activeCategory: LibraryCategory;
  onNewItemClick: () => void;
  itemCount: number;
}

const categoryLabels: Record<LibraryCategory, string> = {
  exercise: 'Exercises 💪',
  recipe: 'Recipes 🥗',
  'mental health': 'Wellness 🧘‍♂️',
};

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ activeCategory, onNewItemClick, itemCount }) => {
  const categoryLabel = categoryLabels[activeCategory].split(' ')[0];

  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b">
      <div className="flex items-end gap-3">
        <h1 className="text-3xl font-bold">Library</h1>
        <span className="text-muted-foreground text-base hidden sm:inline">({itemCount})</span>
      </div>

      <Button onClick={onNewItemClick} className="h-11 px-5">
        + New {categoryLabel}
      </Button>
    </div>
  );
};

export default LibraryHeader;
```
