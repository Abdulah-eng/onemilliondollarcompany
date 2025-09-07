// src/mockdata/mycoach/coachData.ts
import { File, MessageSquare, Pin, BarChart2, Star } from 'lucide-react';

/*
  TODO: Backend Integration Notes
  - `coachInfo`: Fetch from a coach profile table.
  - `feedbackHistory`: Join the `feedback` and `program_logs` tables to pull feedback left by the coach on a client's program entries.
  - `sharedFiles`: Query the `files` table for files shared with the current user.
  - `dailyMessage`: Fetch a specific daily message for the current user from a `daily_messages` table.
*/

export const coachInfo = {
  name: 'Sophia Miller',
  bio: 'A certified fitness and nutrition coach with a passion for helping people build sustainable, healthy habits. My goal is to empower you to take control of your well-being through personalized programs and continuous support. I believe in a holistic approach, blending physical training with mental resilience.',
  specialties: ['Fitness', 'Nutrition', 'Mental Health'],
  profileImageUrl: 'https://images.unsplash.com/photo-1594381830635-4db9d54e4c3b?q=80&w=1200',
  email: 'sophia.miller@trainwise.com',
};

export const dailyMessage = {
  id: 1,
  title: 'Morning Motivation',
  content: "Remember, every small step forward is progress. You've got this! ✨",
};

export const feedbackHistory = [
  {
    id: 1,
    date: '2025-09-05',
    type: 'Program Feedback',
    title: 'Full Body Strength Session',
    message: 'Great work on increasing your reps! Keep pushing on the overhead press. You’re doing fantastic!',
    icon: MessageSquare,
  },
  {
    id: 2,
    date: '2025-09-04',
    type: 'Check-in',
    title: 'Weekly Program Check-in',
    message: "Hey Hanna! On a scale of 1-10, how is your program feeling this week? Any feedback on your energy levels or motivation?",
    rating: null,
    comment: null,
    icon: Pin,
  },
  {
    id: 3,
    date: '2025-09-02',
    type: 'Pinpoint',
    title: 'Cardio Intervals',
    message: 'Next week, let’s try increasing the intensity on your interval runs. You can add 15 seconds to each high-intensity sprint. Let me know how it feels!',
    icon: BarChart2,
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
