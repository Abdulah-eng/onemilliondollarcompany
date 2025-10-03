import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProgramEntry {
  id: string;
  user_id: string;
  program_id: string | null;
  date: string; // YYYY-MM-DD
  type: 'fitness' | 'nutrition' | 'mental';
  notes?: string | null;
  data?: any;
}

export const useProgramEntries = (programId?: string) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase.from('program_entries').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (programId) query = query.eq('program_id', programId);
      const { data, error } = await query;
      if (error) throw error;
      setEntries((data || []) as ProgramEntry[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load program entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, [user, programId]);

  const completeToday = async (payload: { program_id: string | null; type: ProgramEntry['type']; notes?: string; data?: any; }) => {
    if (!user) throw new Error('Not authenticated');
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('program_entries')
      .upsert({
        user_id: user.id,
        program_id: payload.program_id,
        date: today,
        type: payload.type,
        notes: payload.notes || null,
        data: payload.data || null,
      }, { onConflict: 'user_id,program_id,date' })
      .select('*');
    if (error) throw error;
    await fetchEntries();
    return data as ProgramEntry[];
  };

  return { entries, loading, error, refetch: fetchEntries, completeToday };
};


