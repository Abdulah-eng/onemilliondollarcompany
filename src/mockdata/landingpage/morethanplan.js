import { BookOpen, MessageSquareText, BarChart3, Library } from 'lucide-react';

export const MORE_THAN_PLAN_FEATURES = [
  {
    id: 'blog',
    tabName: 'Blog & Insights',
    icon: BookOpen, // Changed from JSX to a component reference
    title: 'Deepen Your Understanding',
    description:
      'Go beyond the basics with our regularly updated blog. Find actionable tips and in-depth guides on fitness, nutrition, and mental wellness, all curated by your coach to support your journey.',
    points: [
      'Evidence-based articles and guides',
      'Practical tips you can implement immediately',
      'Categorized for easy browsing',
    ],
    image: '/src/assets/more-than-plan-blogaccess.webp',
  },
  {
    id: 'feedback',
    tabName: 'Coach Feedback',
    icon: MessageSquareText, // Changed from JSX to a component reference
    title: 'Your Personal Guide',
    description:
      'Never feel lost or unmotivated. Our premium plan includes direct, consistent feedback from your coach to keep you accountable, refine your technique, and celebrate your wins.',
    points: [
      'Personalized check-ins on your progress',
      'Answers to your questions and adjustments',
      'Motivation when you need it most',
    ],
    image: '/src/assets/more-than-plan-coachfeedback.webp',
  },
  {
    id: 'tracking',
    tabName: 'Insightful Tracking',
    icon: BarChart3, // Changed from JSX to a component reference
    title: 'Visualize Your Success',
    description:
      'Log your workouts, meals, and reflections with ease. Our intuitive tracking tools help you see how far you’ve come, identify patterns, and stay focused on your long-term goals.',
    points: [
      'Log reps, sets, weights, and meal portions',
      'Review your history and trends over time',
      'Track mental health journaling and exercises',
    ],
    image: '/src/assets/more-than-plan-reflectandtrack.webp',
  },
  {
    id: 'library',
    tabName: 'Resource Library',
    icon: Library, // Changed from JSX to a component reference
    title: 'An Entire Library at Your Fingertips',
    description:
      'Access a comprehensive, searchable library of exercises, recipes, and mental wellness practices. Each entry includes detailed instructions to ensure you perform every action correctly and effectively.',
    points: [
      'Searchable exercise database with demos',
      'Healthy and delicious recipes for any diet',
      'Guided mental wellness practices',
    ],
    image: '/src/assets/more-than-plan-knowledge.webp',
  },
];
