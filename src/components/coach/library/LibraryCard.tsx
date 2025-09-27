'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LibraryItem } from '@/mockdata/library/mockLibrary';
import { Dumbbell, Utensils, Feather, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LibraryCardProps {
  item: LibraryItem;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, onEdit, onDelete }) => {
  
  const getDetails = () => {
    // ... (logic remains the same)
    let icon, primaryDetail, secondaryTag;
    
    switch (item.category) {
      case 'exercise':
        icon = <Dumbbell className="h-4 w-4" />;
        primaryDetail = item.muscleGroup || 'Full Body';
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

  // Placeholder for image based on category (URLs remain the same)
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
      className="col-span-1 group"
    >
      <Card className="rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/20 cursor-pointer flex flex-col h-full">
        
        {/* Top Image Section (Reduced Height) */}
        {/* Changed h-48 to h-40 */}
        <div className="relative **h-40** w-full bg-muted flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />

          {/* Category Tag (Smaller Bubble) */}
          {/* Changed text-xs to text-[10px] and reduced padding */}
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm **px-2 py-0.5** rounded-full **text-[10px]** font-semibold text-white flex items-center gap-1">
            {icon} {item.category.replace('mental health', 'Wellness')}
          </div>
          
          {/* Action Overlay (Smaller Buttons) */}
          {/* Changed p-3 to p-2 and h-8/w-8 to h-7/w-7 */}
          <div className='absolute top-0 right-0 **p-2** flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
             <Button variant="ghost" size="icon" className='**h-7 w-7** bg-background/70 hover:bg-background/90 text-primary' onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
               <Pencil className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className='**h-7 w-7** bg-background/70 hover:bg-background/90 text-destructive' onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
               <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Content Section (Reduced Padding/Font Sizes) */}
        {/* Changed p-4 to p-3, minHeight to 110px */}
        <CardContent className="**p-3** space-y-1 flex flex-col justify-between flex-grow" style={{ minHeight: '110px' }}>
          <div>
            <div className='flex items-start justify-between **mb-0**'>
              {/* Changed text-xl to text-lg */}
              <h3 className="**text-lg** font-bold leading-tight line-clamp-2 pr-2">{item.name}</h3>
              
              {/* Secondary Tag (Smaller Tag) */}
              {/* Changed text-xs to text-[10px] and reduced padding */}
              <span className={cn(
                '**text-[10px]** font-medium **px-2 py-0.5** rounded-full whitespace-nowrap flex-shrink-0 mt-0.5',
                item.isCustom ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'
              )}>
                {secondaryTag}
              </span>
            </div>

            {/* Changed text-sm to text-xs, reduced line-clamp height to 32px */}
            <p className="**text-xs** text-muted-foreground line-clamp-2 **h-[32px]**">
              {item.introduction}
            </p>
          </div>

          {/* Footer Detail (Reduced font size and padding) */}
          {/* Changed text-sm to text-xs and pt-2 to pt-1 */}
          <div className='**pt-1** **text-xs** font-semibold text-foreground/80 border-t border-border/70 **mt-auto**'>
            {primaryDetail}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LibraryCard;
