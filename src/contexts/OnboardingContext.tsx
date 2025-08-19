// src/contexts/OnboardingContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const initialOnboardingState = {
  goals: [],
  personalInfo: { name: '', weight: 0, height: 0, gender: '', dob: '', country: '' },
  preferences: { allergies: [], trainingLikes: [], trainingDislikes: [], injuries: [], meditationExperience: '' },
  contactInfo: { avatarFile: null, avatarPreview: null, phone: '', password: '' },
};

const OnboardingContext = createContext(undefined);

export const OnboardingProvider = ({ children }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [state, setState] = useState(initialOnboardingState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setState(prevState => ({
        ...prevState,
        personalInfo: { ...prevState.personalInfo, name: profile.full_name || '' },
        contactInfo: { ...prevState.contactInfo, avatarPreview: profile.avatar_url || null }
      }));
    }
  }, [profile]);

  const updateState = useCallback((step, data) => {
    setState(prevState => ({ ...prevState, [step]: data }));
  }, []);

  const clearState = useCallback(() => setState(initialOnboardingState), []);

  const completeOnboarding = async () => {
    if (!user) return toast.error("Authentication error.");
    setLoading(true);

    try {
      let avatar_url = profile?.avatar_url;
      if (state.contactInfo.avatarFile) {
        const file = state.contactInfo.avatarFile;
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        avatar_url = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
      }

      if (state.contactInfo.password) {
        await supabase.auth.updateUser({ password: state.contactInfo.password });
      }

      const profileUpdate = {
        full_name: state.personalInfo.name,
        avatar_url,
        phone: state.contactInfo.phone,
        onboarding_complete: true,
      };
      await supabase.from('profiles').update(profileUpdate).eq('id', user.id);

      const detailsUpdate = {
        user_id: user.id,
        weight: state.personalInfo.weight,
        height: state.personalInfo.height,
        gender: state.personalInfo.gender,
        dob: state.personalInfo.dob || null,
        country: state.personalInfo.country,
        goals: state.goals,
        allergies: state.preferences.allergies,
        training_likes: state.preferences.trainingLikes,
        training_dislikes: state.preferences.trainingDislikes,
        injuries: state.preferences.injuries,
        meditation_experience: state.preferences.meditationExperience,
      };
      await supabase.from('onboarding_details').upsert(detailsUpdate, { onConflict: 'user_id' });

      await refreshProfile(); // THIS IS THE KEY: REFRESH THE STATE
      toast.success("Welcome! Your profile is complete.");
    } catch (error) {
      toast.error(error.message || "Could not complete setup.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { state, loading, updateState, completeOnboarding, clearState };
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
