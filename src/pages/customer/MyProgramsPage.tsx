// src/pages/customer/MyProgramsPage.tsx

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Salad, BrainCircuit, User, Clock, Gem } from "lucide-react";
import { ComponentType } from "react";

// --- MOCK DATA ---
// This is placeholder data to simulate the different types of programs a user might have.
// In a real application, you would fetch this from your database.
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
  {
    id: 3,
    title: "Pre-Marathon Training",
    type: "fitness",
    status: "scheduled",
    startDate: "2025-09-15",
    coach: "Alex Williams",
    image: "https://images.unsplash.com/photo-1530143269233-addc78a41435?q=80&w=1200",
    description: "A 16-week plan to get you ready for race day.",
  },
  {
    id: 4,
    title: "Digital Detox",
    type: "mental",
    status: "scheduled",
    startDate: "2025-10-01",
    coach: null,
    image: "https://images.unsplash.com/photo-1512389142868-68d4b8f8d2b2?q=80&w=1200",
    description: "A 7-day guide to reducing screen time and improving focus.",
  },
  {
    id: 5,
    title: "The Ultimate Abs Guide",
    type: "fitness",
    status: "purchased",
    coach: null,
    image: "https://images.unsplash.com/photo-1598266663999-2b31f03698d2?q=80&w=1200",
    description: "Lifetime access to a comprehensive core training program.",
  },
];

// --- STYLING CONFIGURATION ---
// These objects help keep our styling consistent and easy to manage.
const programTypeConfig: {
  [key: string]: {
    Icon: ComponentType<{ className?: string }>;
    tagClasses: string;
  };
} = {
  fitness: { Icon: Flame, tagClasses: "bg-orange-100 text-orange-800" },
  nutrition: { Icon: Salad, tagClasses: "bg-green-100 text-green-800" },
  mental: { Icon: BrainCircuit, tagClasses: "bg-blue-100 text-blue-800" },
};

const statusConfig: {
  [key: string]: {
    icon: ComponentType<{ className?: string }>;
    label: string;
  };
} = {
    active: { icon: Flame, label: "Active" },
    scheduled: { icon: Clock, label: "Scheduled" },
    purchased: { icon: Gem, label: "Purchased" },
};

// --- REUSABLE PROGRAM CARD COMPONENT ---
// By creating a separate component for the card, our main page code stays clean.
const ProgramCard = ({ program }: { program: typeof mockPrograms[0] }) => {
  const config = programTypeConfig[program.type];

  return (
    <Card className="w-full overflow-hidden border-slate-200 shadow-sm rounded-2xl flex flex-col">
      <img src={program.image} alt={program.title} className="object-cover w-full h-40" />
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.tagClasses}`}>
            <config.Icon className="w-3.5 h-3.5" />
            {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800">{program.title}</h3>
        <p className="text-sm text-slate-600 mt-1 flex-grow">{program.description}</p>
        
        {program.status === 'active' && program.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{program.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${program.progress}%` }} />
            </div>
          </div>
        )}

        {program.status === 'scheduled' && program.startDate && (
            <p className="mt-4 text-sm font-medium text-slate-700">Starts: {new Date(program.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        )}

        {program.coach && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Coach: {program.coach}</span>
          </div>
        )}

        <Button className="w-full mt-4 font-semibold bg-slate-800 hover:bg-slate-700">
          View Program
        </Button>
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT ---
// This is the main component that brings everything together for the page.
const MyProgramsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('active');

  const filteredPrograms = mockPrograms.filter(p => p.status === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="px-2">
        <h2 className="text-3xl font-bold text-slate-800">My Programs</h2>
        <p className="text-slate-500 mt-1">An overview of your active, scheduled, and purchased programs.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 px-2" aria-label="Tabs">
          {Object.keys(statusConfig).map((status) => {
            const { icon: Icon, label } = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === status
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
            <p className="text-slate-500">No programs found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default MyProgramsPage;
