'use client';

import React, { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Type, Upload, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogContentItem {
  id: string;
  type: 'text' | 'file'; // Simplified types
  mediaType?: 'image' | 'video'; // Distinguish file type
  value: string; // Text content or local file URL
}

interface BlogContentBuilderProps {
  content: BlogContentItem[];
  onContentChange: (newContent: BlogContentItem[]) => void;
}

const BlogContentBuilder: React.FC<BlogContentBuilderProps> = ({ content, onContentChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentBlockId = useRef<string | null>(null);

  const updateItem = useCallback((id: string, value: string) => {
    onContentChange(content.map(item => item.id === id ? { ...item, value } : item));
  }, [content, onContentChange]);

  const removeItem = useCallback((id: string) => {
    onContentChange(content.filter(item => item.id !== id));
  }, [content, onContentChange]);

  const addItem = useCallback((type: BlogContentItem['type']) => {
    onContentChange([...content, { id: `c-${Date.now()}`, type, value: '' }]);
  }, [content, onContentChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const id = currentBlockId.current;

    if (file && id) {
      const localUrl = URL.createObjectURL(file);
      const mediaType: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';

      onContentChange(content.map(item =>
        item.id === id ? { ...item, value: localUrl, mediaType } : item
      ));
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    currentBlockId.current = null;
  }, [content, onContentChange]);

  const triggerFileExplorer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    currentBlockId.current = id;
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*,video/*';
      fileInputRef.current.click();
    }
  };

  const renderContentBlock = (item: BlogContentItem) => {
    const isText = item.type === 'text';
    const isFile = item.type === 'file';
    const placeholderText = isText ? "Start typing your blog paragraph here..." : "Click to select file...";

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
          {isText && (
            <Textarea
              value={item.value}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder={placeholderText}
              className="min-h-[100px] text-base focus:border-primary/50 border-none resize-none shadow-none focus-visible:ring-0 w-full"
            />
          )}

          {isFile && (
            <div className="space-y-2">
              {!item.value ? (
                <div
                  className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => triggerFileExplorer(e, item.id)}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    Click to Upload Image or Video
                  </span>
                </div>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  {item.mediaType === 'image' && (
                    <img src={item.value} alt="Preview" className="max-h-64 w-full object-contain" />
                  )}
                  {item.mediaType === 'video' && (
                    <video src={item.value} controls className="max-h-64 w-full object-contain bg-black" />
                  )}
                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => triggerFileExplorer(e, item.id)}
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

      {/* Hidden Global File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

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
      <div className="flex justify-center pt-6">
        <div className="flex gap-3 p-3.5 rounded-full border bg-muted/50 shadow-xl">
          <Button variant="secondary" onClick={() => addItem('text')} className="gap-2">
            <Type className="h-4 w-4" /> Add Text
          </Button>
          <Button variant="secondary" onClick={() => addItem('file')} className="gap-2">
            <Upload className="h-4 w-4" /> Add File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogContentBuilder;
