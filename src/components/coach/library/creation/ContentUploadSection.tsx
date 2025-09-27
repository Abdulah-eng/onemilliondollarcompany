import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image, Video, FileText, Mic, X } from 'lucide-react';
import { ContentStep } from '@/mockdata/library/mockLibrary';

interface ContentUploadSectionProps {
  content: ContentStep[];
  onContentChange: (newContent: ContentStep[]) => void;
  allowedTypes: ('image' | 'video' | 'soundfile' | 'step')[];
}

const ContentUploadSection: React.FC<ContentUploadSectionProps> = ({ content, onContentChange, allowedTypes }) => {
  const exists = (type: string) => content.some(c => c.type === type);

  const toggleContent = (type: ContentStep['type'], initialValue: string = '') => {
    if (exists(type)) {
      onContentChange(content.filter(c => c.type !== type));
    } else {
      onContentChange([...content, { id: `c-${Date.now()}`, type, value: initialValue }]);
    }
  };

  const updateContentValue = (id: string, value: string) => {
    onContentChange(content.map(c => c.id === id ? { ...c, value } : c));
  };
  
  const stepContent = content.filter(c => c.type === 'step').sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID to keep creation order
  const otherContent = content.filter(c => c.type !== 'step');

  const addStep = () => {
      onContentChange([...content, { id: `step-${Date.now()}`, type: 'step', value: '' }]);
  };
  
  const removeStep = (id: string) => {
      onContentChange(content.filter(c => c.id !== id));
  };
  
  return (
    <div className="space-y-4 rounded-xl border p-4 bg-muted/10">
      <h3 className="text-xl font-bold mb-4">Media & Instructions 🎬</h3>
      
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 border-b pb-4">
        {allowedTypes.includes('image') && !exists('image') && (
            <Button variant="outline" onClick={() => toggleContent('image')}>
                <Image className="h-4 w-4 mr-2" /> Upload Image
            </Button>
        )}
        {allowedTypes.includes('video') && !exists('video') && (
            <Button variant="outline" onClick={() => toggleContent('video')}>
                <Video className="h-4 w-4 mr-2" /> Add Video Link
            </Button>
        )}
        {allowedTypes.includes('soundfile') && !exists('soundfile') && (
            <Button variant="outline" onClick={() => toggleContent('soundfile')}>
                <Mic className="h-4 w-4 mr-2" /> Add Audio File
            </Button>
        )}
        {(allowedTypes.includes('step') && stepContent.length === 0) && (
             <Button variant="outline" onClick={addStep}>
                <FileText className="h-4 w-4 mr-2" /> Add Step-by-Step
            </Button>
        )}
      </div>
      
      {/* Active Media Inputs */}
      {otherContent.map(c => (
        <div key={c.id} className="space-y-2 mb-4 border-l-4 border-primary/50 pl-3 pt-1">
          <div className="flex items-center justify-between">
            <Label htmlFor={c.id} className="capitalize font-semibold text-primary">
              {c.type === 'image' ? 'Image URL/Upload' : c.type === 'video' ? 'Video URL' : 'Audio URL/Upload'}
            </Label>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toggleContent(c.type)}>
                <X className='h-4 w-4 mr-1' /> Remove
            </Button>
          </div>
          <Input 
            id={c.id} 
            value={c.value} 
            onChange={(e) => updateContentValue(c.id, e.target.value)} 
            placeholder={`Enter URL or path for ${c.type}`}
          />
        </div>
      ))}
      
      {/* Step-by-Step Section (FIXED: Visually prominent, numbered steps) */}
      {stepContent.length > 0 && allowedTypes.includes('step') && (
          <div className="space-y-5 border-t pt-5">
              <h4 className="text-xl font-bold flex justify-between items-center text-primary">
                  STEP BY FUCKING STEP Instructions 👣
                  <Button variant="default" onClick={addStep}>+ Add Step</Button>
              </h4>
              {stepContent.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-inner border">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold mt-1">{index + 1}</div>
                      <Textarea 
                          value={step.value} 
                          onChange={(e) => updateContentValue(step.id, e.target.value)} 
                          placeholder={`Step ${index + 1} description (e.g., Hold for 30 seconds)`}
                          className="flex-grow min-h-[60px]"
                      />
                      <Button variant="ghost" size="icon" className="flex-shrink-0 mt-1 text-destructive hover:bg-destructive/10" onClick={() => removeStep(step.id)}>
                          <X className="h-4 w-4" />
                      </Button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default ContentUploadSection;
