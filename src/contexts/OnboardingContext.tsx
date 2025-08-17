
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Define the shape of the data we'll collect
const initialOnboardingState = {
  goals: [],
  personalInfo: { weight: 0, height: 0, gender: '', dob: '', country: '' },
  preferences: { allergies: [], trainingLikes: [], trainingDislikes: [], injuries: [], meditationExperience: '' },
  contactInfo: { avatarFile: null, avatarPreview: null, phone: '', password: '' },
};

interface OnboardingContextType {
  state: typeof initialOnboardingState;
  loading: boolean;
  updateState: (step: string, data: any) => void;
  completeOnboarding: () => Promise<void>;
  clearState: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [state, setState] = useState(initialOnboardingState);
  const [loading, setLoading] = useState(false);

  // Pre-fill state with existing profile data
  useEffect(() => {
    if (profile) {
      setState(prevState => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          avatarPreview: profile.avatar_url || null,
          phone: profile.phone || '',
        }
      }));
    }
  }, [profile]);

  // State update functions
  const updateState = useCallback((step: string, data: any) => {
    setState(prevState => ({ ...prevState, [step]: data }));
  }, []);

  const clearState = useCallback(() => setState(initialOnboardingState), []);

  const completeOnboarding = async () => {
    if (!user) return toast.error("Authentication error.");
    setLoading(true);

    try {
      let avatar_url = profile?.avatar_url;
      const { avatarFile, password, phone } = state.contactInfo;

      // 1. Upload avatar if a new one exists
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = urlData.publicUrl;
      }

      // 2. Update user's password if they provided a new one
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      // 3. Prepare data for the 'profiles' table
      const profileUpdate = {
        id: user.id,
        onboarding_complete: true,
        avatar_url,
        phone,
        updated_at: new Date().toISOString(),
      };

      // 4. Prepare data for the 'onboarding_details' table
      const detailsUpdate = {
        user_id: user.id,
        weight: state.personalInfo.weight,
        height: state.personalInfo.height,
        gender: state.personalInfo.gender,
        dob: state.personalInfo.dob,
        country: state.personalInfo.country,
        goals: state.goals,
        allergies: state.preferences.allergies,
        training_likes: state.preferences.trainingLikes,
        training_dislikes: state.preferences.trainingDislikes,
        injuries: state.preferences.injuries,
        meditation_experience: state.preferences.meditationExperience,
      };

      // 5. Execute database transactions
      const { error: profileError } = await supabase.from('profiles').upsert(profileUpdate);
      if (profileError) throw profileError;

      const { error: detailsError } = await supabase.from('onboarding_details').upsert(detailsUpdate);
      if (detailsError) throw detailsError;

      toast.success("Welcome! Your profile is complete.");

    } catch (error) {
      console.error("Onboarding completion error:", error);
      toast.error((error as Error).message || "Could not complete setup. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    state,
    loading,
    updateState,
    completeOnboarding,
    clearState,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
