import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MessageWithSender {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'offer' | 'system';
  metadata: any;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  coach_offer?: {
    id: string;
    price: number;
    duration_months: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    expires_at: string;
  };
}

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          coach_offer:coach_offers!coach_offers_message_id_fkey(
            id,
            price,
            duration_months,
            status,
            expires_at
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  const sendMessage = async (content: string, messageType: 'text' | 'offer' | 'system' = 'text', metadata = {}) => {
    if (!conversationId || !user) throw new Error('Missing conversation or user');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          metadata
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const sendOffer = async (price: number, durationMonths: number, message: string) => {
    if (!conversationId || !user) throw new Error('Missing conversation or user');

    try {
      // First send the message
      const messageData = await sendMessage(message, 'offer', { 
        price, 
        duration_months: durationMonths 
      });

      // Get the conversation to find customer_id
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('customer_id')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Then create the offer
      const { data: offerData, error: offerError } = await supabase
        .from('coach_offers')
        .insert({
          message_id: messageData.id,
          coach_id: user.id,
          customer_id: conversation.customer_id,
          price,
          duration_months: durationMonths
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Update the message in state to include offer data
      setMessages(prev => prev.map(msg => 
        msg.id === messageData.id 
          ? { ...msg, coach_offer: offerData }
          : msg
      ));

      return { message: messageData, offer: offerData };
    } catch (err) {
      console.error('Error sending offer:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          // Fetch the new message with sender info
          supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
              coach_offer:coach_offers!coach_offers_message_id_fkey(
                id,
                price,
                duration_months,
                status,
                expires_at
              )
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data && data.sender_id !== user?.id) {
                setMessages(prev => [...prev, data]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages, user?.id]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    sendOffer,
    refetch: fetchMessages
  };
};