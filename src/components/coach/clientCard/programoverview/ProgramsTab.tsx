// src/components/coach/clientCard/tabs/ProgramsTab.tsx
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
}

// src/components/coach/ClientSummaryBar.tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { Eye, Calendar, Zap, Clock } from 'lucide-react';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface ClientSummaryBarProps {
  client: ClientDetailData;
}

const statusMap = {
  request: { label: 'Request', tone: 'bg-yellow-500', emoji: '🟡' },
  seen: { label: 'Seen', tone: 'bg-blue-500', emoji: '🔵' },
  assigned: { label: 'Assigned', tone: 'bg-emerald-500', emoji: '🟢' },
  active: { label: 'Active', tone: 'bg-emerald-600', emoji: '✅' },
  urgent: { label: 'Urgent', tone: 'bg-orange-500', emoji: '🟠' },
  expired: { label: 'Expired', tone: 'bg-neutral-500', emoji: '⏰' },
} as const;

function initials(name?: string) {
  if (!name) return 'CL';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ClientSummaryBar({ client }: ClientSummaryBarProps) {
  const queryClient = useQueryClient();

  // View-driven data
  const [badges, setBadges] = useState<{
    needs_attention: boolean;
    feedback: boolean;
    follow_up: boolean;
  } | null>(null);
  const [planStatus, setPlanStatus] = useState<{ weeks_left: number; weeks_total: number } | null>(null);
  const [loadingViews, setLoadingViews] = useState(true);

  const [markingSeen, setMarkingSeen] = useState(false);
  const [resolving, setResolving] = useState<{ attention: boolean; feedback: boolean }>({
    attention: false,
    feedback: false,
  });

  // Fetch badges + plan status from views
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingViews(true);
      const [{ data: bRes, error: bErr }, { data: pRes, error: pErr }] = await Promise.all([
        supabase.from('v_client_badges').select('needs_attention, feedback, follow_up').eq('customer_id', client.id).maybeSingle(),
        (supabase.from as any)('v_client_plan_status')
          .select('weeks_left, weeks_total')
          .eq('customer_id', client.id)
          .maybeSingle(),
      ]);

      if (!alive) return;

      if (bErr) console.warn('v_client_badges error:', bErr);
      if (pErr) console.warn('v_client_plan_status error:', pErr);

      setBadges(
        bRes
          ? {
              needs_attention: !!bRes.needs_attention,
              feedback: !!bRes.feedback,
              follow_up: !!bRes.follow_up,
            }
          : {
              needs_attention: false,
              feedback: !!client.has_feedback,
              follow_up: !!client.needs_follow_up,
            }
      );

      setPlanStatus(
        pRes
          ? {
              weeks_left: Number((pRes as any).weeks_left ?? 0),
              weeks_total: Number((pRes as any).weeks_total ?? 4),
            }
          : null
      );

      setLoadingViews(false);
    })();

    return () => {
      alive = false;
    };
  }, [client.id, client.has_feedback, client.needs_follow_up]);

  // Derived state
  const stateKey = (client.client_state ?? 'request') as keyof typeof statusMap;
  const status = statusMap[stateKey] || statusMap.request;

  const activeProgram = useMemo(
    () => client.assigned_programs?.find((p) => p.status === 'active'),
    [client.assigned_programs]
  );

  const timeRemaining = useMemo(() => {
    if (!activeProgram?.end_date) return null;
    const end = new Date(activeProgram.end_date);
    const now = new Date();
    const daysLeft = differenceInDays(end, now);
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Ends today';
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  }, [activeProgram]);

  const lastCheckIn = useMemo(() => {
    if (!client.check_ins?.length) return 'Never';
    const last = client.check_ins
      .map((c) => new Date(c.check_in_date))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return formatDistanceToNow(last, { addSuffix: true });
  }, [client.check_ins]);

  // Only compute adherence if there is an active program
  const adherencePct = useMemo(() => {
    if (!activeProgram) return null;
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCount = client.check_ins?.filter((c) => new Date(c.check_in_date) >= cutoff).length ?? 0;
    return Math.min(100, Math.round((recentCount / 4) * 100));
  }, [activeProgram, client.check_ins]);

  // Actions
  const handleMarkSeen = async () => {
    try {
      setMarkingSeen(true);
      const { error } = await supabase
        .from('profiles')
        .update({ client_state: 'seen' })
        .eq('id', client.id)
        .select()
        .single();
      if (error) throw error;

      toast({ title: 'Marked as seen', description: 'Client status updated.' });
      queryClient.invalidateQueries({ queryKey: ['client-detail'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.message || 'Could not update status.',
        variant: 'destructive',
      });
    } finally {
      setMarkingSeen(false);
    }
  };

  const handleResolveAttention = async () => {
    try {
      setResolving((p) => ({ ...p, attention: true }));
      const { data: openRows, error: selErr } = await (supabase.from as any)('attention_requests')
        .select('id, created_at')
        .eq('customer_id', client.id)
        .is('resolved_at', null)
        .order('created_at', { ascending: false })
        .limit(1);
      if (selErr) throw selErr;

      const latest = openRows?.[0];
      if (!latest) {
        toast({ title: 'Nothing to resolve', description: 'No open attention request found.' });
        return;
      }

      const { error: updErr } = await (supabase.from as any)('attention_requests')
        .update({ resolved_at: new Date().toISOString() } as any)
        .eq('id', (latest as any).id);
      if (updErr) throw updErr;

      toast({ title: 'Attention resolved' });
      setBadges((b) => (b ? { ...b, needs_attention: false } : b));
      queryClient.invalidateQueries({ queryKey: ['client-detail'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (err: any) {
      toast({ title: 'Resolve failed', description: err?.message || 'Could not resolve.', variant: 'destructive' });
    } finally {
      setResolving((p) => ({ ...p, attention: false }));
    }
  };

  const handleResolveFeedback = async () => {
    try {
      setResolving((p) => ({ ...p, feedback: true }));
      const { error: updErr } = await (supabase.from as any)('feedback_responses')
        .update({ solved_at: new Date().toISOString() } as any)
        .eq('customer_id', client.id)
        .is('solved_at', null);
      if (updErr) throw updErr;

      toast({ title: 'Feedback resolved' });
      setBadges((b) => (b ? { ...b, feedback: false } : b));
      queryClient.invalidateQueries({ queryKey: ['client-detail'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (err: any) {
      toast({ title: 'Resolve failed', description: err?.message || 'Could not resolve.', variant: 'destructive' });
    } finally {
      setResolving((p) => ({ ...p, feedback: false }));
    }
  };

  // Button visibility
  const showSeen = stateKey === 'request';
  const showAssign = stateKey === 'seen' || stateKey === 'urgent';
  const showSchedule = ['seen', 'assigned', 'active', 'urgent'].includes(stateKey);

  // --- UI ---
  return (
    <section className="rounded-2xl border bg-card/60 p-4 md:p-5">
      {/* Top row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Identity & status */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-12 w-12 ring-1 ring-border">
            <AvatarImage src={client.avatar_url || undefined} />
            <AvatarFallback className="font-semibold">{initials(client.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight truncate">
              {client.name || 'Unknown Client'}
            </h1>

            {/* Status + badges */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white ${status.tone}`}
              >
                {status.emoji} {status.label}
              </span>

              {!loadingViews && badges?.feedback && (
                <Badge variant="outline" className="text-xs rounded-full">
                  💬 Feedback
                </Badge>
              )}
              {!loadingViews && badges?.follow_up && (
                <Badge className="text-xs rounded-full">🔁 Follow-Up</Badge>
              )}
              {!loadingViews && badges?.needs_attention && (
                <Badge variant="destructive" className="text-xs rounded-full">
                  ⚠️ Needs attention
                </Badge>
              )}
            </div>

            {/* Left chips: Assigned program + Adherence */}
            {(activeProgram || adherencePct !== null) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {activeProgram && (
                  <Badge variant="secondary" className="rounded-full text-xs">
                    📘 Assigned Program
                  </Badge>
                )}
                {adherencePct !== null && (
                  <Badge variant="outline" className="rounded-full text-xs">
                    ⚡ Adherence: {adherencePct}%
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key metrics – pushed to the far right */}
        <div className="md:ml-auto flex flex-wrap gap-3 md:items-center">
          {timeRemaining && (
            <div className="rounded-xl bg-muted/40 px-3 py-2">
              <div className="flex items-center text-[12px] text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Time remaining
              </div>
              <div className="text-sm font-medium">{timeRemaining}</div>
            </div>
          )}

          {/* Last check-in — always */}
          <div className="rounded-xl bg-muted/40 px-3 py-2">
            <div className="flex items-center text-[12px] text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              Last check-in
            </div>
            <div className="text-sm font-medium">{lastCheckIn}</div>
          </div>

          {/* Plan weeks left — show if available */}
          {planStatus && (
            <div className="rounded-xl bg-muted/40 px-3 py-2">
              <div className="flex items-center text-[12px] text-muted-foreground">
                <Zap className="mr-1 h-3 w-3" />
                Plan weeks left
              </div>
              <div className="text-sm font-medium">
                {planStatus.weeks_left}/{planStatus.weeks_total}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {(showSeen || showAssign || showSchedule || badges?.needs_attention || badges?.feedback) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          {showSeen && (
            <Button size="sm" onClick={handleMarkSeen} disabled={markingSeen}>
              <Eye className="mr-2 h-4 w-4" />
              {markingSeen ? 'Marking…' : 'Seen'}
            </Button>
          )}
          {showAssign && (
            <Button size="sm" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Assign Program
            </Button>
          )}
          {showSchedule && (
            <Button size="sm" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          )}

          {badges?.needs_attention && (
            <Button size="sm" variant="destructive" onClick={handleResolveAttention} disabled={resolving.attention}>
              {resolving.attention ? 'Resolving…' : 'Resolve Attention'}
            </Button>
          )}
          {badges?.feedback && (
            <Button size="sm" variant="secondary" onClick={handleResolveFeedback} disabled={resolving.feedback}>
              {resolving.feedback ? 'Resolving…' : 'Resolve Feedback'}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}

// src/components/coach/client-detail/ClientDetailTabs.tsx
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClientDetailData } from '@/hooks/useClientDetail';
import CustomerTab from './CustomerTab';
import ProgramsTab from './ProgramsTab';
import CommunicationTab from './CommunicationTab';

interface ClientDetailTabsProps {
  client: ClientDetailData;
}

const ClientDetailTabs = ({ client }: ClientDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 overflow-x-auto">
        <TabsTrigger value="customer" className="text-xs sm:text-sm">
          Customer
        </TabsTrigger>
        <TabsTrigger value="programs" className="text-xs sm:text-sm">
          Programs
        </TabsTrigger>
        <TabsTrigger value="communication" className="text-xs sm:text-sm">
          Communication
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customer" className="space-y-6 mt-6">
        <CustomerTab client={client} />
      </TabsContent>

      <TabsContent value="programs" className="space-y-6 mt-6">
        <ProgramsTab client={client} />
      </TabsContent>

      <TabsContent value="communication" className="space-y-6 mt-6">
        <CommunicationTab client={client} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDetailTabs;
