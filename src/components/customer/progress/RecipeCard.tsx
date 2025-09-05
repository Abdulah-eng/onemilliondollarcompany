import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Recipe } from '@/mockdata/progress/mockProgressData';

const MacroChip = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="text-xs text-center">
        <p className={`font-bold ${color}`}>{value}g</p>
        <p className="text-muted-foreground">{label}</p>
    </div>
);

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <div className="p-3 rounded-xl border border-border/50 space-y-3 bg-white dark:bg-transparent transition-colors duration-200">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <img src={recipe.imageUrl} alt={recipe.name} className="h-14 w-14 rounded-lg object-cover" />
                </div>
                <div>
                    <p className="font-semibold leading-tight text-gray-900 dark:text-white">{recipe.name}</p>
                    <p className="text-xs text-muted-foreground">{recipe.portion}</p>
                </div>
            </div>
            <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                <div className="text-center">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{recipe.calories}</p>
                    <p className="text-xs text-muted-foreground">kcals</p>
                </div>
                <div className="flex gap-4">
                    <MacroChip label="Protein" value={recipe.macros.protein} color="text-emerald-500" />
                    <MacroChip label="Carbs" value={recipe.macros.carbs} color="text-amber-500" />
                    <MacroChip label="Fat" value={recipe.macros.fat} color="text-red-500" />
                </div>
            </div>
        </div>
    );
}
