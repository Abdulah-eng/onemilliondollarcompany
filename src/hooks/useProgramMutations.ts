import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRefresh } from '@/contexts/RefreshContext';
import { Program, ProgramStatus, ProgramCategory } from '@/types/program';
import { toast } from 'sonner';
import { supabase as sb } from '@/integrations/supabase/client';

interface CreateProgramData {
  name: string;
  description: string;
  category: ProgramCategory;
  status?: ProgramStatus;
  assignedTo?: string | null;
  scheduledDate?: string;
  plan?: any;
}

interface UpdateProgramData extends CreateProgramData {
  id: string;
}

export const useProgramMutations = () => {
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { refreshAll } = useRefresh();

  const createProgram = async (data: CreateProgramData): Promise<Program | null> => {
    if (!profile?.id) {
      toast.error('You must be logged in to create programs');
      return null;
    }

    try {
      setLoading(true);
      // If assigning to a customer, verify active contract exists
      if (data.assignedTo) {
        const { data: contractCheck, error: contractErr } = await supabase
          .from('contracts')
          .select('id')
          .eq('coach_id', profile.id)
          .eq('customer_id', data.assignedTo)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();
        if (contractErr) {
          console.error('Contract check failed:', contractErr);
          toast.error('Could not verify contract. Try again.');
          return null;
        }
        if (!contractCheck) {
          toast.error('You can only assign programs to customers with an active contract.');
          return null;
        }
      }
      const { data: result, error } = await supabase
        .from('programs')
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status || 'draft',
          coach_id: profile.id,
          assigned_to: data.assignedTo || null,
          scheduled_date: data.scheduledDate || null,
          plan: data.plan || null,
        })
        .select()
        .single();
      // If assigned to a client, send a system message notifying assignment
      if (result?.assigned_to) {
        try {
          // Find or create conversation
          const { data: convo } = await sb
            .from('conversations')
            .select('id')
            .eq('coach_id', profile.id)
            .eq('customer_id', result.assigned_to)
            .single();
          let conversationId = convo?.id;
          if (!conversationId) {
            const { data: newConvo } = await sb
              .from('conversations')
              .insert({ coach_id: profile.id, customer_id: result.assigned_to })
              .select('id')
              .single();
            conversationId = newConvo?.id;
          }
          if (conversationId) {
            await sb.from('messages').insert({
              conversation_id: conversationId,
              sender_id: profile.id,
              content: `A new program "${result.name}" has been assigned to you.`,
              type: 'system',
            });
          }
        } catch {}
      }


      if (error) throw error;

      toast.success('Program created successfully!');
      
      // Use smart refresh to update all related data
      await refreshAll();
      
      // Transform the result to match our Program interface
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        status: result.status as ProgramStatus,
        category: result.category as ProgramCategory,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        assignedTo: result.assigned_to,
        scheduledDate: result.scheduled_date || undefined,
        plan: result.plan || undefined,
      };
    } catch (err) {
      console.error('Error creating program:', err);
      toast.error('Failed to create program');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProgram = async (data: UpdateProgramData): Promise<Program | null> => {
    if (!profile?.id) {
      toast.error('You must be logged in to update programs');
      return null;
    }

    try {
      setLoading(true);
      // If changing assignment, verify active contract exists
      if (data.assignedTo) {
        const { data: contractCheck, error: contractErr } = await supabase
          .from('contracts')
          .select('id')
          .eq('coach_id', profile.id)
          .eq('customer_id', data.assignedTo)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();
        if (contractErr) {
          console.error('Contract check failed:', contractErr);
          toast.error('Could not verify contract. Try again.');
          return null;
        }
        if (!contractCheck) {
          toast.error('You can only assign programs to customers with an active contract.');
          return null;
        }
      }
      const { data: result, error } = await supabase
        .from('programs')
        .update({
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status || 'draft',
          assigned_to: data.assignedTo || null,
          scheduled_date: data.scheduledDate || null,
          plan: data.plan || null,
        })
        .eq('id', data.id)
        .eq('coach_id', profile.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Program updated successfully!');
      
      // Use smart refresh to update all related data
      await refreshAll();
      
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        status: result.status as ProgramStatus,
        category: result.category as ProgramCategory,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        assignedTo: result.assigned_to,
        scheduledDate: result.scheduled_date || undefined,
        plan: result.plan || undefined,
      };
    } catch (err) {
      console.error('Error updating program:', err);
      toast.error('Failed to update program');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: string): Promise<boolean> => {
    if (!profile?.id) {
      toast.error('You must be logged in to delete programs');
      return false;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id)
        .eq('coach_id', profile.id);

      if (error) throw error;

      toast.success('Program deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting program:', err);
      toast.error('Failed to delete program');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProgramById = async (id: string): Promise<Program | null> => {
    if (!profile?.id) return null;

    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .eq('coach_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status as ProgramStatus,
        category: data.category as ProgramCategory,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        assignedTo: data.assigned_to,
        scheduledDate: data.scheduled_date || undefined,
        plan: data.plan || undefined,
      };
    } catch (err) {
      console.error('Error fetching program:', err);
      return null;
    }
  };

  return {
    createProgram,
    updateProgram,
    deleteProgram,
    getProgramById,
    loading,
  };
};