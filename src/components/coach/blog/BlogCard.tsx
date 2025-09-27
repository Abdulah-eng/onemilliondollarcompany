'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost, BlogCategory } from '@/mockdata/blog/mockBlog';
import { Dumbbell, Utensils, Feather, Trash2, Pencil, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_MAP: Record<BlogCategory, { icon: React.ElementType, tag: string }> = {
  'fitness': { icon: Dumbbell, tag: 'Fitness 💪' },
  'nutrition': { icon: Utensils, tag: 'Nutrition 🍎' },
  'mental health': { icon: Feather, tag: 'Wellness 🧘' },
};

const BlogCard: React.FC<BlogCardProps> = ({ post, onEdit, onDelete }) => {
  const details = CATEGORY_MAP[post.category];
  const Icon = details.icon;
  const time = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="col-span-1 group"
    >
      <Card className="rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/20 cursor-pointer flex flex-col h-full">
        
        {/* Top Image Section (Fixed Height) */}
        <div className="relative h-40 w-full bg-muted flex-shrink-0">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          )}

          {/* Category Tag (Top Left Bubble) */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
            <Icon className="h-3 w-3" /> {details.tag}
          </div>
          
          {/* Status Tag (Top Right) */}
          <span className={cn(
            "absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
            post.isPublished ? 'bg-green-500/80 text-white' : 'bg-orange-500/80 text-white'
          )}>
            {post.isPublished ? 'Published' : 'Draft'}
          </span>

          {/* Action Overlay */}
          <div className='absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30'>
             <Button variant="default" size="icon" className='h-10 w-10' onClick={(e) => { e.stopPropagation(); onEdit(post); }}>
               <Pencil className="h-5 w-5" />
             </Button>
             <Button variant="destructive" size="icon" className='h-10 w-10' onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}>
               <Trash2 className="h-5 w-5" />
             </Button>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-2 flex flex-col justify-between flex-grow" style={{ minHeight: '110px' }}>
          <div>
            <h3 className="text-lg font-bold leading-tight line-clamp-2 pr-2">{post.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 h-[32px] mt-1">
              {post.introduction}
            </p>
          </div>

          {/* Footer Detail - Timeline */}
          <div className='pt-2 text-xs font-medium text-muted-foreground/80 border-t border-border/70 mt-auto flex items-center'>
            <Calendar className="h-3 w-3 mr-1" /> Created: {time}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
