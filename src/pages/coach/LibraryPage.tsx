'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryItem, LibraryCategory, mockLibrary } from '@/mockdata/library/mockLibrary';
import LibraryHeader from '@/components/coach/library/LibraryHeader';
import LibraryList from '@/components/coach/library/LibraryList';
import LibraryCreatorPage from './LibraryCreatorPage';
import LibraryFAB from '@/components/coach/library/LibraryFAB';

type LibraryView = 'list' | 'creator';

const LibraryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [libraryData, setLibraryData] = useState<LibraryItem[]>(mockLibrary);
  const [view, setView] = useState<LibraryView>('list');
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);

  // ... (Filtering Logic remains the same)
  const filteredItems = useMemo(() => {
    return libraryData.filter(item => {
      const categoryMatch = !activeCategory || item.category === activeCategory;
      const searchMatch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.introduction.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }, [libraryData, activeCategory, searchTerm]);

  // ... (Handlers remain the same)
  const handleCategoryChange = useCallback((cat: LibraryCategory | null) => {
    setActiveCategory(cat);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleNewItem = (category: LibraryCategory) => {
    setEditingItem(null);
    setActiveCategory(category);
    setView('creator');
  };

  const handleEditItem = (item: LibraryItem) => {
    setEditingItem(item);
    setActiveCategory(item.category);
    setView('creator');
  };

  const handleBackToList = () => setView('list');

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this content?')) {
      setLibraryData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleItemSubmit = (newItem: LibraryItem) => {
    setLibraryData(prev => {
      const i = prev.findIndex(item => item.id === newItem.id);
      if (i > -1) {
        const updated = [...prev];
        updated[i] = newItem;
        return updated;
      }
      return [...prev, newItem];
    });
    setActiveCategory(newItem.category);
    setView('list');
  };

  return (
    // ✨ FIX: Reduced max-width from default full-container to max-w-6xl 
    // and reduced desktop padding (p-6 instead of p-8) for a tighter feel.
    <div className="container mx-auto p-4 md:p-6 **max-w-6xl** relative"> 
      <AnimatePresence mode="wait">
        <motion.div key={view} className="w-full">
          {view === 'list' ? (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <LibraryHeader
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
                itemCount={filteredItems.length}
                totalItemCount={libraryData.length}
              />
              <LibraryList
                filteredItems={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            </motion.div>
          ) : (
            <LibraryCreatorPage
              onBack={handleBackToList}
              onSubmit={handleItemSubmit}
              initialItem={editingItem ?? undefined}
              activeCategory={activeCategory || 'exercise'}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button (FAB) in the corner */}
      {view === 'list' && (
        <LibraryFAB onActionClick={handleNewItem} />
      )}
    </div>
  );
};

export default LibraryPage;
