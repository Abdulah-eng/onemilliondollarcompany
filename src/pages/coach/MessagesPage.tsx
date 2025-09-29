import React, { useState } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { useNavigate, useParams } from 'react-router-dom';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversationId || null
  );

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