'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Type, Image, Video, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogContentItem {
  id: string;
  type: 'text' | 'image' | 'video';
  value: string; // Text content, Image URL, or Video URL
}

interface BlogContentBuilderProps {
  content: BlogContentItem[];
  onContentChange: (newContent: BlogContentItem[]) => void;
}

const BlogContentBuilder: React.FC<BlogContentBuilderProps> = ({ content, onContentChange }) => {
  const updateItem = useCallback((id: string, value: string) => {
    onContentChange(content.map(item => item.id === id ? { ...item, value } : item));
  }, [content, onContentChange]);

  const removeItem = useCallback((id: string) => {
    onContentChange(content.filter(item => item.id !== id));
  }, [content, onContentChange]);

  const addItem = useCallback((type: BlogContentItem['type']) => {
    onContentChange([...content, { id: `c-${Date.now()}`, type, value: '' }]);
  }, [content, onContentChange]);

  const renderContentBlock = (item: BlogContentItem) => {
    const isText = item.type === 'text';
    const isMedia = item.type === 'image' || item.type === 'video';
    const placeholderText = isText 
      ? "Start typing your blog paragraph here..." 
      : item.type === 'image' ? "Paste image URL or click to upload..." : "Paste video link (e.g., YouTube)...";

    return (
      <div 
        key={item.id} 
        className="relative p-4 rounded-xl border transition-all hover:shadow-lg hover:border-primary/50 bg-card group flex items-start space-x-2"
      >
        
        {/* Control Column (Drag Handle & Delete) */}
        <div className="flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
              className="min-h-[100px] text-base focus:border-primary/50 border-none resize-none shadow-none focus-visible:ring-0 p-0"
            />
          )}

          {/* Media Block */}
          {isMedia && (
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground pt-1">
                {item.type === 'image' ? <Image className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                {item.type === 'image' ? 'Image URL/Upload' : 'Video Link (Embed)'}
              </div>
              <Input
                value={item.value}
                onChange={(e) => updateItem(item.id, e.target.value)}
                placeholder={placeholderText}
              />
            </div>
          )}
          
          {/* Media Preview */}
          {item.type === 'image' && item.value && (
              <img src={item.value} alt="Preview" className="mt-2 max-h-64 w-full object-contain rounded-lg border" />
          )}
          
          {item.type === 'video' && item.value && (
              <div className="mt-2 p-3 bg-muted rounded-lg text-center text-sm text-muted-foreground">
                  Video Embed Preview: {item.value}
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

      {/* Add Content Buttons (Floating, Centered) */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-3 p-3 rounded-full border bg-muted/50 shadow-xl">
          <Button variant="secondary" onClick={() => addItem('text')} className="gap-2">
            <Type className="h-4 w-4" /> Text
          </Button>
          <Button variant="secondary" onClick={() => addItem('image')} className="gap-2">
            <Image className="h-4 w-4" /> Image
          </Button>
          <Button variant="secondary" onClick={() => addItem('video')} className="gap-2">
            <Video className="h-4 w-4" /> Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogContentBuilder;
