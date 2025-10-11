import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MotivationMessage {
  id: string;
  title: string;
  content: string;
  emoji: string;
  type: 'positive' | 'warning';
  created_at: string;
}

export const useRealTimeMotivation = () => {
  const { user } = useAuth();
  const [motivationMessage, setMotivationMessage] = useState<MotivationMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivationMessage = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get a random motivation message from the database
        const { data, error } = await supabase
          .from('motivation_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error || !data || data.length === 0) {
          console.error('Error fetching motivation message or no messages found:', error);
          // Fallback to default message
          setMotivationMessage({
            id: 'default',
            title: 'Daily Motivation',
            content: 'Every step you take towards your goals is progress. Keep pushing forward!',
            emoji: '💪',
            type: 'positive',
            created_at: new Date().toISOString()
          });
        } else {
          // Select a random message from the results
          const randomIndex = Math.floor(Math.random() * data.length);
          setMotivationMessage(data[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching motivation message:', error);
        // Fallback to default message
        setMotivationMessage({
          id: 'default',
          title: 'Daily Motivation',
          content: 'Every step you take towards your goals is progress. Keep pushing forward!',
          emoji: '💪',
          type: 'positive',
          created_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMotivationMessage();
  }, [user]);

  return { motivationMessage, loading };
};
