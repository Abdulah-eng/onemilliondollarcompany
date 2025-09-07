// src/mockdata/mycoach/coachData.ts
import { File, MessageSquare, Pin } from 'lucide-react';

/*
  TODO: Backend Integration Notes
  - `coachInfo`: Fetch from a coach profile table. [cite_start]The single coach's data is likely stored here[cite: 167].
  - `feedbackHistory`: Join the `feedback` and `program_logs` tables to pull feedback left by the coach on a client's program entries.
  - `sharedFiles`: Query the `files` table for files shared with the current user.
  - `chatMessages`: Fetch from a new `messages` table filtered by the current user and coach.
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
    type: 'Feedback',
    title: 'Full Body Strength Session',
    message: 'Great work on increasing your reps! Keep pushing on the overhead press.',
    icon: MessageSquare,
  },
  {
    id: 2,
    date: '2025-08-27',
    type: 'Check-in',
    title: 'Hydration Check-in',
    message: "Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!",
    icon: Pin,
  },
  {
    id: 3,
    date: '2025-08-25',
    type: 'Feedback',
    title: 'Mindful Morning Routine',
    message: 'Happy to hear the morning routine is helping! Let me know if you want to try new meditation exercises.',
    icon: MessageSquare,
  },
];

export const sharedFiles = [
  {
    id: 1,
    name: 'Your Welcome Guide.pdf',
    description: 'An introduction to the platform and your journey.',
    date: '2025-08-20',
    icon: File,
  },
  {
    id: 2,
    name: 'First Program Assigned.pdf',
    description: 'A summary of your first assigned program.',
    date: '2025-08-21',
    icon: File,
  },
  {
    id: 3,
    name: 'Goal Setting Workbook.pdf',
    description: 'Direct file for setting your long-term goals.',
    date: '2025-08-23',
    icon: File,
  },
];

export const chatMessages = [
    {
        id: 1,
        sender: 'coach',
        text: 'Hey Alex, just checking in on how you felt after the last workout.',
        timestamp: '2025-09-06T10:00:00Z',
    },
    {
        id: 2,
        sender: 'customer',
        text: 'Hey Sophia! The workout felt great, but the squats were tough.',
        timestamp: '2025-09-06T10:05:00Z',
    },
    {
        id: 3,
        sender: 'coach',
        text: 'That’s normal, focus on your form and you’ll get stronger. Let me know if you have any questions.',
        timestamp: '2025-09-06T10:10:00Z',
    },
];
