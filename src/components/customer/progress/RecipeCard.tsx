import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Recipe } from '@/mockdata/progress/mockProgressData';
import { FlameIcon } from 'lucide-react'; // Example icon from a library

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
            <div className="flex items-center gap-4">
                {/* Icon for the meal category */}
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <FlameIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                    <p className="font-semibold leading-tight text-gray-900 dark:text-white">{recipe.name}</p>
                    <p className="text-sm text-muted-foreground">{recipe.portion}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{recipe.calories} kcal</p>
                <p className="text-xs text-muted-foreground">{recipe.time}</p>
            </div>
        </div>
    );
}
