// src/components/customer/dashboard/TodaysProgram.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ShoppingBag, Flame, Salad, BrainCircuit, Star } from "lucide-react";
import { ComponentType } from "react";

// --- Data Layer ---
// Refactored data to be an array for easier mapping and ordering (like a real agenda)
const agendaItems = [
  {
    id: 1,
    type: "fitness",
    time: "Morning Workout",
    isPrimary: true, // Highlights this as the main focus
    details: {
      title: "Leg Day Annihilation",
      exercises: [
        { name: "Barbell Squats", sets: "4x5" },
        { name: "Romanian Deadlifts", sets: "3x8" },
        { name: "Leg Press", sets: "4x10" },
        { name: "Calf Raises", sets: "4x15" },
      ],
      duration: "60 minutes",
      equipment: "Full Gym",
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200",
    },
  },
  {
    id: 2,
    type: "nutrition",
    time: "12:30 PM",
    isPrimary: false,
    details: {
      title: "Protein Power Lunch",
      meal: "Grilled Chicken & Quinoa Salad",
      ingredients: ["Chicken Breast", "Quinoa", "Avocado", "Spinach", "Tomato"],
      shoppingListAvailable: true,
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
    },
  },
  {
    id: 3,
    type: "mental",
    time: "4:00 PM",
    isPrimary: false,
    details: {
      title: "Mindful Afternoon Reset",
      duration: "10 minutes",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    },
  },
];

// --- Configuration for different program types ---
// This makes the component super easy to extend with new types
const programConfig: {
  [key: string]: {
    Icon: ComponentType<{ className?: string }>;
    bgColor: string;
    buttonColor: string;
    buttonHoverColor: string;
    title: string;
  };
} = {
  fitness: {
    Icon: Flame,
    bgColor: "bg-amber-500",
    buttonColor: "bg-amber-500",
    buttonHoverColor: "hover:bg-amber-600",
    title: "Fitness",
  },
  nutrition: {
    Icon: Salad,
    bgColor: "bg-lime-500",
    buttonColor: "bg-lime-500",
    buttonHoverColor: "hover:bg-lime-600",
    title: "Nutrition",
  },
  mental: {
    Icon: BrainCircuit,
    bgColor: "bg-sky-500",
    buttonColor: "bg-sky-500",
    buttonHoverColor: "hover:bg-sky-600",
    title: "Mental Wellness",
  },
};

// --- Main Component ---
const TodaysProgram = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="px-2">
        <p className="text-lg text-slate-500">Tuesday, 26 August</p>
        <h2 className="text-3xl font-bold text-slate-800">
          Your Plan for Today ✨
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative flex flex-col gap-8 pl-8">
        {/* The timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200" />

        {agendaItems.map((item, index) => {
          const config = programConfig[item.type];
          const isFirst = index === 0;

          return (
            <Card
              key={item.id}
              className="relative w-full overflow-hidden transition-transform duration-300 ease-in-out border-0 rounded-3xl shadow-lg hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Timeline marker */}
              <div className={`absolute left-[-2rem] top-6 w-6 h-6 rounded-full flex items-center justify-center ${isFirst ? config.bgColor : 'bg-slate-200'}`}>
                {isFirst && <Star className="w-4 h-4 text-white" />}
              </div>

              {/* Background Image */}
              <img
                src={item.details.image}
                alt={item.details.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              
              <CardContent className="relative flex flex-col justify-end min-h-[250px] p-6 text-white space-y-4 md:min-h-[280px]">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm`}>
                          <config.Icon className="w-4 h-4" />
                          {config.title}
                        </span>
                        <p className="text-sm font-medium opacity-80">{item.time}</p>
                    </div>
                    {item.details.duration && (
                        <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white/20 rounded-full backdrop-blur-sm">
                            <Clock className="w-3 h-3" />
                            {item.details.duration}
                        </span>
                    )}
                </div>

                <h3 className="text-3xl font-bold tracking-tight">
                  {item.details.title}
                </h3>

                {/* Conditional Content */}
                {item.type === 'fitness' && (
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm opacity-90">
                    {item.details.exercises.map((ex) => (
                      <li key={ex.name} className="flex justify-between">
                        <span>{ex.name}</span>
                        <span className="font-mono font-medium">{ex.sets}</span>
                      </li>
                    ))}
                  </ul>
                )}
                 {item.type === 'nutrition' && (
                  <p className="text-md font-medium opacity-90">
                    Today's Meal: {item.details.meal}
                  </p>
                )}


                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2 md:flex-row">
                    <Button
                        className={`w-full md:w-auto flex-grow rounded-xl text-white font-bold text-base ${config.buttonColor} ${config.buttonHoverColor}`}
                    >
                        {isFirst ? "🚀 Start Now" : `Begin ${config.title}`}
                    </Button>
                    {item.type === 'nutrition' && item.details.shoppingListAvailable && (
                        <Button
                            variant="outline"
                            className="w-full bg-transparent border-white/50 text-white rounded-xl md:w-auto hover:bg-white/10 hover:text-white"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            View Shopping List
                        </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysProgram;
