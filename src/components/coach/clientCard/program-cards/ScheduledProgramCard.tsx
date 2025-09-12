// src/components/coach/clientCard/program-cards/ScheduledProgramCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { format, differenceInDays } from 'date-fns';
import { Clock } from 'lucide-react';

type Program = NonNullable<ClientDetailData['assigned_programs']>[number];
const chip = 'rounded-full px-2.5 py-1 text-xs font-semibold';
const cardCls = 'rounded-2xl border bg-card shadow-lg';

const ScheduledProgramCard = ({ scheduledProgram }: { scheduledProgram: Program | null }) => {
  if (!scheduledProgram) return null;

  const daysUntilStart = differenceInDays(new Date(scheduledProgram.start_date!), new Date());

  return (
    <Card className={cardCls}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Clock className="h-5 w-5" />
          Scheduled Program
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">Program</div>
            <h3 className="font-semibold truncate">
              #{scheduledProgram.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Starts {format(new Date(scheduledProgram.start_date!), 'MMM dd, yyyy')}
            </p>
          </div>
          <Badge variant="secondary" className={chip}>
            {daysUntilStart} days
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledProgramCard;
