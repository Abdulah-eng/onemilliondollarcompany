// src/components/customer/library/recipe/RecipeDetails.tsx

import { Recipe } from "@/mockdata/library/mockrecipes";
import { Flame, PieChart, ChefHat, Clock } from "lucide-react";

const MacroStat = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-background p-2 text-center">
    <p className="font-bold text-lg text-primary">{value}{unit}</p>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
  </div>
);

export default function RecipeDetails({ recipe }: { recipe: Recipe }) {
  return (
    <div className="w-full space-y-6 sm:rounded-2xl sm:bg-card sm:border sm:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{recipe.name}</h2>
        <p className="mt-1 text-muted-foreground">{recipe.description}</p>
      </div>

      <div className="relative h-48 w-full rounded-xl overflow-hidden">
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-black/50 backdrop-blur-sm p-2 text-white">
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                <span className="text-xs font-semibold">Cook: {recipe.cookTime}</span>
            </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Nutrition Facts</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col col-span-1 items-center justify-center rounded-lg bg-primary/10 p-2 text-center">
             <Flame className="w-6 h-6 text-primary mb-1"/>
             <p className="font-bold text-lg text-primary">{recipe.calories}</p>
             <p className="text-xs text-muted-foreground font-medium">Calories</p>
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-2">
            <MacroStat label="Protein" value={recipe.protein} unit="g" />
            <MacroStat label="Carbs" value={recipe.carbs} unit="g" />
            <MacroStat label="Fats" value={recipe.fats} unit="g" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, index) => (
            <li key={index} className="flex items-center gap-3 text-sm p-2 bg-background rounded-md">
              <span className="font-bold text-primary">{ing.amount}</span>
              <span>{ing.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-3">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="text-sm leading-relaxed">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
