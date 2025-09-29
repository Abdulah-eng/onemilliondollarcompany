import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { OfferComposer } from './OfferComposer';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatViewProps {
  conversationId: string;
  userRole?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversationId,
  userRole
}) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, sendOffer } = useMessages(conversationId);
  const [showOfferComposer, setShowOfferComposer] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setSending(true);
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async (price: number, duration: number, message: string) => {
    setSending(true);
    try {
      await sendOffer(price, duration, message);
      setShowOfferComposer(false);
      toast.success("Your coaching offer has been sent successfully.");
    } catch (error) {
      console.error('Error sending offer:', error);
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender_id === user?.id}
            userRole={userRole}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Offer Composer */}
      {showOfferComposer && (
        <div className="border-t border-border p-4">
          <OfferComposer
            onSend={handleSendOffer}
            onCancel={() => setShowOfferComposer(false)}
            sending={sending}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          {userRole === 'coach' && !showOfferComposer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOfferComposer(true)}
              className="flex-shrink-0"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Send Offer
            </Button>
          )}
          <div className="flex-1">
            <MessageInput
              onSend={handleSendMessage}
              disabled={sending}
              placeholder={sending ? "Sending..." : "Type a message..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
};