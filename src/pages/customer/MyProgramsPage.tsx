// src/pages/customer/MyProgramsPage.tsx
import { useState, useMemo, useEffect, useRef } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Flame, Salad, BrainCircuit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you use shadcn/ui's utility function

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
    date: "2025-08-27", // scheduled for tomorrow
    status: "active",
    plan: ["No screens after 8pm", "1hr walk"],
  },
   {
    id: 4,
    type: "fitness",
    title: "Cardio Blast",
    progress: 100,
    date: "2025-08-25", // completed yesterday
    status: "completed",
    plan: ["30 min treadmill", "15 min HIIT"],
  },
];

// --- Configs & Helpers ---
const typeConfig = {
  fitness: { color: "bg-orange-500", Icon: Flame },
  nutrition: { color: "bg-green-500", Icon: Salad },
  mental: { color: "bg-blue-500", Icon: BrainCircuit },
};

const formatDateForFilter = (date: Date) => format(date, "yyyy-MM-dd");

// --- Horizontal Calendar Component ---
const HorizontalCalendar = ({ selectedDate, setSelectedDate, programDates }: { selectedDate: Date; setSelectedDate: (date: Date) => void; programDates: string[] }) => {
  const dateListRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(() => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i - 15)), []);

  useEffect(() => {
    // Scroll the selected date into view on mount
    const selectedElement = document.getElementById(`date-${format(selectedDate, 'yyyy-MM-dd')}`);
    if (selectedElement && dateListRef.current) {
      const scrollLeft = selectedElement.offsetLeft - dateListRef.current.offsetWidth / 2 + selectedElement.offsetWidth / 2;
      dateListRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []); // Run only once on mount


  return (
    <div ref={dateListRef} className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const hasProgram = programDates.includes(formatDateForFilter(date));

        return (
          <button
            key={date.toString()}
            id={`date-${format(date, 'yyyy-MM-dd')}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl w-14 h-20 transition-all duration-200 shrink-0",
              isSelected ? "bg-emerald-500 text-white shadow-md" : "bg-white hover:bg-slate-100",
              isToday(date) && !isSelected && "border-2 border-emerald-500"
            )}
          >
            <span className="text-xs uppercase font-semibold opacity-70">{format(date, "EEE")}</span>
            <span className="text-xl font-bold">{format(date, "d")}</span>
             {hasProgram && !isSelected && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />}
          </button>
        );
      })}
    </div>
  );
};

// --- Program Card Component ---
const ProgramCard = ({ program, onClick }: { program: any; onClick: () => void }) => {
  const { Icon, color } = typeConfig[program.type];
  const isCompleted = program.progress === 100;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition rounded-2xl border-none bg-white overflow-hidden"
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full", color)}>
              <Icon className="w-5 h-5 text-white" />
            </span>
            <h3 className="font-bold text-slate-800">{program.title}</h3>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
        </div>
        <div className="text-sm text-slate-500">
           {program.plan.length} {program.plan.length > 1 ? 'tasks' : 'task'}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${program.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// --- Program Detail Drawer Component ---
const ProgramDetail = ({ program }: { program: any }) => {
  if (!program) return null;
  const { Icon, color } = typeConfig[program.type];

  return (
    <>
      <SheetHeader className="p-6">
        <SheetTitle className="flex items-center gap-3 text-2xl">
          <span className={cn("p-3 rounded-full", color)}>
            <Icon className="w-6 h-6 text-white" />
          </span>
          {program.title}
        </SheetTitle>
        <SheetDescription className="pt-2 text-left">
          Here is your plan for today. Stay focused and give it your best!
        </SheetDescription>
      </SheetHeader>
      <div className="p-6 space-y-4">
        <ul className="space-y-3">
          {program.plan.map((task: string, idx: number) => (
            <li key={idx} className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
              <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};


// --- Main Page Component ---
export default function MyProgramsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const programDates = useMemo(() => mockPrograms.map(p => p.date), []);

  const filteredPrograms = useMemo(() => {
    const dateStr = formatDateForFilter(selectedDate);
    return mockPrograms.filter(p => p.date === dateStr);
  }, [selectedDate]);

  const handleProgramClick = (program: any) => {
    setSelectedProgram(program);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-800">My Programs</h1>
          <p className="text-slate-500 mt-1">Your daily plan for fitness, nutrition, and mind.</p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all">All Programs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <HorizontalCalendar 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate}
                programDates={programDates}
            />

            <div>
              <h2 className="text-xl font-bold text-slate-700 mb-4">
                Plan for {format(selectedDate, "MMMM d")}
              </h2>
              {filteredPrograms.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPrograms.map(p => (
                    <ProgramCard key={p.id} program={p} onClick={() => handleProgramClick(p)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                    <p className="text-slate-500">No programs scheduled for this day.</p>
                </div>
              )}
            </div>
          </TabsContent>
          {/* You can build out these other tabs later */}
          <TabsContent value="all"><p>A list of all purchased programs could go here.</p></TabsContent>
          <TabsContent value="history"><p>A list of all completed programs could go here.</p></TabsContent>
        </Tabs>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side={typeof window !== "undefined" && window.innerWidth >= 640 ? "right" : "bottom"}
          className="w-full sm:max-w-md rounded-t-2xl sm:rounded-none"
        >
          <ProgramDetail program={selectedProgram} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
