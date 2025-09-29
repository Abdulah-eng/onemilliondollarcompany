import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOfferActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const acceptOffer = async (offerId: string) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Get offer details
      const { data: offer, error: offerError } = await supabase
        .from('coach_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;

      // Update offer status to accepted
      const { error: updateError } = await supabase
        .from('coach_offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (updateError) throw updateError;

      // Update customer's coach_id and plan in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          coach_id: offer.coach_id,
          plan: `${offer.duration_months}-month plan`,
          plan_expiry: new Date(Date.now() + offer.duration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', offer.customer_id);

      if (profileError) throw profileError;

      // Send system message about acceptance
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('coach_id', offer.coach_id)
        .eq('customer_id', offer.customer_id)
        .single();

      if (conversation) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            sender_id: user.id,
            content: `Offer accepted! ${offer.duration_months}-month coaching plan for $${offer.price} is now active.`,
            message_type: 'system'
          });
      }

      return true;
    } catch (err) {
      console.error('Error accepting offer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectOffer = async (offerId: string) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('coach_offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Error rejecting offer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptOffer,
    rejectOffer,
    loading
  };
};