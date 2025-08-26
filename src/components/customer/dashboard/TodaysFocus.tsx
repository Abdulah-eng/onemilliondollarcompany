// src/components/customer/dashboard/TodaysProgram.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Flame, Salad, BrainCircuit } from "lucide-react";
import { ComponentType } from "react";

// --- Data Layer (Unchanged) ---
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
      ],
      duration: "60 min",
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
      duration: "10 min",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    },
  },
];

// --- Configuration with a muted, professional color palette ---
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
  const primaryProgram = agendaItems[0];
  const secondaryPrograms = agendaItems.slice(1);
  const primaryConfig = programConfig[primaryProgram.type];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="px-2">
        <p className="text-sm text-slate-500">Tuesday, 26 August 2025</p>
        <h2 className="text-2xl font-bold text-slate-800">Today's Focus 💪</h2>
      </div>

      {/* Primary Program Card (Full Width) */}
      <Card className="relative w-full overflow-hidden border-0 shadow-xl rounded-3xl group">
        <img
          src={primaryProgram.details.image}
          alt={primaryProgram.details.title}
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <CardContent className="relative flex flex-col justify-end min-h-[340px] p-5 text-white md:p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-yellow-300" />
                Main Goal
              </span>
              <p className="text-xs font-medium opacity-80">{primaryProgram.time}</p>
            </div>

            <h3 className="text-3xl font-bold tracking-tight">
              {primaryProgram.details.title}
            </h3>

            {primaryProgram.type === 'fitness' && (
              <ul className="grid grid-cols-1 text-sm opacity-90 md:grid-cols-2 gap-x-6 gap-y-1">
                {primaryProgram.details.exercises.map((ex) => (
                  <li key={ex.name} className="flex justify-between">
                    <span>{ex.name}</span>
                    <span className="font-mono font-medium">{ex.sets}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-2">
              <Button className={`font-semibold text-white rounded-lg ${primaryConfig.buttonClass}`}>
                🚀 Start Program
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Programs Section */}
      {secondaryPrograms.length > 0 && (
        <div className="pt-6">
          <h3 className="mb-4 text-xl font-bold text-slate-700 px-2">Later Today</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  
                  <CardContent className="relative flex flex-col justify-end min-h-[220px] p-4 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 px-2.5 py-1 font-semibold rounded-full bg-white/10 backdrop-blur-sm">
                          <config.Icon className="w-3.5 h-3.5" />
                          {config.title}
                        </span>
                        <p className="font-medium opacity-80">{item.time}</p>
                    </div>

                    <h4 className="text-lg font-bold">{item.details.title}</h4>
                    
                    <Button size="sm" className={`w-full font-semibold text-white rounded-lg ${config.buttonClass}`}>
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
