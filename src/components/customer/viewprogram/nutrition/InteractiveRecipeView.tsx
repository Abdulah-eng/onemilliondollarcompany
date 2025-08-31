// src/components/customer/viewprogram/nutrition/InteractiveRecipeView.tsx

import { useState, useMemo } from "react";
import { Recipe } from "@/mockdata/library/mockrecipes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, Users, ChefHat, Clock, Flame, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to format quantity for clean display
const formatQuantity = (quantity: number, unit: string) => {
  if (quantity === 0) return "0";
  let displayQuantity;

  // Handle pluralization for common units
  const pluralUnit = quantity > 1 && unit && !unit.endsWith('s') ? `${unit}s` : unit;

  if (unit === "handful" || unit === "scoop") {
     displayQuantity = Math.round(quantity);
     return `${displayQuantity} ${pluralUnit}`;
  }
  // Avoid tiny decimals
  if (quantity < 0.1 && quantity > 0) displayQuantity = quantity.toFixed(2);
  else if (quantity < 1) displayQuantity = (Math.round(quantity * 100) / 100).toString();
  else displayQuantity = (Math.round(quantity * 100) / 100).toString().replace(/\.00$/, "");
  
  return `${displayQuantity} ${unit}`;
};

const MacroStat = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-background p-2 text-center">
    <p className="font-bold text-lg text-primary">{Math.round(value)}{unit}</p>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
  </div>
);

export default function InteractiveRecipeView({ recipe }: { recipe: Recipe }) {
  const [portions, setPortions] = useState(recipe.servings);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(recipe.instructions.length).fill(false)
  );

  const handleToggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const newCheckedState = [...prev];
      newCheckedState[index] = !newCheckedState[index];
      return newCheckedState;
    });
  };

  const { adjustedIngredients, adjustedNutrition } = useMemo(() => {
    const ratio = portions / recipe.servings;
    return {
      adjustedIngredients: recipe.ingredients.map(ing => ({
        ...ing,
        quantity: ing.quantity * ratio,
      })),
      adjustedNutrition: {
        calories: recipe.calories * ratio,
        protein: recipe.protein * ratio,
        carbs: recipe.carbs * ratio,
        fats: recipe.fats * ratio,
      }
    };
  }, [portions, recipe]);

  const IngredientsContent = () => (
    <div>
      <h3 className="font-bold text-lg mb-2 text-foreground">Ingredients</h3>
      <ul className="space-y-2">
        {adjustedIngredients.map((ing, index) => (
          <li key={index} className="flex items-center gap-3 text-sm p-2 bg-background rounded-md">
            <span className="font-bold text-primary">{formatQuantity(ing.quantity, ing.unit)}</span>
            <span className="text-muted-foreground">{ing.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
  const InstructionsContent = () => (
    <div>
      <h3 className="font-bold text-lg mb-2 text-foreground">Instructions</h3>
      <ol className="space-y-4">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
             <Checkbox
              id={`step-${index}`}
              checked={checkedSteps[index]}
              onCheckedChange={() => handleToggleStep(index)}
              className="mt-1 h-5 w-5 shrink-0"
            />
            <label htmlFor={`step-${index}`} className={cn("text-sm leading-relaxed text-muted-foreground", checkedSteps[index] && "line-through opacity-60")}>
              {step}
            </label>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="w-full space-y-6 sm:rounded-2xl sm:bg-card sm:border sm:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{recipe.name}</h2>
        <p className="mt-1 text-muted-foreground">{recipe.description}</p>
      </div>

      <div className="relative h-48 w-full rounded-xl overflow-hidden">
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-black/50 backdrop-blur-sm p-2 text-white">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span className="text-xs font-semibold">Prep: {recipe.prepTime}</span></div>
          <div className="flex items-center gap-2"><ChefHat className="w-4 h-4" /><span className="text-xs font-semibold">Cook: {recipe.cookTime}</span></div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Nutrition Facts</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            {/* Portion Adjuster */}
            <div className="flex-1 flex items-center justify-between gap-2 bg-background p-2 rounded-xl">
              <Button onClick={() => setPortions(p => Math.max(1, p - 1))} size="icon" variant="ghost" className="rounded-lg h-12 w-12"><Minus className="w-5 h-5" /></Button>
              <div className="flex flex-col items-center gap-1 font-bold text-lg text-foreground"><Users className="w-6 h-6 text-muted-foreground"/><span>{portions} Serving{portions > 1 && 's'}</span></div>
              <Button onClick={() => setPortions(p => p + 1)} size="icon" variant="ghost" className="rounded-lg h-12 w-12"><Plus className="w-5 h-5" /></Button>
            </div>
            {/* Dynamic Nutrition */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              <div className="flex flex-col col-span-1 items-center justify-center rounded-lg bg-primary/10 p-2 text-center">
                  <Flame className="w-6 h-6 text-primary mb-1"/>
                  <p className="font-bold text-lg text-primary">{Math.round(adjustedNutrition.calories)}</p>
                  <p className="text-xs text-muted-foreground font-medium">Calories</p>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <MacroStat label="Protein" value={adjustedNutrition.protein} unit="g" />
                <MacroStat label="Carbs" value={adjustedNutrition.carbs} unit="g" />
                <MacroStat label="Fats" value={adjustedNutrition.fats} unit="g" />
              </div>
            </div>
        </div>
      </div>
      
      {/* Desktop: Side-by-side layout */}
      <div className="hidden lg:grid grid-cols-5 gap-8 pt-4">
        <div className="col-span-2"><IngredientsContent /></div>
        <div className="col-span-3"><InstructionsContent /></div>
      </div>
      
      {/* Mobile & Tablet: Tabbed layout */}
      <div className="block lg:hidden">
        <Tabs defaultValue="ingredients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="pt-4"><IngredientsContent /></TabsContent>
          <TabsContent value="instructions" className="pt-4"><InstructionsContent /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
