import React, { useState, useEffect } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversationId || null
  );

  // Handle client parameter from URL
  useEffect(() => {
    const clientId = searchParams.get('client');
    const clientName = searchParams.get('name');
    
    if (clientId) {
      // Find or create conversation with this client
      findOrCreateConversation(clientId, clientName);
    }
  }, [searchParams]);

  const findOrCreateConversation = async (clientId: string, clientName?: string | null) => {
    try {
      // First, try to find existing conversation
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('coach_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('customer_id', clientId)
        .single();

      if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        navigate(`/coach/messages/${existingConversation.id}`);
        return;
      }

      // If no existing conversation, create a new one
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          coach_id: (await supabase.auth.getUser()).data.user?.id,
          customer_id: clientId,
          title: `Chat with ${clientName || 'Client'}`
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return;
      }

      setSelectedConversationId(newConversation.id);
      navigate(`/coach/messages/${newConversation.id}`);
    } catch (error) {
      console.error('Error finding/creating conversation:', error);
    }
  };

  const handleSelectConversation = (id: string | null) => {
    setSelectedConversationId(id);
    if (id) {
      navigate(`/coach/messages/${id}`);
    } else {
      navigate('/coach/messages');
    }
  };

  return (
    <div className="h-full">
      <ChatLayout
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
};

export default MessagesPage;