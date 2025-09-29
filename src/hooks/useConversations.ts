import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConversationWithProfiles {
  id: string;
  coach_id: string;
  customer_id: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  coach?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  customer?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    message_type: string;
  };
  unread_count?: number;
}

export const useConversations = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          coach:profiles!conversations_coach_id_fkey(id, full_name, avatar_url),
          customer:profiles!conversations_customer_id_fkey(id, full_name, avatar_url),
          messages(content, created_at, message_type)
        `)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process conversations to add last message
      const processedConversations = data.map(conv => ({
        ...conv,
        last_message: conv.messages?.[conv.messages.length - 1] || null,
        unread_count: 0 // TODO: Implement unread count logic
      }));

      setConversations(processedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (coachId: string, customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          coach_id: coachId,
          customer_id: customerId
        })
        .select(`
          *,
          coach:profiles!conversations_coach_id_fkey(id, full_name, avatar_url),
          customer:profiles!conversations_customer_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw err;
    }
  };

  const getOrCreateConversation = async (coachId: string, customerId: string) => {
    try {
      // First try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from('conversations')
        .select(`
          *,
          coach:profiles!conversations_coach_id_fkey(id, full_name, avatar_url),
          customer:profiles!conversations_customer_id_fkey(id, full_name, avatar_url)
        `)
        .eq('coach_id', coachId)
        .eq('customer_id', customerId)
        .single();

      if (existing && !findError) {
        return existing;
      }

      // Create new conversation if not found
      return await createConversation(coachId, customerId);
    } catch (err) {
      console.error('Error getting or creating conversation:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConversations();

    // Set up real-time subscription
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    createConversation,
    getOrCreateConversation
  };
};