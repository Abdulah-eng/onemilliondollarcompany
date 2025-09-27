// Add imports for icons (assuming you use Lucide)
import { Dumbbell, Utensils, Feather } from 'lucide-react';
import React from 'react';

export type BlogCategory = 'fitness' | 'nutrition' | 'mental health';

export interface BlogPost {
  id: string;
  category: BlogCategory;
  title: string;
  introduction: string;
  content: string; // Simplified content field
  imageUrl?: string;
  createdAt: string; // ISO Date string for timeline
  isPublished: boolean;
}

export const mockBlogPosts: BlogPost[] = [
  // ... (mock data entries remain the same)
];

// NEW: Add visual details for modern category selector
export const CATEGORY_DETAILS: Record<BlogCategory, { label: string, emoji: string, icon: React.ElementType, color: string }> = {
    'fitness': { label: 'Fitness', emoji: '💪', icon: Dumbbell, color: 'bg-green-500' },
    'nutrition': { label: 'Nutrition', emoji: '🍎', icon: Utensils, color: 'bg-orange-500' },
    'mental health': { label: 'Wellness', emoji: '🧘', icon: Feather, color: 'bg-indigo-500' },
};

// ... (Rest of the file)
