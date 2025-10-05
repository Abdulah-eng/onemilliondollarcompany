import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalClients: number;
  totalEarning: number; // dollars
  activePrograms: number;
  retentionRate: number; // percent 0-100
}

export const useCoachDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalClients: 0, totalEarning: 0, activePrograms: 0, retentionRate: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // total clients assigned to this coach
        const { count: totalClients } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('coach_id', user.id)
          .eq('role', 'customer');

        // total earning from payouts (net)
        const { data: payoutRows } = await supabase
          .from('payouts')
          .select('net_amount_cents')
          .eq('coach_id', user.id);
        const totalNetCents = (payoutRows || []).reduce((acc, r: any) => acc + (r.net_amount_cents || 0), 0);

        // active programs count
        const { count: activePrograms } = await supabase
          .from('programs')
          .select('id', { count: 'exact', head: true })
          .eq('coach_id', user.id)
          .eq('status', 'active');

        // simple retention heuristic: customers with non-null plan among all clients
        const { data: clientPlans } = await supabase
          .from('profiles')
          .select('id, plan')
          .eq('coach_id', user.id)
          .eq('role', 'customer');
        const withPlan = (clientPlans || []).filter((p: any) => !!p.plan).length;
        const total = totalClients || (clientPlans?.length || 0);
        const retentionRate = total > 0 ? Math.round((withPlan / total) * 100) : 0;

        setStats({
          totalClients: totalClients || 0,
          totalEarning: Math.round((totalNetCents / 100) * 100) / 100,
          activePrograms: activePrograms || 0,
          retentionRate,
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  return { stats, loading, error };
};

export interface CoachTask {
  id: string;
  clientId?: string;
  clientName?: string | null;
  task: string;
  details?: string;
  tag?: string;
  color?: string;
  link?: string;
}

export const useCoachTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<CoachTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const results: CoachTask[] = [];

        // Use customer_states for accurate missing program/on_track signals
        const { data: states } = await supabase
          .from('customer_states')
          .select('customer_id, missing_program')
          .in('customer_id', (
            (await supabase.from('profiles').select('id').eq('coach_id', user.id).eq('role', 'customer')).data || []
          ).map((p: any) => p.id));
        (states || []).filter((s: any) => s.missing_program).slice(0, 5).forEach((s: any) => {
          results.push({
            id: `noplan-${s.customer_id}`,
            clientId: s.customer_id,
            clientName: undefined,
            task: 'Assign a new program',
            details: 'Customer currently has no active program.',
            tag: 'Missing Program',
            color: 'bg-red-500',
            link: `/coach/clients/${s.customer_id}`,
          });
        });

        // Pending offers -> follow up
        const { data: pendingOffers } = await supabase
          .from('coach_offers')
          .select('id, customer_id, profiles!coach_offers_customer_id_fkey(full_name)')
          .eq('coach_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5);
        (pendingOffers || []).forEach((o: any) => {
          results.push({
            id: `offer-${o.id}`,
            clientId: o.customer_id,
            clientName: o.profiles?.full_name || 'Customer',
            task: 'Follow up on pending offer',
            details: 'Reach out to close the deal.',
            tag: 'Pending Offer',
            color: 'bg-orange-500',
            link: `/coach/messages`,
          });
        });

        // Add renewal prompts (contracts ending soon)
        const { data: renewals } = await supabase
          .from('renewal_prompts')
          .select('contract_id, customer_id, end_date')
          .limit(10);
        (renewals || []).forEach((r: any) => {
          results.push({
            id: `renew-${r.contract_id}`,
            clientId: r.customer_id,
            task: 'Contract renewing soon',
            details: 'Consider sending a renewal offer.',
            tag: 'Renewal',
            color: 'bg-blue-500',
            link: `/coach/messages`,
          });
        });

        setTasks(results);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  return { tasks, loading };
};


