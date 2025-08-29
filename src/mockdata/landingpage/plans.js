// File: src/mockdata/landingpage/plans.js
export const PLANS = [
  {
    name: 'Premium',
    price: '$29.99',
    oldPrice: '$59.99', // Added for discount effect
    period: 'month',
    summary: 'Everything you need to transform',
    ctaText: 'Choose Premium',
    planKey: 'premium',
    popular: true,
    features: [
      { text: 'Fitness, Nutrition & Mental Health Programs', included: true },
      { text: 'Full Exercise & Recipe Library', included: true },
      { text: 'Direct Coach Feedback & Support', included: true },
      { text: 'Advanced Progress Tracking', included: true },
      { text: 'Personalized Motivation & Check-ins', included: true },
    ],
  },
  {
    name: 'Standard',
    price: '$14.99',
    oldPrice: '$29.99', // Added for discount effect
    period: 'month',
    summary: 'Perfect for focused goals',
    ctaText: 'Try 14 Days Free',
    planKey: 'standard',
    popular: false,
    features: [
      { text: '1 Program Access (Fitness, Nutrition, or Mental)', included: true },
      { text: 'Full Exercise & Recipe Library', included: true },
      { text: 'Blog & Educational Content', included: true },
      { text: 'Coach Feedback & Support', included: false },
      { text: 'Advanced Progress Tracking', included: false },
    ],
  },
  {
    name: 'Basic (One-Time)',
    price: '$17.99',
    oldPrice: '$24.99', // Added for discount effect
    period: 'One-Time',
    summary: 'A single program purchase',
    ctaText: 'Buy Now',
    planKey: 'basic',
    popular: false,
    features: [
      { text: 'One Assigned Program PDF (Forever Access)', included: true },
      { text: '30-Day Platform Access to Log Progress', included: true },
      { text: 'Blog & Educational Content', included: true },
      { text: 'Coach Feedback & Support', included: false },
    ],
  },
];
