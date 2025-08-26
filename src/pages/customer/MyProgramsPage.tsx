// src/pages/customer/MyProgramsPage.tsx
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Flame, Salad, BrainCircuit } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Mock data for demo
const mockPrograms = [
  {
    id: 1,
    type: "fitness",
    title: "Strength Foundation",
    progress: 60,
    date: "2025-08-26",
    status: "active",
    plan: ["Squat 3x15", "Lunge 3x12", "Leg Press 4x10"],
  },
  {
    id: 2,
    type: "nutrition",
    title: "Mindful Eating",
    progress: 20,
    date: "2025-08-26",
    status: "active",
    plan: ["Track breakfast", "Mindful lunch", "No sugar drinks"],
  },
  {
    id: 3,
    type: "mental",
    title: "Digital Detox",
    progress: 0,
    date: "2025-09-01", // scheduled
    status: "scheduled",
    plan: ["No screens after 8pm", "1hr walk"],
  },
];

const typeConfig = {
  fitness: { color: "bg-orange-500", Icon: Flame },
  nutrition: { color: "bg-green-500", Icon: Salad },
  mental: { color: "bg-blue-500", Icon: BrainCircuit },
};

// --- Program Card ---
const ProgramCard = ({ program, onClick }: { program: any; onClick: () => void }) => {
  const { Icon, color } = typeConfig[program.type];
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition rounded-xl border border-slate-200"
    >
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-full ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </span>
          <h3 className="font-semibold">{program.title}</h3>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-2"
            style={{ width: `${program.progress}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Program Detail Drawer ---
const ProgramDetail = ({ program }: { program: any }) => {
  if (!program) return null;
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">{program.title}</h2>
      <ul className="space-y-2">
        {program.plan.map((task: string, idx: number) => (
          <li key={idx} className="flex items-center gap-2 text-slate-700">
            • {task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function MyProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold">My Programs</h2>

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {/* Calendar */}
          <DayPicker
            mode="single"
            selected={new Date(today)}
            modifiers={{
              completed: mockPrograms.filter(p => p.progress === 100).map(p => new Date(p.date)),
              scheduled: mockPrograms.filter(p => p.status === "scheduled").map(p => new Date(p.date)),
            }}
            modifiersClassNames={{
              today: "bg-emerald-100 rounded-full",
              completed: "bg-emerald-500 text-white rounded-full",
              scheduled: "border border-blue-500 rounded-full",
            }}
          />

          {/* Today’s Programs */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {mockPrograms
              .filter(p => p.date === today)
              .map(p => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  onClick={() => {
                    setSelectedProgram(p);
                    setDrawerOpen(true);
                  }}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Drawer for program detail */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side={typeof window !== "undefined" && window.innerWidth >= 1024 ? "right" : "bottom"}
          className="w-full sm:max-w-md"
        >
          <ProgramDetail program={selectedProgram} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
