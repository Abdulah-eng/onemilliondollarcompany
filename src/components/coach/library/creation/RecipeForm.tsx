import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RecipeItem, Ingredient } from '@/mockdata/library/mockLibrary';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentUploadSection from './ContentUploadSection';

interface RecipeFormProps {
  formData: Partial<RecipeItem>;
  onFormChange: (field: keyof RecipeItem, value: any) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ formData, onFormChange }) => {
  const ingredients: Ingredient[] = formData.ingredients || [];
  
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = ingredients.map((item, i) => (
      i === index ? { ...item, [field]: value } : item
    ));
    onFormChange('ingredients', newIngredients);
  };

  const addIngredient = () => {
    onFormChange('ingredients', [...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    onFormChange('ingredients', ingredients.filter((_, i) => i !== index));
  };
  
  // Recipe uses 'stepByStep' field for instructions, not 'content'
  // We'll manage ingredients dynamically and use the content section for media.
  
  const steps: string[] = formData.stepByStep || [];
  
  const handleStepChange = (index: number, value: string) => {
    const newSteps = steps.map((item, i) => (
      i === index ? value : item
    ));
    onFormChange('stepByStep', newSteps);
  };
  
  const addStep = () => {
    onFormChange('stepByStep', [...steps, '']);
  };
  
  const removeStep = (index: number) => {
    onFormChange('stepByStep', steps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recipe Details</h2>

      {/* Core Fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Recipe Name</Label>
        <Input id="name" value={formData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} placeholder="e.g., High-Protein Salmon Bowl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction / Description</Label>
        <Textarea id="introduction" value={formData.introduction || ''} onChange={(e) => onFormChange('introduction', e.target.value)} placeholder="Quick description, e.g., High protein, low carb meal prep." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies / Dietary Notes</Label>
        <Input id="allergies" value={formData.allergies || ''} onChange={(e) => onFormChange('allergies', e.target.value)} placeholder="e.g., Gluten-Free, Contains Nuts, Vegan" />
      </div>
      
      {/* Ingredients List */}
      <div className="space-y-4 p-4 rounded-xl border bg-muted/10">
        <h3 className="text-xl font-semibold flex justify-between items-center">
            Ingredients List
            <Button variant="secondary" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </Button>
        </h3>
        {ingredients.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <Input 
                  value={item.quantity} 
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} 
                  placeholder="e.g., 150g" 
                />
            </div>
            <div className="flex-[2] space-y-1">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input 
                  value={item.name} 
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} 
                  placeholder="e.g., Chicken Breast" 
                />
            </div>
            <Button variant="destructive" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => removeIngredient(index)}>
                <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Dynamic Content Uploads (Image/Video) */}
      <ContentUploadSection
        content={formData.content || []}
        onContentChange={(value) => onFormChange('content', value)}
        allowedTypes={['image', 'video']} // Steps are handled separately in Recipe model
      />
      
      {/* Steps (using Textarea fields for simplicity, instead of ContentUploadSection steps) */}
      <div className="space-y-4 p-4 rounded-xl border bg-muted/10">
        <h3 className="text-xl font-semibold flex justify-between items-center">
            Step by Step Instructions
            <Button variant="secondary" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" /> Add Step
            </Button>
        </h3>
        {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">{index + 1}</div>
                <Textarea 
                    value={step} 
                    onChange={(e) => handleStepChange(index, e.target.value)} 
                    placeholder={`Step ${index + 1} instructions`}
                    className="flex-grow"
                />
                <Button variant="ghost" size="icon" className="flex-shrink-0 mt-1" onClick={() => removeStep(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        ))}
      </div>

      {/* Pro Tip Section */}
      <div className="space-y-2 p-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-500/10">
        <Label htmlFor="proTip" className="flex items-center text-yellow-600 font-semibold">
          <Lightbulb className="w-5 h-5 mr-2" /> Pro Tip
        </Label>
        <Textarea id="proTip" value={formData.proTip || ''} onChange={(e) => onFormChange('proTip', e.target.value)} placeholder="Advice for best results, e.g., 'Use a high-quality olive oil for better flavor.'" />
      </div>
    </div>
  );
};

export default RecipeForm;
