// src/components/customer/viewprogram/nutrition/MealCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meal } from "@/mockdata/viewprograms/mocknutritionprograms";
import { Flame, Beef, Wheat, Leaf } from "lucide-react";

const InfoChip = ({ icon, value, label }: { icon: React.ReactNode, value: number, label: string }) => (
  <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
    {icon}
    <span>{value}{label}</span>
  </div>
);

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl dark:bg-card">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Image */}
        <div className="md:col-span-1 h-40 md:h-full">
          <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-primary mb-1">{meal.name}</p>
                <CardTitle className="text-2xl">{meal.title}</CardTitle>
              </div>
              <InfoChip icon={<Flame className="w-3.5 h-3.5 text-orange-500" />} value={meal.macros.calories} label="cal" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <InfoChip icon={<Beef className="w-3.5 h-3.5 text-red-500" />} value={meal.macros.protein} label="g P" />
              <InfoChip icon={<Wheat className="w-3.5 h-3.5 text-yellow-600" />} value={meal.macros.carbs} label="g C" />
              <InfoChip icon={<Leaf className="w-3.5 h-3.5 text-green-500" />} value={meal.macros.fat} label="g F" />
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Ingredients:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                {meal.ingredients.map(ing => (
                  <li key={ing.name}>
                    <span className="font-medium text-foreground">{ing.name}:</span> {ing.amount}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
