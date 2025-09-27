// src/components/coach/library/creation/ItemFormWrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LibraryItem, LibraryCategory, ExerciseItem, RecipeItem, MentalHealthItem, BaseItem, mockLibrary } from '@/mockdata/library/mockLibrary';
import ExerciseForm from './ExerciseForm';
import RecipeForm from './RecipeForm';
import MentalHealthForm from './MentalHealthForm';

interface ItemFormWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: LibraryItem) => void;
  initialItem: Partial<LibraryItem> | null;
  activeCategory: LibraryCategory;
}

const ItemFormWrapper: React.FC<ItemFormWrapperProps> = ({ isOpen, onOpenChange, onSubmit, initialItem, activeCategory }) => {
  const [formData, setFormData] = useState<Partial<LibraryItem>>({});

  useEffect(() => {
    // Reset or set initial data when the sheet opens or the initialItem changes
    setFormData(initialItem || { category: activeCategory, isCustom: true });
  }, [initialItem, activeCategory, isOpen]);

  const handleFormChange = (field: keyof LibraryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.introduction) {
      alert("Please fill in Name and Introduction.");
      return;
    }
    
    // Simple ID creation for mock data
    const newId = formData.id || `custom-${Date.now()}`;

    // Final object structure check (simplified)
    const finalItem = {
        ...formData,
        id: newId,
        category: activeCategory,
        isCustom: true,
        // Ensure required fields are set, even if empty string
        name: formData.name || '',
        introduction: formData.introduction || '',
    } as LibraryItem;

    onSubmit(finalItem);
    onOpenChange(false);
  };

  const renderForm = () => {
    switch (activeCategory) {
      case 'exercise':
        return <ExerciseForm formData={formData as Partial<ExerciseItem>} onFormChange={handleFormChange as any} />;
      case 'recipe':
        return <RecipeForm formData={formData as Partial<RecipeItem>} onFormChange={handleFormChange as any} />;
      case 'mental health':
        return <MentalHealthForm formData={formData as Partial<MentalHealthItem>} onFormChange={handleFormChange as any} />;
      default:
        return <div>Select a category first.</div>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{initialItem ? 'Edit' : 'Create New'} {activeCategory.replace(' ', ' ')}</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {renderForm()}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit}>
            {initialItem ? 'Save Changes' : 'Create Item'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ItemFormWrapper;
