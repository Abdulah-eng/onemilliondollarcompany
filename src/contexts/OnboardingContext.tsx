// src/contexts/OnboardingContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Define the shape of our onboarding data
const initialOnboardingState = {
  goals: [],
  personalInfo: { name: '', height: 0, weight: 0, age: 0, gender: '' },
  preferences: { allergies: [], trainingLikes: '', trainingDislikes: '', meditationExperience: '' },
  contactInfo: { avatarFile: null, avatarPreview: null },
};

// Create the context
const OnboardingContext = createContext(undefined);

// Create the provider component
export const OnboardingProvider = ({ children }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [state, setState] = useState(initialOnboardingState);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Effect to pre-fill state with existing profile data
  useEffect(() => {
    setInitializing(true);
    if (profile) {
      setState(prevState => ({
        ...prevState,
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
    setInitializing(false);
  }, [profile]);

  // State update functions
  const updateGoals = useCallback((goals) => setState(s => ({ ...s, goals })), []);
  const updatePersonalInfo = useCallback((info) => setState(s => ({ ...s, personalInfo: info })), []);
  const updatePreferences = useCallback((prefs) => setState(s => ({ ...s, preferences: prefs })), []);
  const updateContactInfo = useCallback((info) => setState(s => ({ ...s, contactInfo: info })), []);
  const clearState = useCallback(() => setState(initialOnboardingState), []);

  // Placeholder for saving partial progress (can be expanded later)
  const saveStep = async (step) => {
    console.log(`Step ${step} data:`, state);
    // In a real app, you might save this partial data to Supabase here
  };

  // The final function to complete the onboarding process
  const completeOnboarding = async () => {
    if (!user) return toast.error("You must be logged in.");
    setLoading(true);

    try {
      let avatar_url = profile?.avatar_url;
      const { avatarFile } = state.contactInfo;

      // 1. Upload avatar if a new one exists
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = urlData.publicUrl;
      }

      // 2. Prepare all data for the 'profiles' table update
      const finalProfileData = {
        id: user.id,
        full_name: state.personalInfo.name,
        height: state.personalInfo.height,
        weight: state.personalInfo.weight,
        age: state.personalInfo.age,
        gender: state.personalInfo.gender,
        avatar_url,
        onboarding_complete: true, // Mark onboarding as done!
        updated_at: new Date().toISOString(),
      };
      
      // 3. Prepare detailed data for a new 'onboarding_details' table
      const onboardingDetails = {
          user_id: user.id,
          goals: state.goals,
          allergies: state.preferences.allergies,
          training_likes: state.preferences.trainingLikes,
          training_dislikes: state.preferences.trainingDislikes,
          meditation_experience: state.preferences.meditationExperience,
      };

      // 4. Execute database updates
      const { error: profileError } = await supabase.from('profiles').upsert(finalProfileData);
      if (profileError) throw profileError;

      const { error: detailsError } = await supabase.from('onboarding_details').upsert(onboardingDetails);
      if (detailsError) throw detailsError;
      
      toast.success("Welcome! Your profile is complete.");

    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast.error("Could not complete setup. Please try again.");
      throw error; // Re-throw to be caught by the calling component
    } finally {
      setLoading(false);
    }
  };

  const value = {
    state,
    user,
    loading: loading || authLoading,
    initializing,
    updateGoals,
    updatePersonalInfo,
    updatePreferences,
    updateContactInfo,
    saveStep,
    completeOnboarding,
    clearState,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

// Custom hook to use the context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
