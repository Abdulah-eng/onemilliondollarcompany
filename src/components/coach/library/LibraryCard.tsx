// src/components/coach/library/LibraryCard.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LibraryItem } from '@/mockdata/library/mockLibrary';
import { Dumbbell, Utensils, Feather, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LibraryCardProps {
  item: LibraryItem;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, onEdit, onDelete }) => {
  
  const getDetails = () => {
    let icon, primaryDetail, secondaryTag;
    
    switch (item.category) {
      case 'exercise':
        icon = <Dumbbell className="h-4 w-4" />;
        primaryDetail = item.muscleGroup;
        secondaryTag = item.isCustom ? 'Custom Workout' : 'Standard Exercise';
        break;
      case 'recipe':
        icon = <Utensils className="h-4 w-4" />;
        primaryDetail = item.allergies || 'Allergy Free';
        secondaryTag = item.isCustom ? 'Custom Recipe' : 'Meal Plan';
        break;
      case 'mental health':
        icon = <Feather className="h-4 w-4" />;
        primaryDetail = item.content?.[0]?.type === 'soundfile' ? 'Audio Session' : 'Guided Text';
        secondaryTag = item.isCustom ? 'My Activity' : 'Meditation';
        break;
    }
    return { icon, primaryDetail, secondaryTag };
  };

  const { icon, primaryDetail, secondaryTag } = getDetails();

  // Placeholder for image based on category (you'd replace this with actual image handling)
  const imageUrl = item.category === 'exercise' 
    ? "https://images.unsplash.com/photo-1549476483-e8893d56a337?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    : item.category === 'recipe' 
      ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      : "https://images.unsplash.com/photo-1517436034114-1e2b6e159046?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="col-span-1"
    >
      <Card className="group rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20 cursor-pointer">
        
        {/* Top Image Section */}
        <div className="relative h-48 w-full bg-muted">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />

          {/* Category Tag (Top Left Bubble) */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
            {icon} {item.category.replace(' ', ' ')}
          </div>
          
          {/* Action Overlay (Hidden until hover/focus) */}
          <div className='absolute top-0 right-0 p-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
             <Button variant="ghost" size="icon" className='h-8 w-8 bg-background/70 hover:bg-background/90 text-primary' onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                <Edit className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className='h-8 w-8 bg-background/70 hover:bg-background/90 text-destructive' onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-2">
          <div className='flex items-center justify-between'>
            <CardTitle className="text-xl font-bold leading-tight">{item.name}</CardTitle>
            
            {/* Secondary Tag (Top Rated/Business Host equivalent) */}
            <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap',
                item.isCustom ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'
            )}>
                {secondaryTag}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.introduction}
          </p>

          {/* Footer Detail */}
          <div className='pt-2 text-sm font-semibold text-foreground/80'>
            {primaryDetail}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LibraryCard;
