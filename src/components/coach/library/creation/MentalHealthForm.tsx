import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MentalHealthItem } from '@/mockdata/library/mockLibrary';
import { MessageSquare } from 'lucide-react';
import ContentUploadSection from './ContentUploadSection';

interface MentalHealthFormProps {
  formData: Partial<MentalHealthItem>;
  onFormChange: (field: keyof MentalHealthItem, value: any) => void;
}

const MentalHealthForm: React.FC<MentalHealthFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wellness Activity Details</h2>

      {/* Core Fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Activity Name</Label>
        <Input id="name" value={formData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} placeholder="e.g., 10-Minute Gratitude Meditation" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits Target</Label>
        <Input id="benefits" value={formData.benefits || ''} onChange={(e) => onFormChange('benefits', e.target.value)} placeholder="e.g., Stress Reduction, Better Sleep, Focus" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (Equipment/Setting)</Label>
        <Input id="requirements" value={formData.requirements || ''} onChange={(e) => onFormChange('requirements', e.target.value)} placeholder="e.g., Quiet Room, Headphones, Comfortable Seat" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction / Goal</Label>
        <Textarea id="introduction" value={formData.introduction || ''} onChange={(e) => onFormChange('introduction', e.target.value)} placeholder="Describe the goal of the activity (e.g., Reduce anxiety, improve sleep)." />
      </div>

      {/* Dynamic Content Uploads (Image, Video, Audio, or Steps) */}
      <ContentUploadSection
        content={formData.content || []}
        onContentChange={(value) => onFormChange('content', value)}
        allowedTypes={['image', 'video', 'soundfile', 'step']}
      />
      
      {/* Additional Note Section */}
      <div className="space-y-2 p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-500/10">
        <Label htmlFor="additionalNote" className="flex items-center text-indigo-600 font-semibold">
          <MessageSquare className="w-5 h-5 mr-2" /> Additional Note
        </Label>
        <Textarea id="additionalNote" value={formData.additionalNote || ''} onChange={(e) => onFormChange('additionalNote', e.target.value)} placeholder="Any final thoughts, resources, or timing instructions." />
      </div>
    </div>
  );
};

export default MentalHealthForm;
