// src/components/coach/library/creation/ExerciseForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExerciseItem } from '@/mockdata/library/mockLibrary';

interface ExerciseFormProps {
  formData: Partial<ExerciseItem>;
  onFormChange: (field: keyof ExerciseItem, value: any) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input id="name" value={formData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} placeholder="e.g., Dumbbell Bench Press" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="muscleGroup">Primary Muscle Group</Label>
        <Input id="muscleGroup" value={formData.muscleGroup || ''} onChange={(e) => onFormChange('muscleGroup', e.target.value)} placeholder="e.g., Chest, Triceps" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction / Purpose</Label>
        <Textarea id="introduction" value={formData.introduction || ''} onChange={(e) => onFormChange('introduction', e.target.value)} placeholder="Brief overview of the movement and its goal." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proTip">Pro Tip</Label>
        <Textarea id="proTip" value={formData.proTip || ''} onChange={(e) => onFormChange('proTip', e.target.value)} placeholder="E.g., Squeeze your shoulder blades together." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avoid">What to Avoid</Label>
        <Textarea id="avoid" value={formData.whatToAvoid || ''} onChange={(e) => onFormChange('whatToAvoid', e.target.value)} placeholder="E.g., Arching your lower back excessively." />
      </div>
      {/* Simplified 'howTo' input for brevity; could be expanded to dynamic steps */}
      <div className="space-y-2">
        <Label htmlFor="howTo">How To (Step 1 Text/Video URL)</Label>
        <Input id="howTo" value={formData.howTo?.[0]?.value || ''} onChange={(e) => onFormChange('howTo', [{ id: 'h1', type: 'text', value: e.target.value }])} placeholder="Enter description or video link for Step 1" />
      </div>
    </div>
  );
};

export default ExerciseForm;
