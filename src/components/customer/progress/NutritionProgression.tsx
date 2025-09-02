// src/components/customer/progress/NutritionProgression.tsx
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import RecipeCard from './RecipeCard'; // We will create this next

export default function NutritionProgression({ data }: { data: ProgressData['nutrition'] }) {
    const avgMacros = data.macros.reduce((acc, curr) => ({
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbs,
        fat: acc.fat + curr.fat,
    }), { protein: 0, carbs: 0, fat: 0 });

    const totalDays = data.macros.length;
    const chartData = [
        { name: '🍗 Protein', value: Math.round(avgMacros.protein / totalDays), fill: 'hsl(var(--primary))' },
        { name: '🍞 Carbs', value: Math.round(avgMacros.carbs / totalDays), fill: 'hsl(var(--primary) / 0.7)' },
        { name: '🥑 Fat', value: Math.round(avgMacros.fat / totalDays), fill: 'hsl(var(--primary) / 0.4)' },
    ];

    return (
        <motion.div
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            {/* Section 1: Macros */}
            <div>
                <h3 className="text-xl font-bold tracking-tight mb-4">Nutrition Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2 text-muted-foreground">Average Macros (g)</h4>
                        <div className="h-48 w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={14} axisLine={false} tickLine={false} width={80} />
                                    <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}/>
                                    <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                     <div className="flex justify-around md:flex-col items-center gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{data.mealCompletion}%</p>
                            <p className="text-xs text-muted-foreground">Meal Adherence</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{data.outsideMeals}</p>
                            <p className="text-xs text-muted-foreground">Meals Out (7d)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Recent Meals */}
            <div className="border-t border-border/50 pt-6">
                <h3 className="text-xl font-bold tracking-tight mb-4">🍲 Recent Meals</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.recentRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
