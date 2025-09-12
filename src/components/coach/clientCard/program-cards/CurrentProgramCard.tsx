// src/components/coach/clientCard/program-cards/CurrentProgramCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Play, Plus, Edit, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Program = NonNullable<ClientDetailData['assigned_programs']>[number];
const chip = 'rounded-full px-2.5 py-1 text-xs font-semibold';
const cardCls = 'rounded-2xl border bg-card shadow-lg';

function daysLeft(endDate?: string | null) {
  if (!endDate) return null;
  const diff = differenceInDays(new Date(endDate), new Date());
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Ends today';
  return `${diff} day${diff !== 1 ? 's' : ''}`;
}

function adherenceFor(program: Program, checkIns: ClientDetailData['check_ins']) {
  if (!program.start_date) return null;
  const start = new Date(program.start_date);
  const end = program.end_date ? new Date(program.end_date) : new Date();

  const hits = (checkIns || []).filter(
    (c) =>
      c.program_id === program.id &&
      new Date(c.check_in_date) >= start &&
      new Date(c.check_in_date) <= end
  ).length;

  const durDays = Math.max(1, differenceInDays(end, start) + 1);
  const expected = Math.max(1, Math.round(durDays / 7));
  const pct = Math.min(100, Math.round((hits / expected) * 100));
  return pct;
}

const CurrentProgramCard = ({ client, currentProgram }: { client: ClientDetailData; currentProgram: Program | null }) => {
  return (
    <Card className={cardCls}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Current Program
          </span>
          {currentProgram && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Update
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentProgram ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">Program</div>
                <h3 className="font-semibold truncate">
                  #{currentProgram.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentProgram.start_date
                    ? format(new Date(currentProgram.start_date), 'MMM dd, yyyy')
                    : '—'}{' '}
                  –{' '}
                  {currentProgram.end_date
                    ? format(new Date(currentProgram.end_date), 'MMM dd, yyyy')
                    : 'Ongoing'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {currentProgram.start_date && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {adherenceFor(currentProgram, client.check_ins) ?? '—'}%
                    </div>
                    <div className="text-xs text-muted-foreground">Adherence</div>
                  </div>
                )}
                {currentProgram.end_date && (
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {(() => {
                        const d = differenceInDays(
                          new Date(currentProgram.end_date),
                          new Date()
                        );
                        return Math.max(0, d);
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge className={`${chip} bg-primary/10 text-primary border-primary/20`}>
                {currentProgram.status}
              </Badge>
              {currentProgram.end_date && (
                <Badge className={`${chip} bg-muted text-muted-foreground`}>
                  <Clock className="mr-1 h-3 w-3" />
                  {daysLeft(currentProgram.end_date)}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Active Program</h3>
            <p className="text-muted-foreground mb-4">
              This client doesn’t have an active program assigned.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentProgramCard;
