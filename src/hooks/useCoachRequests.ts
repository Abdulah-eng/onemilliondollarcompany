// src/hooks/useCoachRequests.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CoachRequestWithCustomer {
  id: string;
  customer_id: string;
  coach_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  created_at: string;
  customer: {
    id: string;
    full_name: string;
    email: string;
    plan: string;
  };
}

export const useCoachRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CoachRequestWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coach_requests')
        .select(`
          *,
          customer:profiles!coach_requests_customer_id_fkey(
            id,
            full_name,
            email,
            plan
          )
        `)
        .eq('coach_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data as CoachRequestWithCustomer[] || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const acceptRequest = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return false;

    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('coach_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update customer's coach_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ coach_id: request.coach_id })
        .eq('id', request.customer_id);

      if (profileError) throw profileError;

      // Remove from pending requests
      setRequests(prev => prev.filter(r => r.id !== requestId));
      return true;
    } catch (error) {
      console.error('Error accepting request:', error);
      return false;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('coach_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      // Remove from pending requests
      setRequests(prev => prev.filter(r => r.id !== requestId));
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      return false;
    }
  };

  return {
    requests,
    loading,
    acceptRequest,
    rejectRequest,
    refreshRequests: fetchRequests,
  };
};