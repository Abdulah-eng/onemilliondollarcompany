// src/components/coach/clientCard/tabs/ProgramsTab.tsx
import React, { useMemo } from 'react';
import { ClientDetailData } from '@/hooks/useClientDetail';
import CurrentProgramCard from '../program-cards/CurrentProgramCard';
import ScheduledProgramCard from '../program-cards/ScheduledProgramCard';
import PastProgramsList from '../program-cards/PastProgramsList';
import { isAfter, isBefore } from 'date-fns';

interface ProgramsTabProps {
  client: ClientDetailData;
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
      <CurrentProgramCard client={client} currentProgram={currentProgram} />
      {scheduledProgram && <ScheduledProgramCard scheduledProgram={scheduledProgram} />}
      <PastProgramsList pastPrograms={pastPrograms} clientCheckIns={client.check_ins} />
    </div>
  );
};

export default ProgramsTab;
