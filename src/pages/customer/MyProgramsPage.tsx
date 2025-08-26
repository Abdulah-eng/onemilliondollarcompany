// src/pages/customer/MyProgramsPage.tsx
import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, BookMarked, Info } from "lucide-react";

import TaskCard, { ScheduledTask } from "@/components/customer/programsoverview/TaskCard";
import WeeklyCalendar from "@/components/customer/programsoverview/WeeklyCalendar";

// MOCK DATA (same as before)
import { mockPrograms, generateDailySchedule } from "@/mockdata/programs/mockprograms";

export default function MyProgramsPage() {
  const [tab, setTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);
  const scheduledPrograms = mockPrograms.filter(p => p.status === "scheduled");
  const purchasedPrograms = mockPrograms.filter(p => p.status === "purchased");

  const tasksForSelectedDate = useMemo(() => {
    const tasks = dailySchedule.filter(task => isSameDay(task.date, selectedDate));
    return Object.values(tasks.reduce((acc, task) => {
      const key = `${task.programId}-W${task.weekNumber}`;
      if (!acc[key]) acc[key] = { programTitle: task.programTitle, weekNumber: task.weekNumber, tasks: [] };
      acc[key].tasks.push(task);
      return acc;
    }, {} as Record<string, { programTitle: string; weekNumber: number; tasks: ScheduledTask[] }>));
  }, [selectedDate, dailySchedule]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const renderTaskDetails = () => {
    if (!selectedTask) return null;
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
        <Badge variant="outline" className="mb-4">{selectedTask.programTitle} - Week {selectedTask.weekNumber}</Badge>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          {selectedTask.content.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-white rounded-xl p-1 shadow-sm">
          <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Active</TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Scheduled</TabsTrigger>
          <TabsTrigger value="purchased" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white">Purchased</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "active" && (
        <>
          <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} schedule={dailySchedule} weekOffset={weekOffset} setWeekOffset={setWeekOffset} />
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
              <p className="font-semibold">No tasks scheduled for this day.</p>
              <p className="text-sm">Enjoy your rest day!</p>
            </div>
          ) : tasksForSelectedDate.map(programGroup => (
            <div key={programGroup.programTitle + programGroup.weekNumber} className="space-y-3">
              <h3 className="font-semibold text-md text-slate-600 px-2">{programGroup.programTitle} - <span className="font-bold text-slate-800">Week {programGroup.weekNumber}</span></h3>
              {programGroup.tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />)}
            </div>
          ))}
        </>
      )}

      {tab === "scheduled" && scheduledPrograms.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
          <p className="font-semibold">No scheduled programs yet.</p>
          <p className="text-sm">Check back soon!</p>
        </div>
      )}
      {tab === "scheduled" && scheduledPrograms.map(p => (
        <div key={p.id} className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-bold text-lg">{p.title}</h3>
          <p className="text-slate-600">{p.description}</p>
          <Badge>Starts on {format(new Date(p.startDate!), "MMMM do")}</Badge>
        </div>
      ))}

      {tab === "purchased" && purchasedPrograms.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
          <p className="font-semibold">No purchased programs yet.</p>
          <p className="text-sm">Visit the store to find your next program!</p>
        </div>
      )}
      {tab === "purchased" && purchasedPrograms.map(p => (
        <div key={p.id} className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-bold text-lg">{p.title}</h3>
          <p className="text-slate-600">{p.description}</p>
          <div className="flex items-center gap-2 text-sm text-blue-600"><Info className="w-4 h-4" /> <span>This program has lifetime access.</span></div>
        </div>
      ))}

      {/* Drawer / Dialog */}
      {isMobile ? (
        <Drawer open={!!selectedTask} onOpenChange={isOpen => !isOpen && setSelectedTask(null)}>
          <DrawerContent>{renderTaskDetails()}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedTask} onOpenChange={isOpen => !isOpen && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-md">{renderTaskDetails()}</DialogContent>
        </Dialog>
      )}
    </div>
  );
}
