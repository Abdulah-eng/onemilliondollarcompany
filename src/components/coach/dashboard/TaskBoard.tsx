// src/components/coach/dashboard/TaskBoard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoachTasks } from '@/hooks/useCoachDashboard';

const TaskBoard = () => {
  const { tasks } = useCoachTasks();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Action Board</h2>
      <p className="text-sm text-muted-foreground -mt-2">Tasks that require your immediate attention.</p>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn("w-2 h-2 rounded-full mt-2 sm:mt-2", task.color || 'bg-emerald-500')} />
                <div className="flex-1">
                  <p className="text-base font-semibold text-primary">{task.clientName || 'Customer'}</p>
                  <p className="text-sm text-foreground mt-1 font-medium">{task.task}</p>
                  {task.details && <p className="text-xs text-muted-foreground mt-1">{task.details}</p>}
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0 mt-3 sm:mt-0">
                <Link to={task.link || '/coach/clients'}>
                  View Details
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <div className="text-sm text-muted-foreground">No immediate tasks.</div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
