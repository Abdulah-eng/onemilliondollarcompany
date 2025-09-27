// src/pages/coach/LibraryPage.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { LibraryItem, LibraryCategory, mockLibrary } from '@/mockdata/library/mockLibrary';
import LibraryHeader from '@/components/coach/library/LibraryHeader'; // Still used for title/button
import LibraryList from '@/components/coach/library/LibraryList';
import LibraryCreatorPage from './LibraryCreatorPage'; 
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // Assuming you have these
import { Button } from '@/components/ui/button';

type LibraryViewMode = 'list' | 'creator';

const LibraryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>('exercise');
  const [libraryData, setLibraryData] = useState<LibraryItem[]>(mockLibrary);
  const [viewMode, setViewMode] = useState<LibraryViewMode>('list'); 
  const [editingItem, setEditingItem] = useState<Partial<LibraryItem> | null>(null);

  const handleCategoryChange = useCallback((category: LibraryCategory) => {
    setActiveCategory(category);
  }, []);

  const handleNewItem = () => {
    setEditingItem(null);
    setViewMode('creator');
  };

  const handleEditItem = (item: LibraryItem) => {
    setEditingItem(item);
    setViewMode('creator');
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLibraryData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleItemSubmit = (newItem: LibraryItem) => {
    setLibraryData(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id);

      if (existingIndex > -1) {
        const updatedData = [...prev];
        updatedData[existingIndex] = newItem;
        return updatedData;
      } else {
        return [...prev, newItem];
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <AnimatePresence mode="wait">
        <motion.div key={viewMode} className="w-full">
          {viewMode === 'list' ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header now simplified */}
              <LibraryHeader
                activeCategory={activeCategory}
                onNewItemClick={handleNewItem}
                itemCount={libraryData.filter(item => item.category === activeCategory).length}
                // onCategoryChange removed from header
              />
              
              {/* List now handles the tabs, search, and dynamic filter */}
              <LibraryList
                activeCategory={activeCategory}
                libraryData={libraryData}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onCategoryChange={handleCategoryChange} // PASS HANDLER DOWN for tabs
              />
            </motion.div>
          ) : (
            <LibraryCreatorPage
              onBack={handleBackToList}
              onSubmit={handleItemSubmit}
              initialItem={editingItem}
              activeCategory={activeCategory}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
