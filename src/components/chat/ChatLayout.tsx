import React from 'react';
import { ConversationList } from './ConversationList';
import { ChatView } from './ChatView';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';

interface ChatLayoutProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  selectedConversationId,
  onSelectConversation
}) => {
  const { conversations, loading } = useConversations();
  const { profile } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={onSelectConversation}
          userRole={profile?.role}
        />
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatView 
            conversationId={selectedConversationId}
            userRole={profile?.role}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};