// src/pages/customer/MyProgramsPage.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Salad, BrainCircuit, User, Clock, Gem, CheckCircle } from "lucide-react";
import { ComponentType } from "react";

// --- MOCK DATA ---
const mockPrograms = [
  {
    id: 1,
    title: "8-Week Strength Foundation",
    type: "fitness",
    status: "active",
    progress: 75,
    coach: "Alex Williams",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200",
    description: "Build a solid strength base with classic lifts and progressive overload.",
    todaysPlan: [
      { exercise: "Squats", sets: "3x15" },
      { exercise: "Lunges", sets: "3x12" },
      { exercise: "Leg Press", sets: "4x10" },
    ],
  },
  {
    id: 2,
    title: "Mindful Eating Challenge",
    type: "nutrition",
    status: "active",
    progress: 40,
    coach: null,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200",
    description: "Develop a healthier relationship with food over 30 days.",
  },
  // ... rest unchanged
];

// --- CONFIG ---
const programTypeConfig: {
  [key: string]: { Icon: ComponentType<{ className?: string }>; tagClasses: string };
} = {
  fitness: { Icon: Flame, tagClasses: "bg-orange-100 text-orange-800" },
  nutrition: { Icon: Salad, tagClasses: "bg-green-100 text-green-800" },
  mental: { Icon: BrainCircuit, tagClasses: "bg-blue-100 text-blue-800" },
};

const statusConfig: {
  [key: string]: { icon: ComponentType<{ className?: string }>; label: string };
} = {
  active: { icon: Flame, label: "Active" },
  scheduled: { icon: Clock, label: "Scheduled" },
  purchased: { icon: Gem, label: "Purchased" },
};

// --- PROGRAM CARD ---
const ProgramCard = ({
  program,
  onSelect,
  isSelected,
}: {
  program: typeof mockPrograms[0];
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const config = programTypeConfig[program.type];
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer w-full overflow-hidden border ${
        isSelected ? "border-emerald-500 ring-2 ring-emerald-300" : "border-slate-200"
      } shadow-sm rounded-2xl flex flex-col transition`}
    >
      <img src={program.image} alt={program.title} className="object-cover w-full h-40" />
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.tagClasses}`}
          >
            <config.Icon className="w-3.5 h-3.5" />
            {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800">{program.title}</h3>
        <p className="text-sm text-slate-600 mt-1 flex-grow line-clamp-2">{program.description}</p>

        {program.status === "active" && program.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{program.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${program.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- DETAIL VIEW ---
const ProgramDetail = ({ program }: { program: typeof mockPrograms[0] | null }) => {
  if (!program) {
    return (
      <div className="hidden lg:flex items-center justify-center text-slate-400">
        Select a program to see details
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="relative">
        <img src={program.image} alt={program.title} className="w-full h-56 object-cover rounded-2xl" />
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-end p-6">
          <h2 className="text-2xl font-bold text-white">{program.title}</h2>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <p className="text-slate-700">{program.description}</p>

        {program.status === "active" && program.progress !== undefined && (
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Progress</h4>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full"
                style={{ width: `${program.progress}%` }}
              />
            </div>
          </div>
        )}

        {program.todaysPlan && (
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Today’s Plan</h4>
            <ul className="space-y-2">
              {program.todaysPlan.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-700"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="flex-1">{item.exercise}</span>
                  <span className="text-sm font-medium text-slate-500">{item.sets}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {program.coach && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4 text-slate-400" /> Coach: {program.coach}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const MyProgramsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  const [selectedProgram, setSelectedProgram] = useState<typeof mockPrograms[0] | null>(null);

  const filteredPrograms = mockPrograms.filter((p) => p.status === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="px-2">
        <h2 className="text-3xl font-bold text-slate-800">My Programs</h2>
        <p className="text-slate-500 mt-1">
          An overview of your active, scheduled, and purchased programs.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 px-2" aria-label="Tabs">
          {Object.keys(statusConfig).map((status) => {
            const { icon: Icon, label } = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => {
                  setActiveTab(status);
                  setSelectedProgram(null);
                }}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === status
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onSelect={() => setSelectedProgram(program)}
                isSelected={selectedProgram?.id === program.id}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 text-slate-500">
              No programs found in this category.
            </div>
          )}
        </div>

        {/* Right detail panel (desktop only, or stacked below on mobile when selected) */}
        <div className="hidden lg:block">
          <ProgramDetail program={selectedProgram} />
        </div>

        {/* Mobile detail view */}
        {selectedProgram && (
          <div className="lg:hidden">
            <ProgramDetail program={selectedProgram} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProgramsPage;
