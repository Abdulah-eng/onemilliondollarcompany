import React, { useState, useEffect } from 'react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';
import { syncCheckoutSession } from '@/lib/stripe/api';
import { toast } from 'sonner';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversationId || null
  );
  const { conversations, loading, refetch: refetchConversations } = useConversations();

  // Handle Stripe redirect for offer payments - must run before auto-opening conversation
  useEffect(() => {
    const offerStatus = searchParams.get('offer_status');
    const sessionId = searchParams.get('session_id');
    
    console.log('[Frontend] MessagesPage - checking payment redirect', { 
      offerStatus, 
      sessionId,
      search: window.location.search 
    });
    
    // Log session ID prominently if present
    if (sessionId) {
      console.log('%c📋 STRIPE SESSION ID FROM REDIRECT (Copy this for testing):', 'background: #222; color: #0f0; font-size: 16px; font-weight: bold; padding: 10px;');
      console.log('%c' + sessionId, 'background: #222; color: #0ff; font-size: 14px; padding: 5px; font-family: monospace;');
      console.log('%cUse this in test script: .\\test-curl.ps1 -SessionId "' + sessionId + '" -AnonKey "YOUR_KEY"', 'background: #222; color: #ff0; font-size: 12px; padding: 5px;');
    }
    
    if (offerStatus === 'paid' && sessionId) {
      console.log('[Frontend] Payment successful, processing offer acceptance', { sessionId });
      toast.success('Payment successful! Processing your coaching offer...');
      
      let attempts = 0;
      const maxAttempts = 15;
      let offerAccepted = false;
      
      const checkOfferStatus = async () => {
        if (offerAccepted) return;
        
        attempts += 1;
        console.log(`[Frontend] Checking offer status (attempt ${attempts}/${maxAttempts})`);
        
        try {
          console.log('[Frontend] Calling syncCheckoutSession with sessionId:', sessionId);
          const syncResult = await syncCheckoutSession(sessionId);
          console.log('[Frontend] syncCheckoutSession response:', syncResult);
          
          if (syncResult?.status === 'accepted' || syncResult?.ok) {
            console.log('[Frontend] Offer sync result - ACCEPTED', syncResult);
            offerAccepted = true;
            await refetchConversations();
            
            // Dispatch custom event to trigger message refetch in ChatView
            // The realtime subscription should also update automatically
            window.dispatchEvent(new CustomEvent('offer-status-updated', { 
              detail: { offerId: syncResult.offerId, status: 'accepted' } 
            }));
            
            toast.success('🎉 Your coaching offer has been accepted! Your coaching plan is now active.');
            
            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete('offer_status');
            url.searchParams.delete('session_id');
            window.history.replaceState({}, '', url.toString());
            
            // Small delay then refresh messages by navigating to same page
            // This ensures messages are refetched with updated offer status
            setTimeout(() => {
              if (selectedConversationId) {
                navigate(`/customer/messages/${selectedConversationId}`, { replace: true });
              } else {
                navigate('/customer/messages', { replace: true });
              }
            }, 500);
            return;
          } else {
            console.log('[Frontend] Offer sync result - not accepted yet', syncResult);
          }
        } catch (error) {
          console.error('[Frontend] Error checking offer status', error);
          console.error('[Frontend] Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
        }
        
        if (attempts >= maxAttempts && !offerAccepted) {
          console.warn('[Frontend] Offer status check timed out');
          toast.info('Payment processed! Your offer status should update shortly. Please refresh if needed.');
          
          // Clean URL
          const url = new URL(window.location.href);
          url.searchParams.delete('offer_status');
          url.searchParams.delete('session_id');
          window.history.replaceState({}, '', url.toString());
          navigate(window.location.pathname, { replace: true });
        }
      };
      
      // Check immediately
      checkOfferStatus();
      
      // Then check periodically
      const interval = setInterval(() => {
        if (!offerAccepted && attempts < maxAttempts) {
          checkOfferStatus();
        } else {
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
      navigate(window.location.pathname, { replace: true });
    }
  }, [searchParams, navigate, refetchConversations]);

  // Auto-open most recent conversation if no specific conversation is selected (desktop only)
  useEffect(() => {
    if (!conversationId && !loading && conversations.length > 0 && !selectedConversationId && !isMobile) {
      // Find the most recent conversation (conversations are already sorted by updated_at desc)
      const mostRecentConversation = conversations[0];
      if (mostRecentConversation) {
        setSelectedConversationId(mostRecentConversation.id);
        navigate(`/customer/messages/${mostRecentConversation.id}`);
      }
    }
  }, [conversationId, loading, conversations, selectedConversationId, navigate, isMobile]);

  const handleSelectConversation = (id: string | null) => {
    setSelectedConversationId(id);
    if (id) {
      navigate(`/customer/messages/${id}`);
    } else {
      navigate('/customer/messages');
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