import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image, Video, FileText, Mic } from 'lucide-react';
import { ContentItem } from '@/mockdata/library/mockLibrary';

interface ContentUploadSectionProps {
  content: ContentItem[];
  onContentChange: (newContent: ContentItem[]) => void;
  allowedTypes: ('image' | 'video' | 'soundfile' | 'step')[];
}

const ContentUploadSection: React.FC<ContentUploadSectionProps> = ({ content, onContentChange, allowedTypes }) => {
  const getIndex = (type: string) => content.findIndex(c => c.type === type);
  const exists = (type: string) => getIndex(type) !== -1;
  const getValue = (type: string) => content.find(c => c.type === type)?.value || '';

  const toggleContent = (type: ContentItem['type'], initialValue: string = '') => {
    if (exists(type)) {
      onContentChange(content.filter(c => c.type !== type));
    } else {
      onContentChange([...content, { id: `c-${Date.now()}`, type, value: initialValue }]);
    }
  };

  const updateContentValue = (type: ContentItem['type'], value: string) => {
    onContentChange(content.map(c => c.type === type ? { ...c, value } : c));
  };
  
  const updateStepValue = (index: number, value: string) => {
      const steps = content.filter(c => c.type === 'step');
      steps[index].value = value;
      onContentChange([...content.filter(c => c.type !== 'step'), ...steps]);
  };
  
  const addStep = () => {
      onContentChange([...content, { id: `c-${Date.now()}`, type: 'step', value: '' }]);
  };
  
  const removeStep = (id: string) => {
      onContentChange(content.filter(c => c.id !== id));
  };
  
  const stepContent = content.filter(c => c.type === 'step');
  const otherContent = content.filter(c => c.type !== 'step');
  const availableTypes = allowedTypes.filter(type => !exists(type) || type === 'step');

  return (
    <div className="space-y-4 rounded-xl border p-4 bg-muted/10">
      <h3 className="text-xl font-semibold mb-3">Media & Instructions</h3>
      
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allowedTypes.includes('image') && !exists('image') && (
            <Button variant="outline" size="sm" onClick={() => toggleContent('image')}>
                <Image className="h-4 w-4 mr-2" /> Add Image
            </Button>
        )}
        {allowedTypes.includes('video') && !exists('video') && (
            <Button variant="outline" size="sm" onClick={() => toggleContent('video')}>
                <Video className="h-4 w-4 mr-2" /> Add Video
            </Button>
        )}
        {allowedTypes.includes('soundfile') && !exists('soundfile') && (
            <Button variant="outline" size="sm" onClick={() => toggleContent('soundfile')}>
                <Mic className="h-4 w-4 mr-2" /> Add Audio
            </Button>
        )}
        {allowedTypes.includes('step') && stepContent.length === 0 && (
             <Button variant="outline" size="sm" onClick={addStep}>
                <FileText className="h-4 w-4 mr-2" /> Add Step-by-Step
            </Button>
        )}
      </div>
      
      {/* Active Content Inputs */}
      {otherContent.map(c => (
        <div key={c.id} className="space-y-2 border-l-4 border-primary/50 pl-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={c.type} className="capitalize font-semibold text-primary">
              {c.type === 'image' ? 'Image URL/Upload' : c.type === 'video' ? 'Video URL' : 'Audio URL/Upload'}
            </Label>
            <Button variant="destructive" size="sm" onClick={() => toggleContent(c.type)}>
                <X className='h-4 w-4' />
            </Button>
          </div>
          <Input 
            id={c.type} 
            value={c.value} 
            onChange={(e) => updateContentValue(c.type, e.target.value)} 
            placeholder={`Enter URL or path for ${c.type}`}
          />
        </div>
      ))}
      
      {/* Step-by-Step Section */}
      {stepContent.length > 0 && (
          <div className="space-y-4 border-t pt-4">
              <h4 className="text-lg font-semibold flex justify-between items-center">
                  Step-by-Step Instructions
                  <Button variant="outline" size="sm" onClick={addStep}>+ Add Step</Button>
              </h4>
              {stepContent.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{index + 1}</div>
                      <Textarea 
                          value={step.value} 
                          onChange={(e) => updateStepValue(index, e.target.value)} 
                          placeholder={`Step ${index + 1} description`}
                          className="flex-grow"
                      />
                      <Button variant="ghost" size="icon" className="flex-shrink-0 mt-1" onClick={() => removeStep(step.id)}>
                          <X className="h-4 w-4 text-destructive" />
                      </Button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default ContentUploadSection;
