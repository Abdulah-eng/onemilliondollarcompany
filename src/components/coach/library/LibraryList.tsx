'use client';

import React from 'react';
import { LibraryItem } from '@/mockdata/library/mockLibrary';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  filteredItems: LibraryItem[];
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

const LibraryList: React.FC<LibraryListProps> = ({
  filteredItems,
  onEdit,
  onDelete,
}) => {
  if (filteredItems.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-xl font-semibold mb-2">No Content Found</p>
        <p>Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    // ✨ FIX: Increased column count for larger screens (xl:grid-cols-4)
    // to make cards smaller and denser, fitting better proportionally.
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 **xl:grid-cols-4** pt-4"> 
      {filteredItems.map(item => (
        <LibraryCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LibraryList;
