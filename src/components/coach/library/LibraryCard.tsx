// src/components/coach/library/LibraryCard.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LibraryItem } from '@/mockdata/library/mockLibrary';
import { Dumbbell, Utensils, Feather, Clock, Zap, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface LibraryCardProps {
  item: LibraryItem;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, onEdit, onDelete }) => {
  
  const getIconAndDetails = () => {
    switch (item.category) {
      case 'exercise':
        return {
          icon: <Dumbbell className="h-5 w-5 text-primary" />,
          detail: item.muscleGroup,
          badge: 'Muscle Group',
        };
      case 'recipe':
        return {
          icon: <Utensils className="h-5 w-5 text-green-500" />,
          detail: item.allergies || 'No allergies listed',
          badge: 'Allergies',
        };
      case 'mental health':
        const duration = (item.content as any).find((c: any) => c.type === 'soundfile' || c.type === 'video')?.value || 'N/A';
        return {
          icon: <Feather className="h-5 w-5 text-purple-500" />,
          detail: item.content.length > 0 ? (item.content[0].type === 'soundfile' ? 'Audio Session' : 'Guided Content') : 'Text Based',
          badge: 'Content Type',
        };
    }
  };

  const { icon, detail, badge } = getIconAndDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden">
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className='flex items-center gap-3'>
            {icon}
            <CardTitle className="text-lg font-semibold truncate max-w-[150px] sm:max-w-xs">{item.name}</CardTitle>
          </div>
          
          {/* Action Buttons */}
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
             <Button variant="ghost" size="icon" className='h-8 w-8 text-primary' onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className='h-8 w-8 text-destructive' onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.introduction}
          </p>
          <div className='flex flex-wrap items-center gap-3 text-xs'>
            <span className='font-medium capitalize px-2 py-1 bg-secondary rounded-full'>
                {item.category.replace(' ', '-')}
            </span>
            <span className='text-muted-foreground'>
                {badge}: <span className='font-medium text-foreground capitalize'>{detail}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LibraryCard;
