// src/components/coach/dashboard/TaskBoard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapped from system logic and notifications
const mockTasks = [
  {
    id: 1,
    clientName: 'Sarah Jenkins',
    task: 'Assign new program',
    urgency: 'high',
    details: 'Sarah has been waiting for a program for 4 days.',
    tag: 'Missing Program',
    color: 'bg-red-500',
    link: '/coach/requests',
  },
  {
    id: 2,
    clientName: 'Mark Robertson',
    task: 'Provide feedback',
    urgency: 'medium',
    details: 'Mark has logged a full week of data on his premium plan. He needs feedback.',
    tag: 'Needs Feedback',
    color: 'bg-orange-500',
    link: '/coach/clients/mark-robertson',
  },
  {
    id: 3,
    clientName: 'Emily Chen',
    task: 'Check-in on progress',
    urgency: 'medium',
    details: 'Emily is skipping daily logs frequently.',
    tag: 'Off Track',
    color: 'bg-orange-500',
    link: '/coach/clients/emily-chen',
  },
  {
    id: 4,
    clientName: 'Chris Miller',
    task: 'Program renewal due',
    urgency: 'low',
    details: 'Chris’s subscription program ends in 5 days. Schedule a follow-up.',
    tag: 'Soon to Expire',
    color: 'bg-orange-500',
    link: '/coach/clients/chris-miller',
  },
];

const TaskBoard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Action Board</h2>
      <div className="space-y-4">
        {mockTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn("w-2 h-2 rounded-full mt-2 sm:mt-0", task.color)} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{task.task} for <span className="text-primary">{task.clientName}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{task.details}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost" className="shrink-0 ml-auto sm:ml-0">
                <Link to={task.link}>
                  View Details
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
