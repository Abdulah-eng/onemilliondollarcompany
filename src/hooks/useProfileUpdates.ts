import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface UpdateOnboardingPayload {
  goals?: string[];
  location?: string | null;
}

export const useProfileUpdates = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: payload.full_name,
          phone: payload.phone,
          avatar_url: payload.avatar_url,
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update profile';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = async (payload: UpdateOnboardingPayload) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('onboarding_details')
        .upsert({
          user_id: user.id,
          goals: payload.goals,
          location: payload.location,
        }, { onConflict: 'user_id' })
        .select('*')
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update onboarding';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, updateOnboarding, loading, error };
};


