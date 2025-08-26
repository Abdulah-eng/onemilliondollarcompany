// src/components/customer/dashboard/TodaysProgram.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Flame, Salad, BrainCircuit } from "lucide-react";
import { ComponentType } from "react";

// --- Data Layer (Unchanged) ---
const agendaItems = [
  {
    id: 1,
    type: "fitness",
    time: "Morning",
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

// --- Configuration with a subtle, accent-based color palette ---
const programConfig: {
  [key: string]: {
    Icon: ComponentType<{ className?: string }>;
    tagClasses: string;
    title: string;
  };
} = {
  fitness: {
    Icon: Flame,
    tagClasses: "bg-orange-100 text-orange-800",
    title: "Fitness",
  },
  nutrition: {
    Icon: Salad,
    tagClasses: "bg-green-100 text-green-800",
    title: "Nutrition",
  },
  mental: {
    Icon: BrainCircuit,
    tagClasses: "bg-blue-100 text-blue-800",
    title: "Mindfulness",
  },
};

// --- Main Component ---
const TodaysProgram = () => {
  const primaryProgram = agendaItems[0];
  const secondaryPrograms = agendaItems.slice(1);
  const primaryConfig = programConfig[primaryProgram.type];
  const today = new Date();
  
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-sm text-slate-500">{formattedDate}</p>
        <h2 className="text-2xl font-bold text-slate-800">Your Day Ahead</h2>
      </div>

      {/* Primary Program Card */}
      <Card className="w-full overflow-hidden border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="p-0">
          <img
            src={primaryProgram.details.image}
            alt={primaryProgram.details.title}
            className="object-cover w-full h-48"
          />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${primaryConfig.tagClasses}`}>
              <primaryConfig.Icon className="w-3.5 h-3.5" />
              {primaryConfig.title}
            </span>
            {primaryProgram.details.duration && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {primaryProgram.details.duration}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-800">{primaryProgram.details.title}</h3>
          
          {primaryProgram.type === 'fitness' && (
            <ul className="pt-1 space-y-1 text-sm text-slate-600">
              {primaryProgram.details.exercises.map((ex) => (
                <li key={ex.name} className="flex justify-between">
                  <span>{ex.name}</span>
                  <span className="font-mono font-medium text-slate-700">{ex.sets}</span>
                </li>
              ))}
            </ul>
          )}
          <Button className="w-full mt-2 font-semibold bg-slate-800 hover:bg-slate-700">
            Start Now
          </Button>
        </CardContent>
      </Card>

      {/* Secondary Programs Section */}
      {secondaryPrograms.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-slate-700">Later Today</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {secondaryPrograms.map((item) => {
              const config = programConfig[item.type];
              return (
                <Card key={item.id} className="flex flex-row items-center w-full overflow-hidden border-slate-200 shadow-sm rounded-2xl">
                  <img
                    src={item.details.image}
                    alt={item.details.title}
                    className="object-cover w-28 h-full"
                  />
                  <CardContent className="flex-1 p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${config.tagClasses}`}>
                      <config.Icon className="w-3.5 h-3.5" />
                      {config.title}
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">{item.details.title}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View
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
