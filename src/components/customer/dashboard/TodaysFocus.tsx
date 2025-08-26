// src/components/customer/dashboard/TodaysProgram.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ShoppingBag, Flame, Salad, BrainCircuit, Star } from "lucide-react";
import { ComponentType } from "react";

// --- Data Layer ---
// Data remains the same, an ordered array representing the day's agenda.
const agendaItems = [
  {
    id: 1,
    type: "fitness",
    time: "Morning Workout",
    details: {
      title: "Full Body Strength",
      exercises: [
        { name: "Barbell Squats", sets: "4x5" },
        { name: "Bench Press", sets: "3x8" },
        { name: "Bent Over Rows", sets: "3x8" },
        { name: "Overhead Press", sets: "4x10" },
      ],
      duration: "60 minutes",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
    },
  },
  {
    id: 2,
    type: "nutrition",
    time: "12:30 PM",
    details: {
      title: "Protein Power Lunch",
      meal: "Grilled Chicken & Quinoa Salad",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
    },
  },
  {
    id: 3,
    type: "mental",
    time: "4:00 PM",
    details: {
      title: "Mindful Afternoon Reset",
      duration: "10 minutes",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    },
  },
];

// --- Configuration with a more muted, professional color palette ---
const programConfig: {
  [key: string]: {
    Icon: ComponentType<{ className?: string }>;
    buttonClass: string;
    title: string;
  };
} = {
  fitness: {
    Icon: Flame,
    buttonClass: "bg-slate-800 hover:bg-slate-900",
    title: "Fitness",
  },
  nutrition: {
    Icon: Salad,
    buttonClass: "bg-teal-700 hover:bg-teal-800",
    title: "Nutrition",
  },
  mental: {
    Icon: BrainCircuit,
    buttonClass: "bg-indigo-700 hover:bg-indigo-800",
    title: "Mindfulness",
  },
};

// --- Main Component ---
const TodaysProgram = () => {
  // Separate the main program from the rest of the agenda
  const primaryProgram = agendaItems[0];
  const secondaryPrograms = agendaItems.slice(1);
  const primaryConfig = programConfig[primaryProgram.type];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="px-2">
        <h2 className="text-3xl font-bold text-slate-800">Today's Focus 💪</h2>
      </div>

      {/* Primary Program Card (Full Width) */}
      <Card className="relative w-full overflow-hidden border-0 shadow-xl rounded-3xl group">
        <img
          src={primaryProgram.details.image}
          alt={primaryProgram.details.title}
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <CardContent className="relative flex flex-col justify-end min-h-[400px] p-6 text-white md:p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-300" />
                Main Goal
              </span>
              <p className="text-sm font-medium opacity-80">{primaryProgram.time}</p>
            </div>

            <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
              {primaryProgram.details.title}
            </h3>

            {primaryProgram.type === 'fitness' && (
              <ul className="grid grid-cols-2 text-sm opacity-90 md:grid-cols-4 gap-x-6 gap-y-1">
                {primaryProgram.details.exercises.map((ex) => (
                  <li key={ex.name} className="flex justify-between">
                    <span>{ex.name}</span>
                    <span className="font-mono font-medium">{ex.sets}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-4">
              <Button className={`px-8 py-6 text-base font-bold text-white rounded-xl ${primaryConfig.buttonClass}`}>
                🚀 Start Workout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Programs Section */}
      {secondaryPrograms.length > 0 && (
        <div className="pt-8">
          <h3 className="mb-4 text-2xl font-bold text-slate-700 px-2">Later Today</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {secondaryPrograms.map((item) => {
              const config = programConfig[item.type];
              return (
                <Card key={item.id} className="relative w-full overflow-hidden border-0 shadow-lg rounded-3xl group">
                  <img
                    src={item.details.image}
                    alt={item.details.title}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <CardContent className="relative flex flex-col justify-end min-h-[240px] p-6 text-white space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm">
                          <config.Icon className="w-4 h-4" />
                          {config.title}
                        </span>
                        <p className="font-medium opacity-80">{item.time}</p>
                    </div>

                    <h4 className="text-2xl font-bold">{item.details.title}</h4>
                    
                    <Button className={`w-full font-semibold text-white rounded-xl ${config.buttonClass}`}>
                      Begin
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysProgram;
