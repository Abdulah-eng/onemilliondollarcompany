// ✅ 1. IMPORT YOUR LOCAL IMAGES HERE
// Make sure to place your images in the `src/assets/` folder
// and update the filenames below to match.
import fitnessImage from '@/assets/feature-fitness.jpg';
import nutritionImage from '@/assets/feature-nutrition.jpg';
import mentalImage from '@/assets/feature-mental.jpg';

export const FEATURE_CARDS = [
  {
    image: fitnessImage, // Use the imported image variable
    title: 'Customized Training',
    description: 'Workouts that match your goals, past injuries, and lifestyle, ensuring you get the most effective training possible.',
    themeClass: 'from-amber-50 to-orange-100 text-orange-900 dark:from-amber-950/70 dark:to-orange-900/70 dark:text-orange-100',
  },
  {
    image: nutritionImage, // Use the imported image variable
    title: 'Eat With Strategy',
    description: 'Personalized meals, dynamic grocery lists, and recipes based on your real nutritional needs and preferences.',
    themeClass: 'from-emerald-50 to-green-100 text-green-900 dark:from-emerald-950/70 dark:to-green-900/70 dark:text-green-100',
  },
  {
    image: mentalImage, // Use the imported image variable
    title: 'Mind-First Coaching',
    description: 'Mental health tools, guided meditations, and journaling to improve clarity, sleep, and stress management.',
    themeClass: 'from-violet-50 to-purple-100 text-purple-900 dark:from-violet-950/70 dark:to-purple-900/70 dark:text-purple-100',
  },
];
