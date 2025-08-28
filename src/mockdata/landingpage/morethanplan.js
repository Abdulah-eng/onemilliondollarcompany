import knowledgeImg from '@/assets/more-than-plan-knowledge.webp';
import coachImg from '@/assets/more-than-plan-coachfeedback.webp';
import blogImg from '@/assets/more-than-plan-blogaccess.webp';
import reflectImg from '@/assets/more-than-plan-reflectandtrack.webp';

export const MORE_THAN_PLAN = [
  {
    title: 'Knowledge Library',
    description:
      'Explore how-to guides, recipe collections, and mental health exercises—all in one place to level up your wellness journey.',
    category: 'Library',
    image: knowledgeImg,
    gradient: 'from-teal-400 via-green-400 to-emerald-500',
  },
  {
    title: 'Personal Follow-Up',
    description:
      'Stay on track with tailored programs and direct coach support to ensure you achieve your goals without getting off course.',
    category: 'Coaching',
    image: coachImg,
    gradient: 'from-indigo-400 via-purple-400 to-indigo-600',
  },
  {
    title: 'Insights & Blog',
    description:
      'Read tips, tricks, and insights on fitness, nutrition, and mental health to stay informed and inspired every day.',
    category: 'Blog',
    image: blogImg,
    gradient: 'from-amber-400 via-orange-400 to-yellow-500',
  },
  {
    title: 'Reflect & Track',
    description:
      'Log your progress and reflect on your journey, keeping track of your history to measure growth and success.',
    category: 'Tracking',
    image: reflectImg,
    gradient: 'from-pink-400 via-rose-400 to-fuchsia-500',
  },
];
