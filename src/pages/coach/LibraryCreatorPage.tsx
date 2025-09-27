// src/pages/coach/LibraryCreatorPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import { LibraryItem, LibraryCategory, ExerciseItem, RecipeItem, MentalHealthItem } from '@/mockdata/library/mockLibrary';
import ExerciseForm from '@/components/coach/library/creation/ExerciseForm';
import RecipeForm from '@/components/coach/library/creation/RecipeForm';
import MentalHealthForm from '@/components/coach/library/creation/MentalHealthForm';

interface LibraryCreatorPageProps {
  onBack: () => void;
  onSubmit: (item: LibraryItem) => void;
  initialItem: Partial<LibraryItem> | null;
  activeCategory: LibraryCategory;
}

const LibraryCreatorPage: React.FC<LibraryCreatorPageProps> = ({ onBack, onSubmit, initialItem, activeCategory }) => {
  const [formData, setFormData] = useState<Partial<LibraryItem>>({});

  useEffect(() => {
    // Set initial data for editing or creation
    const baseData = { category: activeCategory, isCustom: true };
    setFormData(initialItem ? { ...baseData, ...initialItem } : baseData);
  }, [initialItem, activeCategory]);

  const handleFormChange = useCallback((field: keyof LibraryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = () => {
    if (!formData.name || !formData.introduction) {
      alert("Please fill in Name and Introduction.");
      return;
    }
    
    const newId = formData.id || `custom-${Date.now()}`;

    // Simple type coercion, assumes forms ensure minimum required structure
    const finalItem = {
        ...formData,
        id: newId,
        category: activeCategory,
        isCustom: true,
        name: formData.name || '',
        introduction: formData.introduction || '',
    } as LibraryItem;

    onSubmit(finalItem);
    onBack();
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

  const isEditing = !!initialItem?.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header and Actions */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit' : 'Create New'} {activeCategory.replace(' ', ' ')}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Library
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create Item'}
          </Button>
        </div>
      </div>

      {/* Dynamic Form Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-card rounded-xl shadow-md">
        {renderForm()}
      </div>
    </motion.div>
  );
};

export default LibraryCreatorPage;
