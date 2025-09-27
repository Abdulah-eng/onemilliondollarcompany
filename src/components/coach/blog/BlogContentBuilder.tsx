'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Type, Image, Video, Plus, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Content structure for the blog post
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
      <div key={item.id} className="relative p-4 rounded-xl border bg-card shadow-md group">
        
        {/* Drag Handle and Delete Button */}
        <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {/* Drag Handle (Simulated) */}
          <Button variant="ghost" size="icon" className="cursor-grab text-muted-foreground">
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Input */}
        {isText ? (
          <Textarea
            value={item.value}
            onChange={(e) => updateItem(item.id, e.target.value)}
            placeholder={placeholderText}
            className="min-h-[100px] text-base focus:border-primary/50"
          />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              {item.type === 'image' ? <Image className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
              {item.type === 'image' ? 'Image URL/Upload' : 'Video Link'}
            </div>
            <Input
              value={item.value}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder={placeholderText}
            />
          </div>
        )}
        
        {/* Media Preview (Simple) */}
        {item.type === 'image' && item.value && (
            <img src={item.value} alt="Preview" className="mt-4 max-h-48 w-full object-contain rounded-lg border" />
        )}
        
        {item.type === 'video' && item.value && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Video Preview: {item.value} (Placeholder)
            </div>
        )}
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

      {/* Add Content Buttons */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-3 p-3 rounded-full border bg-muted/50 shadow-inner">
          <Button variant="secondary" onClick={() => addItem('text')}>
            <Type className="h-4 w-4 mr-2" /> Add Text Block
          </Button>
          <Button variant="secondary" onClick={() => addItem('image')}>
            <Image className="h-4 w-4 mr-2" /> Add Image
          </Button>
          <Button variant="secondary" onClick={() => addItem('video')}>
            <Video className="h-4 w-4 mr-2" /> Add Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogContentBuilder;
