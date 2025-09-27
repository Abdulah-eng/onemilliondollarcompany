import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload, Image, X, Pencil } from 'lucide-react';
import { LibraryCategory, LibraryItem } from '@/mockdata/library/mockLibrary';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface CreationWrapperProps {
  children: React.ReactNode;
  category: LibraryCategory;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: () => void;
  formData: Partial<LibraryItem>;
  onFormChange: (field: keyof LibraryItem, value: any) => void;
}

const CATEGORY_DETAILS: Record<LibraryCategory, { title: string, emoji: string, defaultHeroUrl: string, intro: string }> = {
  'exercise': {
    title: 'New Fitness Item',
    emoji: '💪',
    defaultHeroUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99d4db2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Design a powerful exercise, from movement cues to equipment requirements.',
  },
  'recipe': {
    title: 'New Recipe/Meal',
    emoji: '🍎',
    defaultHeroUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Craft a delicious meal, complete with ingredients, allergies, and step-by-step instructions.',
  },
  'mental health': {
    title: 'New Wellness Activity',
    emoji: '🧘',
    defaultHeroUrl: 'https://images.unsplash.com/photo-1557342777-a8a2d1d2b86a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Build a guided meditation, breathing exercise, or mindful activity.',
  },
};

const LibraryCreationWrapper: React.FC<CreationWrapperProps> = ({ children, category, isEditing, onBack, onSubmit, formData, onFormChange }) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.exercise;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const userImageUrl = (formData as any).heroImageUrl;
  const currentImageUrl = userImageUrl || details.defaultHeroUrl;
  
  // Use a state to manage editing mode for the title/intro (optional, but good UX)
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const handleSimulatedUpload = () => {
    // Show file picker simulation or ask for URL
    const tempUrl = prompt("Paste an image URL to set as Hero Image:");
    if (tempUrl) {
      onFormChange('heroImageUrl' as keyof LibraryItem, tempUrl);
    }
  };

  const removeHeroImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFormChange('heroImageUrl' as keyof LibraryItem, null);
  };

  const currentTitle = formData.name || details.title;
  const currentIntro = formData.introduction || details.intro;

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      
      {/* Hero Image Upload Button (Clickable, simplified) */}
      <div 
        className={cn(
            "bg-card p-3 rounded-xl shadow-lg border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer",
            userImageUrl ? 'h-auto' : 'h-16 flex items-center justify-center'
        )} 
        onClick={handleSimulatedUpload}
      >
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
                <Upload className="h-5 w-5 mr-3 text-primary" />
                <span className="text-lg font-semibold text-primary/80 cursor-pointer">
                    {userImageUrl ? "Hero Image Set. Click to Change." : "Click here to Set Hero Image"}
                </span>
            </div>
            {userImageUrl ? (
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 gap-1" onClick={removeHeroImage}>
                    <X className="h-4 w-4" /> Remove
                </Button>
            ) : (
                <Image className="h-6 w-6 text-muted-foreground" />
            )}
        </div>
      </div>

      {/* Hero Section - The Clickable Canvas */}
      <div 
        className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-900 group"
      >
        {/* Image Display */}
        <img 
          src={currentImageUrl} 
          alt={`${details.title} hero image`} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = details.defaultHeroUrl; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
          
          {/* TITLE FIELD (Click-to-Edit) */}
          <div 
            className="inline-block relative cursor-pointer"
            onClick={() => setIsTitleEditing(true)}
            onBlur={() => setIsTitleEditing(false)}
          >
            {isTitleEditing ? (
              <Input 
                autoFocus
                value={formData.name || ''} 
                onChange={(e) => onFormChange('name', e.target.value)} 
                className="text-4xl md:text-5xl font-extrabold bg-card/90 text-foreground border-primary w-full p-2"
                placeholder={details.title}
                onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:bg-black/10 group-hover:p-1 group-hover:rounded transition-colors">
                {currentTitle} {details.emoji}
                <Pencil className="h-5 w-5 ml-2 inline text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            )}
          </div>

          {/* INTRODUCTION FIELD (Click-to-Edit) */}
          <div 
            className="inline-block relative cursor-pointer mt-1"
            onClick={() => setIsIntroEditing(true)}
            onBlur={() => setIsIntroEditing(false)}
          >
            {isIntroEditing ? (
              <Textarea 
                autoFocus
                value={formData.introduction || ''} 
                onChange={(e) => onFormChange('introduction', e.target.value)} 
                className="text-lg bg-card/90 text-muted-foreground border-primary w-full p-2 min-h-[50px]"
                placeholder={details.intro}
              />
            ) : (
              <p className="text-muted-foreground text-lg max-w-2xl group-hover:bg-black/10 group-hover:p-1 group-hover:rounded transition-colors">
                {currentIntro}
                <Pencil className="h-4 w-4 ml-2 inline text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 space-y-8">
        {children}
      </div>

      {/* Fixed Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:static md:p-0 md:border-none md:flex md:justify-end md:gap-4 z-40">
        <Button variant="outline" onClick={onBack} className="w-full md:w-auto gap-2 mb-2 md:mb-0">
          <ChevronLeft className="h-4 w-4" /> Back to Library
        </Button>
        <Button onClick={onSubmit} className="w-full md:w-auto gap-2">
          <Save className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create Item'}
        </Button>
      </div>
      
      {/* Spacer for fixed footer */}
      <div className="md:hidden h-20"></div>
    </motion.div>
  );
};

export default LibraryCreationWrapper;
