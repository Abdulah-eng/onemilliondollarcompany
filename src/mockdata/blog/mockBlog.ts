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
  {
    id: 'blog-1',
    category: 'fitness',
    title: 'The 5x5 Workout Plan Explained',
    introduction: 'A classic strength routine perfect for beginner to intermediate lifters.',
    content: 'Details about the routine...',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99d4db2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: '2025-09-25T10:00:00Z',
    isPublished: true,
  },
  {
    id: 'blog-2',
    category: 'nutrition',
    title: 'Decoding Intermittent Fasting',
    introduction: 'A guide to popular fasting schedules and their metabolic benefits.',
    content: 'Details about fasting...',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: '2025-09-24T15:30:00Z',
    isPublished: true,
  },
  {
    id: 'blog-3',
    category: 'mental health',
    title: '5 Steps to Better Sleep Hygiene',
    introduction: 'Simple daily habits you can implement for deeper, more restful sleep.',
    content: 'Details about sleep...',
    imageUrl: 'https://images.unsplash.com/photo-1517436034114-1e2b6e159046?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: '2025-09-23T08:45:00Z',
    isPublished: false,
  },
];
