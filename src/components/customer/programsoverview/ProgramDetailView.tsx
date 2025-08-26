import { Badge } from "@/components/ui/badge";
import { ScheduledTask } from "@/pages/customer/MyProgramsPage";

export const ProgramDetailView = ({ program }: { program: ScheduledTask | null }) => {
  if (!program) return null;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{program.title}</h2>
      <Badge variant="outline" className="mb-4">
        {program.programTitle} - Week {program.weekNumber}
      </Badge>
      <ul className="list-disc pl-5 space-y-2 text-slate-700">
        {program.content.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
    </div>
  );
};
