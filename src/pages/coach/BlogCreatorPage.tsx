'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload, X, Pencil, Camera, Zap, Utensils, Feather } from 'lucide-react';
import { BlogPost, BlogCategory, mockBlogPosts, CATEGORY_DETAILS } from '@/mockdata/blog/mockBlog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import BlogContentBuilder, { BlogContentItem } from '@/components/coach/blog/BlogContentBuilder';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // Assuming you have a ToggleGroup component

interface BlogCreatorPageProps {
  onBack: () => void;
  onSubmit: (post: BlogPost) => void;
  initialPost: Partial<BlogPost> | null;
}

const allCategories: BlogCategory[] = ['fitness', 'nutrition', 'mental health'];

const BlogCreatorPage: React.FC<BlogCreatorPageProps> = ({ onBack, onSubmit, initialPost }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [contentItems, setContentItems] = useState<BlogContentItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialPost?.id;
  const currentCategory: BlogCategory = (formData.category as BlogCategory) || 'fitness';
  const emoji = CATEGORY_DETAILS[currentCategory]?.emoji || '✍️';
  const heroColor = CATEGORY_DETAILS[currentCategory]?.color || 'bg-gray-800';

  useEffect(() => {
    setFormData({
      ...initialPost,
      title: initialPost?.title || '',
      introduction: initialPost?.introduction || '',
      category: initialPost?.category || 'fitness',
      isPublished: initialPost?.isPublished ?? false,
    });

    // Simple conversion: if editing and content is a string, create one text block.
    if (initialPost?.content) {
        // Simple heuristic: if content is a string, put it in one text block
        setContentItems([{ id: 'c-1', type: 'text', value: initialPost.content }]);
    } else {
        // Start with one empty text block for a new post
        setContentItems([{ id: 'c-1', type: 'text', value: '' }]);
    }
  }, [initialPost]);

  const handleFormChange = useCallback((field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleContentChange = useCallback((newItems: BlogContentItem[]) => {
    setContentItems(newItems);
  }, []);
  
  // Hero Interaction Handlers
  const triggerFileInput = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      handleFormChange('imageUrl', localUrl);
      event.target.value = '';
    }
  };
  const removeHeroImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    handleFormChange('imageUrl', null);
  };
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const hasUserImage = !!formData.imageUrl;


  const handleSubmit = () => {
    if (!formData.title || !formData.introduction || !formData.category) {
      alert("Please ensure the Title, Introduction, and Category are set.");
      return;
    }
    
    // Combine content blocks back into a storable format (using JSON stringify for the modern approach)
    const combinedContent = JSON.stringify(contentItems);

    const finalPost: BlogPost = {
      id: formData.id || `blog-${Date.now()}`,
      category: formData.category as BlogCategory,
      title: formData.title,
      introduction: formData.introduction,
      content: combinedContent, // Store as JSON string of blocks
      imageUrl: formData.imageUrl || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      isPublished: formData.isPublished ?? false,
    };

    onSubmit(finalPost);
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      
      {/* ACTION BUTTONS (TOP) */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Button>
        <Button onClick={handleSubmit} className="gap-2 bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Publish Post'}
        </Button>
      </div>
      
      {/* HIDDEN FILE INPUT */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* HERO SECTION - CANVAS (Cleaned up gradients) */}
      <div 
        className={cn(
            "relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-4 border-dashed transition-all",
            !hasUserImage ? "border-primary/30 bg-gray-100 dark:bg-gray-800" : "border-transparent"
        )}
        onClick={triggerFileInput} 
      >
        {/* Image Display or EMPTY STATE */}
        {hasUserImage ? (
            <img 
                src={formData.imageUrl} 
                alt={`${formData.title || 'New Post'} hero image`} 
                className="w-full h-full object-cover" 
            />
        ) : (
             <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/80">
                 <Upload className="h-12 w-12 mb-3 text-primary" />
                 <span className="text-lg font-semibold">Click to Upload Hero Image</span>
             </div>
        )}
        
        {/* Overlay Gradient (Ensures text contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/30 to-transparent"></div>
        
        {/* Click Indicator / Remove Button (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            {hasUserImage && (
                <Button variant="destructive" size="icon" className="rounded-full h-8 w-8 bg-black/50 hover:bg-black/80" onClick={removeHeroImage}><X className="h-4 w-4" /></Button>
            )}
            <Button variant="default" size="icon" className="rounded-full h-8 w-8 bg-black/50 hover:bg-black/80 text-white" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }} ><Camera className="h-4 w-4" /></Button>
        </div>

        {/* Content Overlay (Bottom Left - Title) */}
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
          <div 
            className="inline-block relative"
            onClick={(e) => { e.stopPropagation(); setIsTitleEditing(true); }}
            onBlur={() => setIsTitleEditing(false)}
          >
            {isTitleEditing ? (
              <Input 
                autoFocus
                value={formData.title || ''} 
                onChange={(e) => handleFormChange('title', e.target.value)} 
                className="text-4xl md:text-5xl font-extrabold bg-transparent text-white border-primary w-full p-2 placeholder:text-gray-300"
                placeholder={`Your Blog Post Title ${emoji}`}
                onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:bg-black/10 group-hover:p-1 group-hover:rounded transition-colors">
                {formData.title || `Your Blog Post Title ${emoji}`}
                <Pencil className="h-5 w-5 ml-2 inline text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* CORE FORM CONTENT */}
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 space-y-8">
        
        {/* CATEGORY & INTRODUCTION */}
        <div className="space-y-4">
            {/* Category Selector (Modern Segmented Control) */}
            <div className="space-y-2">
                <Label htmlFor="category" className="text-xl font-bold flex items-center">
                    Select Topic Category 🏷️
                </Label>
                {/* Assuming ToggleGroup is available from your UI library */}
                <ToggleGroup 
                    type="single" 
                    value={formData.category as string} 
                    onValueChange={(value) => handleFormChange('category', value as BlogCategory)}
                    className="flex justify-start space-x-3 p-1 rounded-xl bg-muted/50 border shadow-inner"
                >
                    {allCategories.map(cat => {
                        const detail = CATEGORY_DETAILS[cat];
                        const Icon = detail.icon;
                        return (
                            <ToggleGroupItem 
                                key={cat} 
                                value={cat} 
                                className={cn(
                                    "px-4 py-2 text-base font-semibold rounded-lg transition-all border",
                                    formData.category === cat ? `${detail.color} text-white hover:${detail.color}/90 border-transparent` : 'bg-card text-foreground hover:bg-muted/80 border-border'
                                )}
                            >
                                <Icon className="h-4 w-4 mr-2" /> {detail.label}
                            </ToggleGroupItem>
                        );
                    })}
                </ToggleGroup>
            </div>
            
            {/* Introduction */}
            <div className="space-y-2">
                <Label htmlFor="introduction" className="text-xl font-bold flex items-center">
                    Short Introduction / Summary 📝
                </Label>
                <Textarea 
                    id="introduction" 
                    value={formData.introduction || ''} 
                    onChange={(e) => handleFormChange('introduction', e.target.value)} 
                    placeholder="A brief summary for card previews (max 2 lines)..."
                    className="min-h-[60px]"
                />
            </div>
        </div>
        
        {/* Separator before dynamic content */}
        <div className="border-t border-border/50"></div> 

        {/* BLOG CONTENT BUILDER */}
        <BlogContentBuilder content={contentItems} onContentChange={handleContentChange} />
        
        {/* PUBLISH TOGGLE */}
        <div className="flex items-center space-x-2 border-t pt-4">
            <input 
                type="checkbox" 
                id="isPublished" 
                checked={formData.isPublished ?? false} 
                onChange={(e) => handleFormChange('isPublished', e.target.checked)} 
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor="isPublished" className="text-base font-semibold">Publish immediately?</Label>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCreatorPage;
