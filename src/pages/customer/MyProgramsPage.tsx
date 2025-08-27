// src/pages/customer/MyProgramsPage.tsx
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/customer/programsoverview/TaskCard";
import HorizontalCalendar from "@/components/customer/programsoverview/HorizontalCalendar";
import SlideInDetail from "@/components/customer/programsoverview/SlideInDetail";
import { mockPrograms, generateDailySchedule, ScheduledTask } from "@/mockdata/programs/mockprograms";
import { isSameDay } from "date-fns";

type TabType = "active" | "scheduled" | "purchased";

export default function MyProgramsPage() {
  const [tab, setTab] = useState<TabType>("active");
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const filteredPrograms = useMemo(
    () => mockPrograms.filter((p) => p.status === tab),
    [tab]
  );
  const todayTasks = dailySchedule.filter((t) => isSameDay(t.date, selectedDate));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto rounded-xl bg-white p-1 shadow-sm">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Calendar */}
      <HorizontalCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        schedule={dailySchedule}
      />

      {/* Tasks */}
      <div className="space-y-4">
        {todayTasks.length === 0 ? (
          <div className="p-4 text-center border border-dashed rounded-2xl text-gray-500">
            No tasks today!
          </div>
        ) : (
          todayTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))
        )}
      </div>

      {/* Slide-in detail (keeps floating outside main centered layout) */}
      <SlideInDetail task={selectedTask} isMobile={isMobile} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
