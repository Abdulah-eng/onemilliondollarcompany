import { useState, useMemo } from "react";
import { Recipe } from "@/mockdata/library/mockrecipes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ChefHat, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to format quantity
const formatQuantity = (quantity: number, unit: string) => {
  if (quantity === 0) return "0";
  let displayQuantity;
  const pluralUnit = quantity > 1 && unit && !unit.endsWith('s') ? `${unit}s` : unit;
  if (unit === "handful" || unit === "scoop") {
     displayQuantity = Math.round(quantity);
     return `${displayQuantity} ${pluralUnit}`;
  }
  if (quantity < 0.1 && quantity > 0) displayQuantity = quantity.toFixed(2);
  else if (quantity < 1) displayQuantity = (Math.round(quantity * 100) / 100).toString();
  else displayQuantity = (Math.round(quantity * 100) / 100).toString().replace(/\.00$/, "");
  
  return `${displayQuantity} ${unit}`;
};

const KeyStat = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <Icon className="w-6 h-6 text-primary" />
    <span className="font-bold text-base text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
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
      }
    };
  }, [portions, recipe]);

  return (
    <div className="relative w-full">
      {/* Background highlight - hidden on mobile */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-primary/10 dark:bg-primary/5 rounded-t-3xl hidden sm:block" />

      {/* Recipe image popping out */}
      <div className="relative flex justify-center -mt-10 sm:-mt-10">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover border-4 sm:border-8 border-card shadow-xl -mb-12 sm:-mb-16"
        />
      </div>

      {/* Content container - full width on mobile, card on desktop */}
      <div className="relative bg-card w-screen left-1/2 -ml-[50vw] sm:w-full sm:left-auto sm:ml-0 -mt-6 sm:mt-0 p-4 sm:p-8 sm:rounded-3xl space-y-6 sm:space-y-8 sm:shadow-sm">
        
        {/* Portion Adjuster */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-full shadow-sm">
            <Button onClick={() => setPortions(p => Math.max(1, p - 1))} size="icon" variant="ghost" className="rounded-full h-10 w-10"><Minus className="w-5 h-5" /></Button>
            <span className="font-bold text-xl w-12 text-center">{portions}</span>
            <Button onClick={() => setPortions(p => p + 1)} size="icon" variant="ghost" className="rounded-full h-10 w-10"><Plus className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Title + Description */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{recipe.name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">{recipe.description}</p>
        </div>

        {/* Key Stats */}
        <div className="flex justify-around items-center p-3 sm:p-4 bg-background rounded-xl sm:rounded-2xl shadow-sm">
          <KeyStat icon={Clock} value={recipe.prepTime} label="Prep" />
          <KeyStat icon={ChefHat} value={recipe.cookTime} label="Cook" />
          <KeyStat icon={Flame} value={`${Math.round(adjustedNutrition.calories)}`} label="Calories" />
        </div>

        {/* Ingredients + Instructions */}
        <div>
          <Tabs defaultValue="ingredients">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Ingredients for {portions} serving{portions > 1 && 's'}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {adjustedIngredients.map((ing, index) => (
                  <li key={index} className="flex justify-between items-center text-sm sm:text-base p-2 sm:p-3 bg-background rounded-lg">
                    <span className="text-muted-foreground">{ing.name}</span>
                    <span className="font-semibold text-primary">{formatQuantity(ing.quantity, ing.unit)}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="instructions" className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Instructions</h3>
              <ol className="space-y-3 sm:space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <Checkbox
                      id={`step-${index}`}
                      checked={checkedSteps[index]}
                      onCheckedChange={() => handleToggleStep(index)}
                      className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0"
                    />
                    <label htmlFor={`step-${index}`} className={cn("text-sm sm:text-base leading-relaxed text-muted-foreground", checkedSteps[index] && "line-through opacity-60")}>
                      {step}
                    </label>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
