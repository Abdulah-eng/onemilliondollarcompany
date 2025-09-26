// src/components/coach/library/creation/RecipeForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RecipeItem } from '@/mockdata/library/mockLibrary';

interface RecipeFormProps {
  formData: Partial<RecipeItem>;
  onFormChange: (field: keyof RecipeItem, value: any) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ formData, onFormChange }) => {
  // Simplified ingredient and step list management for brevity
  const ingredientsString = (formData.ingredients || []).map(i => `${i.quantity} ${i.name}`).join('\n');
  const stepsString = (formData.stepByStep || []).join('\n');

  const handleIngredientsChange = (value: string) => {
    const ingredients = value.split('\n').map(line => {
        const parts = line.split(' ');
        const quantity = parts.shift() || '1x';
        const name = parts.join(' ');
        return { name, quantity };
    }).filter(i => i.name);
    onFormChange('ingredients', ingredients);
  };

  const handleStepsChange = (value: string) => {
    onFormChange('stepByStep', value.split('\n').filter(s => s.trim()));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Recipe Name</Label>
        <Input id="name" value={formData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} placeholder="e.g., Chicken and Veggie Prep" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction</Label>
        <Textarea id="introduction" value={formData.introduction || ''} onChange={(e) => onFormChange('introduction', e.target.value)} placeholder="Quick description, e.g., High protein, low carb meal prep." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies / Dietary Notes</Label>
        <Input id="allergies" value={formData.allergies || ''} onChange={(e) => onFormChange('allergies', e.target.value)} placeholder="e.g., Gluten-Free, Contains Nuts" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients (Quantity Name, one per line)</Label>
        <Textarea id="ingredients" value={ingredientsString} onChange={(e) => handleIngredientsChange(e.target.value)} rows={4} placeholder="e.g., 150g Chicken Breast" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="steps">Step by Step Instructions (One step per line)</Label>
        <Textarea id="steps" value={stepsString} onChange={(e) => handleStepsChange(e.target.value)} rows={6} placeholder="E.g., 1. Preheat oven to 400F." />
      </div>
    </div>
  );
};

export default RecipeForm;
