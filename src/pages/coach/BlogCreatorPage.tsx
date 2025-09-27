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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; 

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

  // ... (useEffect, handleFormChange, handleContentChange, handleSubmit, Hero Handlers remain the same) ...
  useEffect(() => {
    setFormData({
      ...initialPost,
      title: initialPost?.title || '',
      introduction: initialPost?.introduction || '',
      category: initialPost?.category || 'fitness',
      isPublished: initialPost?.isPublished ?? false,
    });
    if (initialPost?.content) {
        // NOTE: In a real app, you would parse the JSON string back into blocks here.
        setContentItems([{ id: 'c-1', type: 'text', value: initialPost.content }]);
    } else {
        setContentItems([{ id: 'c-1', type: 'text', value: '' }]);
    }
  }, [initialPost]);

  const handleFormChange = useCallback((field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleContentChange = useCallback((newItems: BlogContentItem[]) => {
    setContentItems(newItems);
  }, []);
  
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
    
    const combinedContent = JSON.stringify(contentItems);

    const finalPost: BlogPost = {
      id: formData.id || `blog-${Date.now()}`,
      category: formData.category as BlogCategory,
      title: formData.title,
      introduction: formData.introduction,
      content: combinedContent,
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
      // FIX 1: Reduced max-width (max-w-3xl -> max-w-2xl) and adjusted vertical spacing (space-y-6)
      className="space-y-6 **max-w-2xl** mx-auto" 
    >
      
      {/* ACTION BUTTONS (TOP) */}
      <div className="flex items-center justify-between **pb-4 border-b**"> {/* Reduced padding slightly */}
        <Button variant="outline" onClick={onBack} className="gap-2 **text-sm**">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Button>
        <Button onClick={handleSubmit} className="gap-2 bg-primary hover:bg-primary/90 **text-sm**">
          <Save className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Publish Post'}
        </Button>
      </div>
      
      {/* HIDDEN FILE INPUT */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* HERO SECTION - CANVAS */}
      <div 
        className={cn(
            // FIX 2: Reduced height (h-64/h-80 -> h-56/h-72)
            "relative **h-56 md:h-72** rounded-xl overflow-hidden shadow-xl group cursor-pointer border-4 border-dashed transition-all",
            !hasUserImage ? "border-primary/30 bg-gray-100 dark:bg-gray-800" : "border-transparent"
        )}
        onClick={triggerFileInput} 
      >
        {/* ... (Image/Empty State/Overlay code remains the same) ... */}
        {hasUserImage ? (
            <img 
                src={formData.imageUrl} 
                alt={`${formData.title || 'New Post'} hero image`} 
                className="w-full h-full object-cover" 
            />
        ) : (
             <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/80">
                 <Upload className="h-10 w-10 mb-3 text-primary" /> {/* Reduced icon size */}
                 <span className="text-base font-semibold">Click to Upload Hero Image</span> {/* Reduced text size */}
                 <span className="text-sm">Recommended aspect ratio 16:9</span>
             </div>
        )}
        
        {hasUserImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/30 to-transparent"></div>
        )}
        
        <div className="absolute top-3 right-3 z-10 flex gap-2"> {/* Reduced top/right padding */}
            {hasUserImage && (
                <Button variant="destructive" size="icon" className="rounded-full **h-7 w-7** bg-black/50 hover:bg-black/80" onClick={removeHeroImage}><X className="h-4 w-4" /></Button>
            )}
            <Button variant="default" size="icon" className="rounded-full **h-7 w-7** bg-black/50 hover:bg-black/80 text-white" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }} ><Camera className="h-4 w-4" /></Button>
        </div>

        {/* Content Overlay (Bottom Left - Title) */}
        <div className="absolute bottom-0 left-0 **p-5 md:p-6** w-full z-20"> {/* Reduced padding */}
          
          {/* TITLE FIELD (Click-to-Edit) */}
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
                // FIX 3: Reduced font size again
                className="**text-3xl md:text-4xl** font-extrabold bg-transparent text-white border-primary w-full p-1 placeholder:text-gray-300"
                placeholder={`Your Blog Post Title ${emoji}`}
                onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
              />
            ) : (
              // Reduced static font size
              <h1 className="**text-3xl md:text-4xl** font-extrabold text-white mb-2 group-hover:bg-black/10 group-hover:p-1 group-hover:rounded transition-colors">
                {formData.title || `Your Blog Post Title ${emoji}`}
                <Pencil className="h-5 w-5 ml-2 inline text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* CORE FORM CONTENT */}
      {/* FIX 4: Reduced padding: p-8/p-10 -> p-6/p-8 */}
      <div className="bg-card **p-6 md:p-8** rounded-xl shadow-lg border border-border/50 space-y-6"> 
        
        {/* CATEGORY & INTRODUCTION */}
        <div className="space-y-6"> 
            {/* Category Selector */}
            <div className="space-y-3"> 
                <Label htmlFor="category" className="**text-lg** font-bold flex items-center">
                    Select Topic Category 🏷️
                </Label>
                <ToggleGroup 
                    type="single" 
                    value={formData.category as string} 
                    onValueChange={(value) => handleFormChange('category', value as BlogCategory)}
                    className="flex justify-start **p-1** rounded-lg bg-muted/50 border shadow-inner" // Reduced padding and border radius
                >
                    {allCategories.map(cat => {
                        const detail = CATEGORY_DETAILS[cat];
                        const Icon = detail.icon;
                        return (
                            <ToggleGroupItem 
                                key={cat} 
                                value={cat} 
                                className={cn(
                                    // Reduced padding: px-5 py-2.5 -> px-4 py-2
                                    "**px-4 py-2** text-sm font-semibold rounded-md transition-all border", 
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
            <div className="space-y-3">
                <Label htmlFor="introduction" className="**text-lg** font-bold flex items-center">
                    Short Introduction / Summary 📝
                </Label>
                <Textarea 
                    id="introduction" 
                    value={formData.introduction || ''} 
                    onChange={(e) => handleFormChange('introduction', e.target.value)} 
                    placeholder="A brief summary for card previews (max 2 lines)..."
                    className="**min-h-[70px] text-sm**" // Reduced min height and font size
                />
            </div>
        </div>
        
        {/* Separator before dynamic content */}
        <div className="border-t border-border/50 **my-4**"></div> 

        {/* BLOG CONTENT BUILDER */}
        <BlogContentBuilder content={contentItems} onContentChange={handleContentChange} />
        
        {/* PUBLISH TOGGLE */}
        <div className="flex items-center space-x-2 border-t **pt-4**">
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
