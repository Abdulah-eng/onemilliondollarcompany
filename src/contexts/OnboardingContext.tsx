// src/contexts/OnboardingContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Define the shape of our onboarding data
const initialOnboardingState = {
  goals: [],
  // FIX: Added 'name' to the initial state to match the form
  personalInfo: { name: '', weight: 0, height: 0, gender: '', dob: '', country: '' },
  preferences: { allergies: [], trainingLikes: [], trainingDislikes: [], injuries: [], meditationExperience: '' },
  contactInfo: { avatarFile: null, avatarPreview: null, phone: '', password: '' },
};

const OnboardingContext = createContext(undefined);

export const OnboardingProvider = ({ children }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [state, setState] = useState(initialOnboardingState);
  const [loading, setLoading] = useState(false);

  // Pre-fill state with existing profile data
  useEffect(() => {
    if (profile) {
      setState(prevState => ({
        ...prevState,
        // Pre-fill the name from the profile
        personalInfo: {
          ...prevState.personalInfo,
          name: profile.full_name || '',
        },
        contactInfo: {
          ...prevState.contactInfo,
          avatarPreview: profile.avatar_url || null,
        }
      }));
    }
  }, [profile]);

  // State update functions
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
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = urlData.publicUrl;
      }

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      // --- FIX: Added full_name to the profile update payload ---
      const profileUpdate = {
        id: user.id,
        full_name: state.personalInfo.name, // <-- THIS WAS MISSING
        onboarding_complete: true,
        avatar_url,
        phone: state.contactInfo.phone,
        updated_at: new Date().toISOString(),
      };

      const detailsUpdate = {
        user_id: user.id,
        weight: state.personalInfo.weight,
        height: state.personalInfo.height,
        gender: state.personalInfo.gender,
        // --- FIX: Send null instead of an empty string for the date ---
        dob: state.personalInfo.dob || null, // <-- THIS FIXES THE DATE ERROR
        country: state.personalInfo.country,
        goals: state.goals,
        allergies: state.preferences.allergies,
        training_likes: state.preferences.trainingLikes,
        training_dislikes: state.preferences.trainingDislikes,
        injuries: state.preferences.injuries,
        meditation_experience: state.preferences.meditationExperience,
      };

      const { error: profileError } = await supabase.from('profiles').upsert(profileUpdate);
      if (profileError) throw profileError;

      const { error: detailsError } = await supabase.from('onboarding_details').upsert(detailsUpdate);
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
