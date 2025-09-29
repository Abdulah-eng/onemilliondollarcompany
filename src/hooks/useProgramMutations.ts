import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Program, ProgramStatus, ProgramCategory } from '@/types/program';
import { toast } from 'sonner';

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

  const createProgram = async (data: CreateProgramData): Promise<Program | null> => {
    if (!profile?.id) {
      toast.error('You must be logged in to create programs');
      return null;
    }

    try {
      setLoading(true);
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

      if (error) throw error;

      toast.success('Program created successfully!');
      
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
        .single();

      if (error) throw error;

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