import fitnessImage from '@/assets/feature-fitness.jpg';
import nutritionImage from '@/assets/feature-nutrition.jpg';
import mentalImage from '@/assets/feature-mental.jpg';

export const FEATURE_CARDS = [
  {
    image: fitnessImage,
    title: 'Customized Training',
    category: 'Fitness', // ✅ Category added
    description: 'Workouts that match your goals, past injuries, and lifestyle, ensuring you get the most effective training possible.',
  },
  {
    image: nutritionImage,
    title: 'Eat With Strategy',
    category: 'Nutrition', // ✅ Category added
    description: 'Personalized meals, dynamic grocery lists, and recipes based on your real nutritional needs and preferences.',
  },
  {
    image: mentalImage,
    title: 'Mind-First Coaching',
    category: 'Mental Health', // ✅ Category added
    description: 'Mental health tools, guided meditations, and journaling to improve clarity, sleep, and stress management.',
  },
];
