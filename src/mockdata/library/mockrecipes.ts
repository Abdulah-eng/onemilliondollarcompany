// src/mockdata/library/mockrecipes.ts

export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: { amount: string; name: string }[];
  instructions: string[];
}

const mockRecipes: Recipe[] = [
  {
    id: "recipe-1",
    name: "Grilled Chicken Salad",
    imageUrl: "/images/recipes/grilled-chicken-salad.png",
    description: "A light and refreshing salad, perfect for a post-workout lunch.",
    prepTime: "10 min",
    cookTime: "15 min",
    calories: 450,
    protein: 40,
    carbs: 15,
    fats: 25,
    ingredients: [
      { amount: "200g", name: "Chicken Breast" },
      { amount: "100g", name: "Mixed Greens" },
      { amount: "50g", name: "Cherry Tomatoes" },
      { amount: "1/4", name: "Cucumber, sliced" },
      { amount: "2 tbsp", name: "Olive Oil Vinaigrette" },
    ],
    instructions: [
      "Season the chicken breast with salt and pepper.",
      "Grill the chicken for 6-8 minutes per side, until cooked through.",
      "While the chicken is cooking, combine the mixed greens, cherry tomatoes, and cucumber in a large bowl.",
      "Once cooked, let the chicken rest for a few minutes before slicing it.",
      "Add the sliced chicken to the salad, drizzle with vinaigrette, and toss to combine.",
    ],
  },
  {
    id: "recipe-2",
    name: "Protein Oats",
    imageUrl: "/images/recipes/protein-oats.png",
    description: "A hearty and protein-packed breakfast to start your day strong.",
    prepTime: "5 min",
    cookTime: "5 min",
    calories: 380,
    protein: 30,
    carbs: 50,
    fats: 8,
    ingredients: [
      { amount: "50g", name: "Rolled Oats" },
      { amount: "1 scoop", name: "Whey Protein (Vanilla)" },
      { amount: "150ml", name: "Almond Milk" },
      { amount: "1 tbsp", name: "Chia Seeds" },
      { amount: "Handful", name: "Berries for topping" },
    ],
    instructions: [
      "Combine oats and almond milk in a saucepan and cook over medium heat.",
      "Once the oats start to thicken, remove from heat and stir in the whey protein and chia seeds.",
      "Mix until smooth and well combined.",
      "Transfer to a bowl and top with your favorite berries.",
    ],
  },
];

export const findRecipeById = (id: string): Recipe | undefined => {
  return mockRecipes.find((r) => r.id === id);
};
