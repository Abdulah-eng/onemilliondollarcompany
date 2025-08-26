// src/components/customer/programsoverview/ProgramDetailView.tsx
import { Badge } from "@/components/ui/badge";
import { ScheduledTask } from "@/mockdata/programs/mockprograms";

export default function ProgramDetailView({ task }: { task: ScheduledTask | null }) {
  if (!task) return null;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{task.title} ✨</h2>
      <Badge variant="outline" className="mb-4">{task.programTitle} - Week {task.weekNumber}</Badge>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {task.content.map((item, i) => <li key={i}>{item} ✅</li>)}
      </ul>
    </div>
  );
}
