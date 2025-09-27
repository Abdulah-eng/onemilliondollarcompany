// src/components/coach/library/LibraryHeader.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LibraryHeaderProps {
activeCategory: LibraryCategory;
onNewItemClick: () => void;
itemCount: number;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
activeCategory,
onNewItemClick,
itemCount,
}) => {
return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in {activeCategory}
        </p>
      </div>

      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <Tabs defaultValue={activeCategory} className="hidden md:block">
          <TabsList>
            <TabsTrigger value="exercise">Exercises</TabsTrigger>
            <TabsTrigger value="recipe">Recipes</TabsTrigger>
            <TabsTrigger value="mental health">Wellness</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={onNewItemClick} className="flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" />
          New
        </Button>
      </div>
    </div>

);
};

export default LibraryHeader;
