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
  const { user, profile } = useAuth();
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
      const { avatarFile, password } = state.contactInfo;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Use upsert: true to allow overwriting an existing avatar
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = urlData.publicUrl;
      }

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      // --- FIX 1: Use a specific .update() call for the profiles table ---
      const profileUpdate = {
        full_name: state.personalInfo.name,
        avatar_url,
        phone: state.contactInfo.phone,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // --- FIX 2: Use a specific .upsert() for the details table ---
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
        updated_at: new Date().toISOString(),
      };
      
      const { error: detailsError } = await supabase
        .from('onboarding_details')
        .upsert(detailsUpdate, { onConflict: 'user_id' });

      if (detailsError) throw detailsError;

      toast.success("Welcome! Your profile is complete.");

    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast.error(error.message || "Could not complete setup. Please try again.");
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
