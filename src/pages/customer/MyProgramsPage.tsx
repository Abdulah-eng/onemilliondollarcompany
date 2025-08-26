import { useState, useMemo } from "react";
import { format, isSameDay, isPast } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, CalendarClock } from "lucide-react";
import { TaskCard } from "@/components/customer/programsoverview/TaskCard";
import { HorizontalCalendar } from "@/components/customer/programsoverview/HorizontalCalendar";
import { ProgramDetailView } from "@/components/customer/programsoverview/ProgramDetailView";
import { SlideInDetail } from "@/components/customer/programsoverview/SlideInDetail";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ScheduledTask, generateDailySchedule, mockPrograms } from "./mockPrograms";

export default function MyProgramsPage() {
  const [tab, setTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);
  const scheduledPrograms = mockPrograms.filter((p) => p.status === "scheduled");
  const purchasedPrograms = mockPrograms.filter((p) => p.status === "purchased");

  const tasksForSelectedDate = useMemo(() => {
    const tasks = dailySchedule.filter((t) => isSameDay(t.date, selectedDate));
    return Object.values(tasks.reduce((acc, task) => {
      const key = `${task.programId}-W${task.weekNumber}`;
      if (!acc[key]) acc[key] = { programTitle: task.programTitle, weekNumber: task.weekNumber, tasks: [] };
      acc[key].tasks.push(task);
      return acc;
    }, {} as Record<string, { programTitle: string; weekNumber: number; tasks: ScheduledTask[] }>));
  }, [selectedDate, dailySchedule]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto bg-slate-200 rounded-xl p-1">
          <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Active</TabsTrigger>
          <TabsTrigger value="purchased" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Purchased</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "active" ? (
        <>
          {scheduledPrograms.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-6 h-6 text-indigo-500" /> Scheduled For You
              </h2>
              {scheduledPrograms.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-slate-600">{p.description}</p>
                  <span className="text-sm text-slate-500">Starts on {format(new Date(p.startDate!), "MMMM do")}</span>
                </div>
              ))}
            </div>
          )}

          <HorizontalCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} schedule={dailySchedule} />

          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
              <p className="font-semibold">No tasks scheduled for this day.</p>
              <p className="text-sm">Enjoy your rest day!</p>
            </div>
          ) : tasksForSelectedDate.map((pg) => (
            <div key={pg.programTitle + pg.weekNumber} className="space-y-3">
              <h3 className="font-semibold text-md text-slate-600 px-2">{pg.programTitle} - <span className="font-bold text-slate-800">Week {pg.weekNumber}</span></h3>
              {pg.tasks.map((task) => <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />)}
            </div>
          ))}
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-amber-500" /> Your Program Library
          </h2>
          {purchasedPrograms.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-slate-600">{p.description}</p>
              <p className="text-sm text-slate-500">Lifetime access</p>
            </div>
          ))}
        </div>
      )}

      {isMobile ? (
        <Drawer open={!!selectedTask} onOpenChange={(o) => !o && setSelectedTask(null)}>
          <DrawerContent className="rounded-t-2xl shadow-lg">
            <ProgramDetailView program={selectedTask} />
          </DrawerContent>
        </Drawer>
      ) : (
        <SlideInDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
