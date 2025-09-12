// src/components/coach/clientCard/program-cards/PastProgramsList.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { format, isBefore, differenceInDays } from 'date-fns';
import { CheckCircle } from 'lucide-react';

type Program = NonNullable<ClientDetailData['assigned_programs']>[number];
const chip = 'rounded-full px-2.5 py-1 text-xs font-semibold';
const cardCls = 'rounded-2xl border bg-card shadow-lg';

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

const PastProgramsList = ({ pastPrograms, clientCheckIns }: { pastPrograms: Program[]; clientCheckIns: ClientDetailData['check_ins'] }) => {
  return (
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
              const adh = p.start_date ? adherenceFor(p, clientCheckIns) : null;
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
  );
};

export default PastProgramsList;
