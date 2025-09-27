// src/components/coach/library/LibraryList.tsx
'use client';

import React from 'react';
import { LibraryItem, LibraryCategory } from '@/mockdata/library/mockLibrary';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface LibraryListProps {
activeCategory: LibraryCategory;
libraryData: LibraryItem[];
onEdit: (item: LibraryItem) => void;
onDelete: (id: string) => void;
onCategoryChange: (cat: LibraryCategory) => void;
}

const LibraryList: React.FC<LibraryListProps> = ({
activeCategory,
libraryData,
onEdit,
onDelete,
}) => {
const items = libraryData.filter(i => i.category === activeCategory);

return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{item.introduction}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
);
};

export default LibraryList;
