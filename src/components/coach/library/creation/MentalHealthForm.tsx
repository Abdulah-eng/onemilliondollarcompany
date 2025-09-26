// src/components/coach/library/creation/MentalHealthForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MentalHealthItem } from '@/mockdata/library/mockLibrary';

interface MentalHealthFormProps {
  formData: Partial<MentalHealthItem>;
  onFormChange: (field: keyof MentalHealthItem, value: any) => void;
}

const MentalHealthForm: React.FC<MentalHealthFormProps> = ({ formData, onFormChange }) => {
  // Simplified content input for brevity; assumes a single primary piece of content (audio/video/text)
  const contentValue = formData.content?.[0]?.value || '';

  const handleContentChange = (value: string, type: 'text' | 'soundfile' | 'video') => {
      onFormChange('content', [{ id: 'c1', type, value }]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Activity Name</Label>
        <Input id="name" value={formData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} placeholder="e.g., 10-Minute Gratitude Meditation" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction / Goal</Label>
        <Textarea id="introduction" value={formData.introduction || ''} onChange={(e) => onFormChange('introduction', e.target.value)} placeholder="Describe the goal of the activity (e.g., Reduce anxiety, improve sleep)." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content URL / Text</Label>
        <Input id="content" value={contentValue} onChange={(e) => handleContentChange(e.target.value, 'text')} placeholder="Link to Audio/Video file or enter guided text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proTip">Pro Tip (e.g., best time to use)</Label>
        <Input id="proTip" value={formData.proTip || ''} onChange={(e) => onFormChange('proTip', e.target.value)} placeholder="E.g., Best done right before bed." />
      </div>
    </div>
  );
};

export default MentalHealthForm;
