import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CustomerProgram {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'scheduled' | 'draft' | 'normal';
  category: 'fitness' | 'nutrition' | 'mental health';
  coach_id: string;
  assigned_to: string | null;
  scheduled_date: string | null;
  plan: any;
  created_at: string;
  updated_at: string;
  coach_name?: string;
}

export const useCustomerPrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<CustomerProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          *,
          coach:coach_id(full_name)
        `)
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const programsWithCoach = (data || []).map(program => ({
        ...program,
        coach_name: program.coach?.full_name || 'Unknown Coach'
      }));
      
      setPrograms(programsWithCoach);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [user]);

  const activeProgram = programs.find(p => p.status === 'active');
  const scheduledPrograms = programs.filter(p => p.status === 'scheduled');

  return {
    programs,
    activeProgram,
    scheduledPrograms,
    loading,
    error,
    refetch: fetchPrograms
  };
};
