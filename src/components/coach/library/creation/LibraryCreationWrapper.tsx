import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Upload, Image, X } from 'lucide-react';
import { LibraryCategory, LibraryItem } from '@/mockdata/library/mockLibrary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  // Use a simulated 'currentImageUrl' state for demonstration, tied to the form data
  const userImageUrl = (formData as any).heroImageUrl;
  const currentImageUrl = userImageUrl || details.defaultHeroUrl;

  const handleSimulatedUpload = () => {
    // In a real application, this would trigger the file picker.
    // Here, we simulate a successful upload by setting a new placeholder image.
    const tempUrl = prompt("Enter Image URL (Simulated Upload):");
    if (tempUrl) {
      onFormChange('heroImageUrl' as keyof LibraryItem, tempUrl);
    }
  };

  const removeHeroImage = () => {
    onFormChange('heroImageUrl' as keyof LibraryItem, null);
  };


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
          onError={(e) => { e.currentTarget.src = details.defaultHeroUrl; }} // Fallback
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            {isEditing ? 'Editing' : details.title} {details.emoji}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{details.intro}</p>
        </div>
      </div>
      
      {/* HERO IMAGE UPLOAD ZONE (FIXED: Empty, Clickable Field) */}
      <div className="bg-card p-4 rounded-xl shadow-lg border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer" onClick={handleSimulatedUpload}>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Upload className="h-6 w-6 mr-3 text-primary" />
                <Label className="text-lg font-semibold text-primary/80 cursor-pointer">
                    Click here to Upload/Change Hero Image
                </Label>
            </div>
            {userImageUrl ? (
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); removeHeroImage(); }}>
                    <X className="h-4 w-4 mr-1" /> Remove Current
                </Button>
            ) : (
                <Image className="h-6 w-6 text-muted-foreground" />
            )}
        </div>
        <p className="text-sm text-muted-foreground ml-9 mt-1">PNG, JPG, or GIF (max 10MB). Best ratio: 16:9</p>
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
