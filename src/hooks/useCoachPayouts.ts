import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { postJson } from '@/lib/utils';

export interface PayoutRecord {
  id: string;
  coach_id: string;
  amount_cents: number;
  platform_fee_cents: number;
  net_amount_cents: number;
  status: 'pending' | 'paid' | 'failed';
  period_start: string; // date
  period_end: string;   // date
  created_at: string;
}

export const useCoachPayouts = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayouts((data || []) as PayoutRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayouts(); }, [user]);

  const requestWithdrawal = async (amountCents: number) => {
    if (!user) throw new Error('Not authenticated');
    // Call backend to create payout intent and schedule transfer
    return await postJson('/api/payouts/request', { amountCents, coachId: user.id });
  };

  return { payouts, loading, error, refetch: fetchPayouts, requestWithdrawal };
};


