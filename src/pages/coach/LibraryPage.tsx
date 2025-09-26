// src/pages/coach/LibraryPage.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { LibraryItem, LibraryCategory, mockLibrary } from '@/mockdata/library/mockLibrary';
import LibraryHeader from '@/components/coach/library/LibraryHeader';
import LibraryList from '@/components/coach/library/LibraryList';
import ItemFormWrapper from '@/components/coach/library/creation/ItemFormWrapper';

const LibraryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>('exercise');
  const [libraryData, setLibraryData] = useState<LibraryItem[]>(mockLibrary);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<LibraryItem> | null>(null);

  const handleCategoryChange = useCallback((category: LibraryCategory) => {
    setActiveCategory(category);
  }, []);

  const handleNewItem = () => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleEditItem = (item: LibraryItem) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLibraryData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleItemSubmit = (newItem: LibraryItem) => {
    setLibraryData(prev => {
      // Find existing item index
      const existingIndex = prev.findIndex(item => item.id === newItem.id);

      if (existingIndex > -1) {
        // Update existing item
        const updatedData = [...prev];
        updatedData[existingIndex] = newItem;
        return updatedData;
      } else {
        // Create new item
        return [...prev, newItem];
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <LibraryHeader
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onNewItemClick={handleNewItem}
        itemCount={libraryData.filter(item => item.category === activeCategory).length}
      />

      <LibraryList
        activeCategory={activeCategory}
        libraryData={libraryData}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      <ItemFormWrapper
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleItemSubmit}
        initialItem={editingItem}
        activeCategory={activeCategory}
      />
    </div>
  );
};

export default LibraryPage;
