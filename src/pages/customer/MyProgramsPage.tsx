import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HorizontalCalendar from "@/components/customer/programsoverview/HorizontalCalendar";
import TaskCard from "@/components/customer/programsoverview/TaskCard";
import SlideInDetail from "@/components/customer/programsoverview/SlideInDetail";
import ProgramDetailView from "@/components/customer/programsoverview/ProgramDetailView";
import { mockPrograms } from "@/mockdata/programs/mockPrograms";

export default function MyProgramsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // For demo: take the first program's schedule
  const activeProgram = mockPrograms[0];
  const schedule = activeProgram.schedule;

  // Get tasks for the selected date
  const tasksForSelectedDay =
    schedule[selectedDate.toDateString()] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Programs</h1>

      {/* Centered container */}
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        
        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="flex justify-center w-full">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="purchased">Purchased</TabsTrigger>
          </TabsList>

          {/* Active Tab Content */}
          <TabsContent value="active">
            {/* Horizontal Calendar */}
            <HorizontalCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              schedule={schedule}
            />

            {/* Task Grid */}
            <div className="mt-6 w-full">
              {tasksForSelectedDay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasksForSelectedDay.map((task: any) => (
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

          {/* Placeholder for other tabs */}
          <TabsContent value="scheduled">
            <div className="text-center text-gray-500 mt-6">
              No scheduled programs yet.
            </div>
          </TabsContent>
          <TabsContent value="purchased">
            <div className="text-center text-gray-500 mt-6">
              No purchased programs yet.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Slide-in Task Detail */}
      {selectedTask && (
        <SlideInDetail onClose={() => setSelectedTask(null)}>
          <ProgramDetailView task={selectedTask} />
        </SlideInDetail>
      )}
    </div>
  );
}
