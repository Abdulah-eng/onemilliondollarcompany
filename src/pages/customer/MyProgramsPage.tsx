// src/pages/customer/MyProgramsPage.tsx
import { useState } from "react";
import { isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HorizontalCalendar from "@/components/customer/programsoverview/HorizontalCalendar";
import { TaskCard } from "@/components/customer/programsoverview/TaskCard";
import SlideInDetail from "@/components/customer/programsoverview/SlideInDetail";
import ProgramDetailView from "@/components/customer/programsoverview/ProgramDetailView";
import { mockPrograms, ScheduledTask } from "@/mockdata/programs/mockPrograms";

export default function MyProgramsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  // Flatten the schedule from all dates into a single array for easier filtering
  const schedule: ScheduledTask[] = Object.values(mockPrograms[0].schedule).flat();

  // Correctly filter tasks for the selected day using isSameDay from date-fns
  const tasksForSelectedDay = schedule.filter((task) =>
    isSameDay(task.date, selectedDate)
  );

  return (
    <>
      {/* Main content wrapper for centering */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Programs</h1>

        <Tabs defaultValue="active" className="w-full">
          {/* Constrain and center the tabs list */}
          <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="purchased">Purchased</TabsTrigger>
          </TabsList>

          {/* Active Tab Content */}
          <TabsContent value="active" className="mt-6 space-y-6">
            <HorizontalCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              schedule={schedule}
            />

            <div className="w-full">
              {tasksForSelectedDay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasksForSelectedDay.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-6 border rounded-lg p-8">
                  No tasks today!
                </div>
              )}
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="scheduled">
            <div className="text-center text-gray-500 mt-6 border rounded-lg p-8">
              No scheduled programs yet.
            </div>
          </TabsContent>
          <TabsContent value="purchased">
            <div className="text-center text-gray-500 mt-6 border rounded-lg p-8">
              No purchased programs yet.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Slide-in component is unaffected by layout changes due to its fixed positioning */}
      {selectedTask && (
        <SlideInDetail onClose={() => setSelectedTask(null)}>
          <ProgramDetailView task={selectedTask} />
        </SlideInDetail>
      )}
    </>
  );
}
