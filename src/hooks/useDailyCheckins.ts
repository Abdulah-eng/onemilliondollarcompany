import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DailyCheckinRecord {
  id: string;
  user_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  water_liters: number | null;
  mood: number | null;
  energy: number | null;
  sleep_hours: number | null;
}

export const useDailyCheckins = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<DailyCheckinRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckins = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      if (error) throw error;
      setCheckins((data || []) as DailyCheckinRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [user]);

  const upsertToday = async (payload: {
    water_liters?: number | null;
    mood?: number | null;
    energy?: number | null;
    sleep_hours?: number | null;
  }) => {
    if (!user) throw new Error('Not authenticated');
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('daily_checkins')
      .upsert({
        user_id: user.id,
        date: today,
        ...payload,
      }, { onConflict: 'user_id,date' })
      .select('*');
    if (error) throw error;
    await fetchCheckins();
    return data as DailyCheckinRecord[];
  };

  const last7Days = useMemo(() => checkins.slice(-7), [checkins]);

  return { checkins, last7Days, loading, error, refetch: fetchCheckins, upsertToday };
};


