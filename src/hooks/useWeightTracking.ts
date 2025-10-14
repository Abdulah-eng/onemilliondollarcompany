import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRefresh } from '@/contexts/RefreshContext';

export interface WeightEntry {
  id: string;
  weight_kg: number;
  date: string;
  notes?: string;
  created_at: string;
}

export const useWeightTracking = () => {
  const { user } = useAuth();
  const { refreshAll } = useRefresh();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weight entries');
    } finally {
      setLoading(false);
    }
  };

  const addWeightEntry = async (weight: number, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // First, check if there's already an entry for today
      const { data: existingEntry } = await supabase
        .from('weight_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      let data;
      if (existingEntry) {
        // Update existing entry
        const { data: updatedData, error } = await supabase
          .from('weight_entries')
          .update({
            weight_kg: weight,
            notes
          })
          .eq('id', existingEntry.id)
          .select()
          .single();
        
        if (error) throw error;
        data = updatedData;
      } else {
        // Create new entry
        const { data: newData, error } = await supabase
          .from('weight_entries')
          .insert({
            user_id: user.id,
            weight_kg: weight,
            date: today,
            notes
          })
          .select()
          .single();
        
        if (error) throw error;
        data = newData;
      }

      // Update local state - replace existing entry for today or add new one
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== today);
        return [data, ...filtered];
      });
      
      // Use smart refresh to update all related data
      await refreshAll();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add weight entry');
      throw err;
    }
  };

  const getLatestWeight = () => {
    return entries.length > 0 ? entries[0].weight_kg : null;
  };

  const getWeightTrend = () => {
    console.log('getWeightTrend called with entries:', entries.length, entries);
    if (entries.length < 2) {
      console.log('Not enough entries for trend calculation');
      return 0;
    }
    
    const latest = entries[0].weight_kg;
    const previous = entries[1].weight_kg;
    const trend = latest - previous;
    console.log('Weight trend calculated:', { latest, previous, trend });
    return trend;
  };

  const getWeightHistory = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    error,
    addWeightEntry,
    getLatestWeight,
    getWeightTrend,
    getWeightHistory,
    refetch: fetchEntries
  };
};
