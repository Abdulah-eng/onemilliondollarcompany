import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload, Image } from 'lucide-react';
import { LibraryCategory, LibraryItem } from '@/mockdata/library/mockLibrary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreationWrapperProps {
  children: React.ReactNode;
  category: LibraryCategory;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: () => void;
  // NEW PROPS
  formData: Partial<LibraryItem>; // Pass the form data to manage image state
  onFormChange: (field: keyof LibraryItem, value: any) => void;
}

const CATEGORY_DETAILS: Record<LibraryCategory, { title: string, emoji: string, heroUrl: string, intro: string }> = {
  'exercise': {
    title: 'New Fitness Item',
    emoji: '💪',
    heroUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99d4db2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Design a powerful exercise, from movement cues to equipment requirements.',
  },
  'recipe': {
    title: 'New Recipe/Meal',
    emoji: '🍎',
    heroUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Craft a delicious meal, complete with ingredients, allergies, and step-by-step instructions.',
  },
  'mental health': {
    title: 'New Wellness Activity',
    emoji: '🧘',
    heroUrl: 'https://images.unsplash.com/photo-1557342777-a8a2d1d2b86a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    intro: 'Build a guided meditation, breathing exercise, or mindful activity.',
  },
};

const LibraryCreationWrapper: React.FC<CreationWrapperProps> = ({ children, category, isEditing, onBack, onSubmit, formData, onFormChange }) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.exercise;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Determine the current image URL: use user-set imageUrl first, then default heroUrl.
  const currentImageUrl = (formData as any).imageUrl || details.heroUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-900">
        <img 
          src={currentImageUrl} 
          alt={`${details.title} hero image`} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = details.heroUrl; }} // Fallback if user URL fails
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            {isEditing ? 'Editing' : details.title} {details.emoji}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{details.intro}</p>
        </div>
      </div>
      
      {/* HERO IMAGE UPLOADER (NEW!) */}
      <div className="bg-card p-4 rounded-xl shadow-md border space-y-2">
        <Label htmlFor="hero-image" className="flex items-center text-lg font-semibold text-primary">
          <Image className="h-5 w-5 mr-2" /> Custom Hero Image URL
        </Label>
        <div className="flex gap-2">
            <Input 
                id="hero-image" 
                value={(formData as any).imageUrl || ''} 
                onChange={(e) => onFormChange('imageUrl' as keyof LibraryItem, e.target.value)} 
                placeholder="Paste an image URL here to override the default hero image"
                className="flex-grow"
            />
            <Button variant="outline" className='flex-shrink-0'>
                <Upload className="h-4 w-4 mr-2" /> Upload File
            </Button>
        </div>
        <p className="text-xs text-muted-foreground">Note: Pasting a URL above will instantly update the hero image preview.</p>
      </div>

      {/* Main Form Content */}
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 space-y-8">
        {children}
      </div>

      {/* Fixed Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:static md:p-0 md:border-none md:flex md:justify-end md:gap-4">
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
