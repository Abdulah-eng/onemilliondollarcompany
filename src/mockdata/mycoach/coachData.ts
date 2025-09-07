// src/mockdata/mycoach/coachData.ts
import { File, MessageSquare } from 'lucide-react';

/*
  TODO: Backend Integration Notes
  - `coachInfo`: Fetch from a coach profile table. The single coach's data is likely stored here[cite: 167].
  - `feedbackHistory`: Join the `feedback` and `program_logs` tables to pull feedback left by the coach on a client's program entries.
  - `sharedFiles`: Query the `files` table for files shared with the current user.
*/

export const coachInfo = {
  name: 'Sophia Miller',
  bio: 'A certified fitness and nutrition coach with a passion for helping people build sustainable, healthy habits. My goal is to empower you to take control of your well-being through personalized programs and continuous support. I believe in a holistic approach, blending physical training with mental resilience.',
  specialties: ['Fitness', 'Nutrition', 'Mental Health'],
  profileImageUrl: 'https://images.unsplash.com/photo-1594381830635-4db9d54e4c3b?q=80&w=1200',
  email: 'sophia.miller@trainwise.com',
};

export const feedbackHistory = [
  {
    id: 1,
    date: '2025-08-28',
    type: 'Fitness',
    title: 'Full Body Strength Session',
    message: 'Great work on increasing your reps! Keep pushing on the overhead press.',
    icon: MessageSquare,
  },
  {
    id: 2,
    date: '2025-08-27',
    type: 'Nutrition',
    title: 'Macros Check-in',
    message: 'Excellent job logging your meals. Consider adding more healthy fats to your diet.',
    icon: MessageSquare,
  },
  {
    id: 3,
    date: '2025-08-25',
    type: 'Mental Health',
    title: 'Mindful Morning Routine',
    message: 'Happy to hear the morning routine is helping! Let me know if you want to try new meditation exercises.',
    icon: MessageSquare,
  },
];

export const sharedFiles = [
  {
    id: 1,
    name: 'Your Welcome Guide.pdf',
    description: 'An introduction to the platform and your journey. ',
    date: '2025-08-20',
    icon: File,
  },
  {
    id: 2,
    name: 'First Program Assigned.pdf',
    description: 'A summary of your first assigned program. ',
    date: '2025-08-21',
    icon: File,
  },
  {
    id: 3,
    name: 'Goal Setting Workbook.pdf',
    description: 'Direct file for setting your long-term goals. [cite: 217]',
    date: '2025-08-23',
    icon: File,
  },
];
