// src/pages/coach/LibraryPage.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryItem, LibraryCategory, mockLibrary } from '@/mockdata/library/mockLibrary';
import LibraryHeader from '@/components/coach/library/LibraryHeader';
import LibraryList from '@/components/coach/library/LibraryList';
import LibraryCreatorPage from './LibraryCreatorPage';

type LibraryView = 'list' | 'creator';

const LibraryPage: React.FC = () => {
const [activeCategory, setActiveCategory] = useState<LibraryCategory>('exercise');
const [libraryData, setLibraryData] = useState<LibraryItem[]>(mockLibrary);
const [view, setView] = useState<LibraryView>('list');
const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
const [searchTerm, setSearchTerm] = useState('');

const handleCategoryChange = useCallback((cat: LibraryCategory) => setActiveCategory(cat), []);
const handleSearch = useCallback((term: string) => setSearchTerm(term), []);

// Filter items based on category and search
const filteredItems = libraryData.filter(item => {
  const matchesCategory = item.category === activeCategory;
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.introduction.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
});

const handleNewItem = () => {
setEditingItem(null);
setView('creator');
};

const handleEditItem = (item: LibraryItem) => {
setEditingItem(item);
setView('creator');
};

const handleBackToList = () => setView('list');

const handleDeleteItem = (id: string) => {
if (window.confirm('Delete this item?')) {
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
setView('list');
};

return ( <div className="container mx-auto p-4 md:p-8"> <AnimatePresence mode="wait">
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
              onNewItemClick={handleNewItem}
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
activeCategory={activeCategory}
/>
)}
</motion.div> </AnimatePresence> </div>
);
};

export default LibraryPage;
