// src/mockdata/viewprograms/mocknutritionprograms.ts

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  id: string;
  name: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  title: string;
  macros: MacroNutrients;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
}

export interface DetailedNutritionTask {
  id: string;
  date: string;
  title: string;
  coachNotes: string;
  meals: Meal[];
}

const mockNutritionData: DetailedNutritionTask[] = [
  {
    id: 'nutri101',
    date: '2025-08-30T00:00:00.000Z',
    title: 'Balanced Fueling Plan',
    coachNotes: "Focus on hydration today! Aim for at least 8 glasses of water. These meals are designed for sustained energy. Enjoy!",
    meals: [
      {
        id: 'meal1',
        name: 'Breakfast',
        title: 'Protein Oatmeal',
        macros: { calories: 450, protein: 30, carbs: 55, fat: 12 },
        ingredients: [
          { name: 'Rolled Oats', amount: '1/2 cup' },
          { name: 'Protein Powder', amount: '1 scoop' },
          { name: 'Berries', amount: '1/2 cup' },
          { name: 'Almond Milk', amount: '1 cup' },
        ],
        instructions: [
          'Combine oats, almond milk, and protein powder in a saucepan.',
          'Cook over medium heat until creamy.',
          'Top with fresh berries and enjoy.',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1593560708947-8a5015b2d847?q=80&w=800',
      },
      {
        id: 'meal2',
        name: 'Lunch',
        title: 'Grilled Chicken Salad',
        macros: { calories: 550, protein: 45, carbs: 30, fat: 25 },
        ingredients: [
          { name: 'Chicken Breast', amount: '150g' },
          { name: 'Mixed Greens', amount: '3 cups' },
          { name: 'Avocado', amount: '1/2' },
          { name: 'Vinaigrette', amount: '2 tbsp' },
        ],
        instructions: [
          'Grill chicken breast until cooked through.',
          'Chop chicken and combine with mixed greens and avocado.',
          'Drizzle with vinaigrette dressing.',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1551248429-42971d15c8ab?q=80&w=800',
      },
       {
        id: 'meal3',
        name: 'Dinner',
        title: 'Salmon & Quinoa',
        macros: { calories: 600, protein: 40, carbs: 50, fat: 28 },
        ingredients: [
          { name: 'Salmon Fillet', amount: '150g' },
          { name: 'Quinoa', amount: '1 cup cooked' },
          { name: 'Asparagus', amount: '1 bunch' },
          { name: 'Lemon', amount: '1/2' },
        ],
        instructions: [
          'Bake salmon at 400°F (200°C) for 12-15 minutes.',
          'Roast asparagus with olive oil and salt.',
          'Serve salmon and asparagus over a bed of quinoa with a squeeze of lemon.',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800',
      },
    ],
  },
];

export const findNutritionProgramById = (id: string): DetailedNutritionTask | null => {
  return mockNutritionData.find(p => p.id === id) || null;
};
