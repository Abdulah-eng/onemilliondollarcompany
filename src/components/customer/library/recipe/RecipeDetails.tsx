// src/components/customer/library/recipe/RecipeDetails.tsx

import { useState, useMemo } from "react";
import { Recipe } from "@/mockdata/library/mockrecipes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ChefHat, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper and KeyStat components remain the same...
const formatQuantity = (quantity: number, unit: string) => {
  if (quantity === 0) return "0";
  let displayQuantity;
  const pluralUnit =
    quantity > 1 && unit && !unit.endsWith("s") ? `${unit}s` : unit;
  if (unit === "handful" || unit === "scoop") {
    displayQuantity = Math.round(quantity);
    return `${displayQuantity} ${pluralUnit}`;
  }
  if (quantity < 0.1 && quantity > 0) displayQuantity = quantity.toFixed(2);
  else if (quantity < 1)
    displayQuantity = (Math.round(quantity * 100) / 100).toString();
  else
    displayQuantity = (Math.round(quantity * 100) / 100)
      .toString()
      .replace(/\.00$/, "");

  return `${displayQuantity} ${unit}`;
};

const KeyStat = ({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-1">
    <Icon className="w-6 h-6 text-primary" />
    <span className="font-bold text-base text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const [portions, setPortions] = useState(recipe.servings);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(recipe.instructions.length).fill(false)
  );

  const handleToggleStep = (index: number) => {
    setCheckedSteps((prev) => {
      const newCheckedState = [...prev];
      newCheckedState[index] = !newCheckedState[index];
      return newCheckedState;
    });
  };

  const { adjustedIngredients, adjustedNutrition } = useMemo(() => {
    const ratio = portions / recipe.servings;
    return {
      adjustedIngredients: recipe.ingredients.map((ing) => ({
        ...ing,
        quantity: ing.quantity * ratio,
      })),
      adjustedNutrition: {
        calories: recipe.calories * ratio,
      },
    };
  }, [portions, recipe]);

  return (
    <div className="w-full space-y-6">
        {/* Image always stretches to edges */}
        <div className="w-full aspect-square overflow-hidden rounded-2xl bg-muted">
            <img 
                src={recipe.imageUrl} 
                alt={recipe.name}
                className="w-full h-full object-cover"
            />
        </div>

        {/* ✅ Main content container, now px-0 for mobile. Padding for internal elements is controlled individually. */}
        <div className="px-0 sm:px-4 space-y-6">
            {/* Portion Adjuster - maintains internal padding for good look */}
            <div className="flex justify-center">
                <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-full shadow-sm">
                    <Button onClick={() => setPortions((p) => Math.max(1, p - 1))} size="icon" variant="ghost" className="rounded-full h-10 w-10">
                        <Minus className="w-5 h-5" />
                    </Button>
                    <span className="font-bold text-xl w-12 text-center">{portions}</span>
                    <Button onClick={() => setPortions((p) => p + 1)} size="icon" variant="ghost" className="rounded-full h-10 w-10">
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Title and Description - uses px-4 for readability, but content container is px-0 */}
            <div className="text-center space-y-3 px-4 sm:px-0"> {/* ✅ Added px-4 for mobile, px-0 for desktop */}
                <h2 className="text-3xl font-extrabold tracking-tight">{recipe.name}</h2>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">{recipe.description}</p>
            </div>

            {/* Key Stats - maintains internal padding for good look */}
            <div className="flex justify-around items-center p-4 bg-background rounded-2xl mx-4 sm:mx-0"> {/* ✅ Added mx-4 for mobile, mx-0 for desktop to constrain */}
                <KeyStat icon={Clock} value={recipe.prepTime} label="Prep" />
                <KeyStat icon={ChefHat} value={recipe.cookTime} label="Cook" />
                <KeyStat icon={Flame} value={`${Math.round(adjustedNutrition.calories)}`} label="Calories"/>
            </div>

            <div className="px-4 sm:px-0"> {/* ✅ Added px-4 for mobile, px-0 for desktop to contain Tabs */}
                <Tabs defaultValue="ingredients">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ingredients" className="pt-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Ingredients for {portions} serving{portions > 1 && "s"}</h3>
                        <ul className="space-y-3 px-0"> {/* ✅ Removed px-4/sm:px-0 here to ensure list items are also edge-to-edge */}
                        {adjustedIngredients.map((ing, index) => (
                            <li key={index} className="flex justify-between items-center text-base p-3 bg-background rounded-lg">
                            <span className="text-muted-foreground">{ing.name}</span>
                            <span className="font-semibold text-primary">{formatQuantity(ing.quantity, ing.unit)}</span>
                            </li>
                        ))}
                        </ul>
                    </TabsContent>
                    <TabsContent value="instructions" className="pt-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Instructions</h3>
                        <ol className="space-y-4 px-0"> {/* ✅ Removed px-4/sm:px-0 here to ensure list items are also edge-to-edge */}
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                            <Checkbox id={`step-${index}`} checked={checkedSteps[index]} onCheckedChange={() => handleToggleStep(index)} className="mt-1 h-5 w-5 shrink-0"/>
                            <label htmlFor={`step-${index}`} className={cn("text-base leading-relaxed text-muted-foreground", checkedSteps[index] && "line-through opacity-60")}>
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
