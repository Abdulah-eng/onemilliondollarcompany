import { motion } from 'framer-motion';
import { ProgressData } from '@/mockdata/progress/mockProgressData';

interface GoalGuidanceProps {
    currentMacros: ProgressData['nutrition']['macros'][0];
    recommendedMacros: ProgressData['nutrition']['recommended'];
}

export default function GoalGuidance({ currentMacros, recommendedMacros }: GoalGuidanceProps) {
    const getGuidance = () => {
        const proteinPercentage = (currentMacros.protein / recommendedMacros.protein) * 100;
        const carbsPercentage = (currentMacros.carbs / recommendedMacros.carbs) * 100;
        const fatPercentage = (currentMacros.fat / recommendedMacros.fat) * 100;

        // Check for specific nutrient deficiencies or excesses
        if (proteinPercentage < 70) {
            return {
                title: "Boost Your Protein!",
                message: "You're a bit low on protein today. Try adding lean meats, eggs, or legumes to your next meal to hit your target. 🍗",
                color: "bg-emerald-500",
                icon: "💪",
            };
        }
        if (carbsPercentage < 70) {
            return {
                title: "Need More Energy?",
                message: "Your carb intake is low. Carbs fuel your workouts! Consider some whole grains, fruits, or starchy vegetables. 🥔",
                color: "bg-amber-400",
                icon: "🏃",
            };
        }
        if (fatPercentage < 70) {
            return {
                title: "Healthy Fats are Key!",
                message: "Your fat intake is below target. Healthy fats from nuts, seeds, or avocado are crucial for hormone balance. 🥑",
                color: "bg-red-500",
                icon: "🌰",
            };
        }

        return {
            title: "Excellent Work Today!",
            message: "You're on track to hit your nutrition goals. Your balanced intake is helping you build a healthier you. Keep it up! ✨",
            color: "bg-purple-500",
            icon: "✅",
        };
    };

    const guidance = getGuidance();

    return (
        <div className="h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${guidance.color} text-white text-3xl`}>
                    <span role="img" aria-label="guidance icon">{guidance.icon}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{guidance.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {guidance.message}
            </p>
        </div>
    );
}
