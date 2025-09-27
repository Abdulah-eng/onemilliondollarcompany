import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';

interface CreationWrapperProps {
  children: React.ReactNode;
  category: LibraryCategory;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: () => void;
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

const LibraryCreationWrapper: React.FC<CreationWrapperProps> = ({ children, category, isEditing, onBack, onSubmit }) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.exercise;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto" // Tighter max-w-4xl for dashboard feel
    >
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-900">
        {/* Removed opacity from image for strong visibility */}
        <img src={details.heroUrl} alt="Hero background" className="w-full h-full object-cover" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            {isEditing ? 'Editing' : details.title} {details.emoji}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{details.intro}</p>
        </div>
      </div>
      
      {/* ... rest of the wrapper content remains the same ... */}
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 space-y-8">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:static md:p-0 md:border-none md:flex md:justify-end md:gap-4">
        <Button variant="outline" onClick={onBack} className="w-full md:w-auto gap-2 mb-2 md:mb-0">
          <ChevronLeft className="h-4 w-4" /> Back to Library
        </Button>
        <Button onClick={onSubmit} className="w-full md:w-auto gap-2">
          <Save className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create Item'}
        </Button>
      </div>
      
      <div className="md:hidden h-20"></div>
    </motion.div>
  );
};

export default LibraryCreationWrapper;
