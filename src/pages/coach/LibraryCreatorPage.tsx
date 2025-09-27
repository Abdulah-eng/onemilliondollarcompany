'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LibraryItem, LibraryCategory } from '@/mockdata/library/mockLibrary';
import ExerciseForm from '@/components/coach/library/creation/ExerciseForm';
import RecipeForm from '@/components/coach/library/creation/RecipeForm';
import MentalHealthForm from '@/components/coach/library/creation/MentalHealthForm';
import LibraryCreationWrapper from '@/components/coach/library/creation/LibraryCreationWrapper'; // Import the new wrapper

interface LibraryCreatorPageProps {
  onBack: () => void;
  onSubmit: (item: LibraryItem) => void;
  initialItem: Partial<LibraryItem> | null;
  activeCategory: LibraryCategory;
}

const LibraryCreatorPage: React.FC<LibraryCreatorPageProps> = ({ onBack, onSubmit, initialItem, activeCategory }) => {
  const [formData, setFormData] = useState<Partial<LibraryItem>>({});

  useEffect(() => {
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

    // Simple type coercion to finalize the item
    const finalItem = {
      ...formData,
      id: newId,
      category: activeCategory,
      isCustom: true,
      name: formData.name || '',
      introduction: formData.introduction || '',
    } as LibraryItem;

    onSubmit(finalItem);
  };

  const renderForm = () => {
    switch (activeCategory) {
      case 'exercise':
        return <ExerciseForm formData={formData} onFormChange={handleFormChange} />;
      case 'recipe':
        return <RecipeForm formData={formData} onFormChange={handleFormChange} />;
      case 'mental health':
        return <MentalHealthForm formData={formData} onFormChange={handleFormChange} />;
      default:
        return <div>Select a category first.</div>;
    }
  };

  const isEditing = !!initialItem?.id;

  return (
    <LibraryCreationWrapper
      category={activeCategory}
      isEditing={isEditing}
      onBack={onBack}
      onSubmit={handleSubmit}
    >
      {/* The form content is passed as children */}
      {renderForm()}
    </LibraryCreationWrapper>
  );
};

export default LibraryCreatorPage;
