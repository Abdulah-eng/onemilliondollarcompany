'use client';

import React, { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Type, Image, Video, Upload, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// NOTE: Item type is simplified to 'text' or 'file', 
// but 'value' stores the local URL/path/text content.
export interface BlogContentItem {
  id: string;
  type: 'text' | 'file'; // Simplified types
  mediaType?: 'image' | 'video'; // New field to distinguish file type
  value: string; // Text content or local file URL
}

interface BlogContentBuilderProps {
  content: BlogContentItem[];
  onContentChange: (newContent: BlogContentItem[]) => void;
}

const BlogContentBuilder: React.FC<BlogContentBuilderProps> = ({ content, onContentChange }) => {
  // Ref to track which file input to open/update
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateItem = useCallback((id: string, value: string) => {
    onContentChange(content.map(item => item.id === id ? { ...item, value } : item));
  }, [content, onContentChange]);

  const removeItem = useCallback((id: string) => {
    onContentChange(content.filter(item => item.id !== id));
  }, [content, onContentChange]);

  const addItem = useCallback((type: BlogContentItem['type'], mediaType?: BlogContentItem['mediaType']) => {
    onContentChange([...content, { id: `c-${Date.now()}`, type, mediaType, value: '' }]);
  }, [content, onContentChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>, id: string, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      // Use FileReader or URL.createObjectURL for local preview
      const localUrl = URL.createObjectURL(file);
      
      onContentChange(content.map(item => 
        item.id === id ? { ...item, value: localUrl, mediaType: type } : item
      ));
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  }, [content, onContentChange]);
  
  const renderContentBlock = (item: BlogContentItem) => {
    const isText = item.type === 'text';
    const isFile = item.type === 'file';
    const mediaType = item.mediaType;
    const placeholderText = isText ? "Start typing your blog paragraph here..." : "Click to select file...";
    
    // Hidden File Input for the current block
    const HiddenFileInput = ({ type }: { type: 'image' | 'video' }) => (
        <input
            type="file"
            ref={el => fileInputRefs.current[`${item.id}-${type}`] = el}
            onChange={(e) => handleFileChange(e as any, item.id, type)}
            accept={type === 'image' ? 'image/*' : 'video/*'}
            className="hidden"
        />
    );
    
    // Helper function to trigger the hidden input
    const triggerFileExplorer = (e: React.MouseEvent, type: 'image' | 'video') => {
        e.stopPropagation();
        fileInputRefs.current[`${item.id}-${type}`]?.click();
    };


    return (
      <div 
        key={item.id} 
        className="relative p-5 rounded-xl border transition-all hover:shadow-lg hover:border-primary/50 bg-card group flex items-start space-x-4"
      >
        
        {/* Control Column */}
        <div className="flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab text-muted-foreground hover:bg-muted">
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Input Area */}
        <div className="flex-grow space-y-3">
          
          {/* Text Block */}
          {isText && (
            <Textarea
              value={item.value}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder={placeholderText}
              className="min-h-[100px] text-base focus:border-primary/50 border-none resize-none shadow-none focus-visible:ring-0 w-full" 
            />
          )}

          {/* File Upload Block */}
          {isFile && (
            <div className="space-y-2">
              <HiddenFileInput type={mediaType || 'image'} />
              
              {!item.value ? (
                // Empty Upload Zone
                <div 
                  className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => triggerFileExplorer(e, mediaType || 'image')} // Click to trigger upload
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    Click to Upload {mediaType === 'video' ? 'Video' : 'Image'}
                  </span>
                </div>
              ) : (
                // Preview Zone
                <div className="relative border rounded-lg overflow-hidden">
                    {mediaType === 'image' && (
                        <img src={item.value} alt="Preview" className="max-h-64 w-full object-contain" />
                    )}
                    {mediaType === 'video' && (
                        <div className="p-4 text-center bg-muted">
                            Video File Ready: {mediaType} (Click to replace)
                        </div>
                    )}
                    <Button 
                        variant="ghost" 
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                        onClick={(e) => triggerFileExplorer(e, mediaType || 'image')}
                    >
                        Replace
                    </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">Post Content Editor ✍️</h3>

      <AnimatePresence initial={false}>
        {content.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContentBlock(item)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Content Buttons (Simplified and Focused on Text/File) */}
      <div className="flex justify-center pt-6">
        <div className="flex gap-3 p-3.5 rounded-full border bg-muted/50 shadow-xl">
          <Button variant="secondary" onClick={() => addItem('text')} className="gap-2">
            <Type className="h-4 w-4" /> Add Text
          </Button>
          <Button variant="secondary" onClick={() => addItem('file', 'image')} className="gap-2">
            <Image className="h-4 w-4" /> Add Image
          </Button>
          <Button variant="secondary" onClick={() => addItem('file', 'video')} className="gap-2">
            <Video className="h-4 w-4" /> Add Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogContentBuilder;
