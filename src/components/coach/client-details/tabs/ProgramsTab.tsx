// src/components/coach/client-details/tabs/ProgramsTab.tsx
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { Calendar, Play, CheckCircle, Clock, Plus, Edit, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgramsTabProps {
  client: ClientDetailData;
}

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

const ProgramsTab = ({ client }: ProgramsTabProps) => {
  const programs = client.assigned_programs || [];

  const currentProgram = useMemo(
    () => programs.find((p) => p.status === 'active') || null,
    [programs]
  );

  const scheduledProgram = useMemo(
    () =>
      programs
        .filter((p) => p.start_date && isAfter(new Date(p.start_date), new Date()))
        .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())[0] || null,
    [programs]
  );

  const pastPrograms = useMemo(() => {
    const now = new Date();
    return programs
      .filter((p) => {
        const future = p.start_date ? isAfter(new Date(p.start_date), now) : false;
        return p.status !== 'active' && !future;
      })
      .sort((a, b) => {
        const aEnd = a.end_date ? new Date(a.end_date).getTime() : 0;
        const bEnd = b.end_date ? new Date(b.end_date).getTime() : 0;
        return bEnd - aEnd;
      });
  }, [programs]);

  return (
    <div className="space-y-6">
      {/* Current Program */}
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

      {/* Scheduled Program */}
      {scheduledProgram && (
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
                {differenceInDays(new Date(scheduledProgram.start_date!), new Date())} days
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Programs */}
      <Card className={cardCls}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle className="h-5 w-5" />
            Past Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastPrograms.length > 0 ? (
            <div className="space-y-3">
              {pastPrograms.map((p) => {
                const adh = p.start_date ? adherenceFor(p, client.check_ins) : null;
                const ended =
                  p.end_date && isBefore(new Date(p.end_date), new Date())
                    ? format(new Date(p.end_date), 'MMM dd, yyyy')
                    : p.end_date
                    ? format(new Date(p.end_date), 'MMM dd, yyyy')
                    : '—';

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-medium truncate">#{p.id.slice(0, 8)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {p.start_date ? format(new Date(p.start_date), 'MMM dd, yyyy') : '—'} – {ended}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {adh !== null && (
                        <div className="text-center">
                          <div className="text-sm font-bold">{adh}%</div>
                          <div className="text-xs text-muted-foreground">Adherence</div>
                        </div>
                      )}
                      <Badge className={`${chip} bg-muted text-muted-foreground capitalize`}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No past programs found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramsTab;
