import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { OfferComposer } from './OfferComposer';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ChatViewProps {
  conversationId: string;
  userRole?: string;
  onBack?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversationId,
  userRole,
  onBack
}) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, sendOffer, refetch } = useMessages(conversationId);
  const [showOfferComposer, setShowOfferComposer] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Stripe redirect for one-time offer payments success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const offerStatus = params.get('offer_status');
    const sessionId = params.get('session_id');
    
    if (offerStatus === 'paid' && sessionId) {
      console.log('[Frontend] Payment successful, processing offer acceptance', { sessionId });
      toast.success('Payment successful! Processing your coaching offer...');
      
      // Poll to verify webhook processed the offer and updated status
      let attempts = 0;
      const maxAttempts = 15; // 22.5 seconds total
      let offerAccepted = false;
      
      const checkOfferStatus = async () => {
        if (offerAccepted) return;
        
        attempts += 1;
        console.log(`[Frontend] Checking offer status (attempt ${attempts}/${maxAttempts})`);
        
        try {
          // Refetch messages to get latest status
          await refetch();
          
          // Check messages after a brief delay to allow state update
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Check if any offer in current messages has been accepted
          // We'll check the messages state after refetch completes
          // Since we can't directly access updated messages here, we'll rely on realtime updates
          // or check via a different approach
        } catch (error) {
          console.error('[Frontend] Error checking offer status', error);
        }
        
        if (attempts >= maxAttempts && !offerAccepted) {
          console.warn('[Frontend] Offer status check timed out');
          toast.info('Payment processed! Your offer status should update shortly. Please refresh if needed.');
          
          // Clean URL
          const url = new URL(window.location.href);
          url.searchParams.delete('offer_status');
          url.searchParams.delete('session_id');
          window.history.replaceState({}, '', url.toString());
        }
      };
      
      // Also listen for realtime updates to messages
      const checkMessagesForAcceptedOffer = () => {
        const hasAcceptedOffer = messages.some(msg => 
          msg.coach_offer?.status === 'accepted'
        );
        
        if (hasAcceptedOffer && !offerAccepted) {
          offerAccepted = true;
          console.log('[Frontend] ✅ Offer confirmed as accepted!');
          toast.success('🎉 Your coaching offer has been accepted! Your coaching plan is now active.');
          
          // Clean URL
          const url = new URL(window.location.href);
          url.searchParams.delete('offer_status');
          url.searchParams.delete('session_id');
          window.history.replaceState({}, '', url.toString());
        }
      };
      
      // Check immediately
      checkOfferStatus();
      checkMessagesForAcceptedOffer();
      
      // Then check periodically
      const interval = setInterval(() => {
        if (!offerAccepted && attempts < maxAttempts) {
          checkOfferStatus();
        }
        checkMessagesForAcceptedOffer();
        
        if (offerAccepted || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 1500);
      
      return () => clearInterval(interval);
    } else if (offerStatus === 'cancel') {
      toast.info('Payment was cancelled. You can try again when ready.');
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('offer_status');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [refetch, messages]); // Include messages to check when it updates

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

  const handleSendFile = async (file: File) => {
    setSending(true);
    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          await sendMessage(`[FILE:${file.name}:${base64}]`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error("Failed to send file. Please try again.");
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
      {/* Mobile Header with Back Button */}
      {onBack && (
        <div className="md:hidden border-b border-border p-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-medium">Conversation</h2>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
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
        <div className="border-t border-border p-2 sm:p-3 md:p-4">
          <OfferComposer
            onSend={handleSendOffer}
            onCancel={() => setShowOfferComposer(false)}
            sending={sending}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-border p-2 sm:p-3 md:p-4">
        <div className="flex gap-1 sm:gap-2">
          {userRole === 'coach' && !showOfferComposer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOfferComposer(true)}
              className="flex-shrink-0"
            >
              <DollarSign className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Send Offer</span>
            </Button>
          )}
          <div className="flex-1">
            <MessageInput
              onSend={handleSendMessage}
              onSendFile={handleSendFile}
              disabled={sending}
              placeholder={sending ? "Sending..." : "Type a message..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
};