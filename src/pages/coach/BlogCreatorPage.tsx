'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload, X, Pencil, Camera, Zap, Utensils, Feather } from 'lucide-react';
import { BlogPost, BlogCategory } from '@/mockdata/blog/mockBlog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import BlogContentBuilder, { BlogContentItem } from '@/components/coach/blog/BlogContentBuilder';

interface BlogCreatorPageProps {
  onBack: () => void;
  onSubmit: (post: BlogPost) => void;
  initialPost: Partial<BlogPost> | null;
}

const CATEGORY_MAP: Record<BlogCategory, { label: string; emoji: string; defaultHeroUrl: string }> = {
  'fitness': { label: 'Fitness', emoji: '💪', defaultHeroUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99d4db2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'nutrition': { label: 'Nutrition', emoji: '🍎', defaultHeroUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'mental health': { label: 'Wellness', emoji: '🧘', defaultHeroUrl: 'https://images.unsplash.com/photo-1557342777-a8a2d1d2b86a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
};
const allCategories: BlogCategory[] = ['fitness', 'nutrition', 'mental health'];

// Simple conversion helper for content display (since the mock uses a single string)
const initialContentItems: BlogContentItem[] = [
    { id: 'c-1', type: 'text', value: initialPost?.content || '' }
];
// NOTE: For a proper implementation, initialPost.content should be stored as JSON/array of BlogContentItem

const BlogCreatorPage: React.FC<BlogCreatorPageProps> = ({ onBack, onSubmit, initialPost }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [contentItems, setContentItems] = useState<BlogContentItem[]>(initialContentItems);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialPost?.id;
  const currentCategory = (formData.category as BlogCategory) || 'fitness'; // Default to fitness
  const emoji = CATEGORY_MAP[currentCategory].emoji;

  useEffect(() => {
    // Initialize form data, ensuring content is an array if editing
    setFormData({
      ...initialPost,
      category: initialPost?.category || 'fitness',
      isPublished: initialPost?.isPublished ?? false,
    });
  }, [initialPost]);

  const handleFormChange = useCallback((field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleContentChange = useCallback((newItems: BlogContentItem[]) => {
    setContentItems(newItems);
  }, []);

  const handleSubmit = () => {
    if (!formData.title || !formData.introduction) {
      alert("Please fill in the Title and Introduction.");
      return;
    }
    
    // Combine content blocks into a single string (simple model support)
    const combinedContent = contentItems.map(item => `[${item.type.toUpperCase()}] ${item.value}`).join('\n\n');

    const finalPost: BlogPost = {
      id: formData.id || `blog-${Date.now()}`,
      category: formData.category as BlogCategory,
      title: formData.title,
      introduction: formData.introduction || '',
      content: combinedContent,
      imageUrl: (formData as any).heroImageUrl || '', // Use the set hero image
      createdAt: formData.createdAt || new Date().toISOString(),
      isPublished: formData.isPublished ?? true,
    };

    onSubmit(finalPost);
  };
  
  // Hero Interaction Handlers (from LibraryCreatorPage)
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      handleFormChange('imageUrl' as keyof BlogPost, localUrl);
      event.target.value = '';
    }
  };

  const removeHeroImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    handleFormChange('imageUrl' as keyof BlogPost, null);
  };

  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const hasUserImage = !!formData.imageUrl;
  const currentImageUrl = formData.imageUrl || CATEGORY_MAP[currentCategory].defaultHeroUrl;


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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* HERO SECTION - CANVAS */}
      <div 
        className={cn(
            "relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-200 dark:bg-gray-800 group cursor-pointer border-4 border-dashed border-transparent hover:border-primary/50 transition-all",
            !hasUserImage && "border-primary/30"
        )}
        onClick={triggerFileInput} 
      >
        {/* Image Display or EMPTY STATE */}
        {hasUserImage ? (
            <img 
                src={currentImageUrl} 
                alt={`${formData.title || 'New Post'} hero image`} 
                className="w-full h-full object-cover" 
            />
        ) : (
             <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/80">
                 <Upload className="h-12 w-12 mb-3 text-primary" />
                 <span className="text-lg font-semibold">Click to Upload Hero Image</span>
                 <span className="text-sm">Recommended aspect ratio 16:9</span>
             </div>
        )}
        
        {/* Overlay Gradient */}
        {hasUserImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/30 to-transparent"></div>
        )}
        
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
                <Label htmlFor="category" className="text-lg font-bold flex items-center">Category 🏷️</Label>
                <select 
                    id="category" 
                    value={formData.category} 
                    onChange={(e) => handleFormChange('category', e.target.value as BlogCategory)} 
                    className="w-full h-10 px-3 py-2 border rounded-lg bg-input dark:bg-muted"
                >
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>
                            {CATEGORY_MAP[cat].label} {CATEGORY_MAP[cat].emoji}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="introduction" className="text-lg font-bold flex items-center">Short Introduction / Summary 📝</Label>
                <Textarea 
                    id="introduction" 
                    value={formData.introduction || ''} 
                    onChange={(e) => handleFormChange('introduction', e.target.value)} 
                    placeholder="A brief summary for card previews..."
                    className="min-h-[50px]"
                />
            </div>
        </div>
        
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
