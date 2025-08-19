// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  role: 'customer' | 'coach';
  onboarding_complete: boolean;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>; // <-- ADD THIS
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfileIfMissing = useCallback(async (user: User) => {
    const { data, error } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      role: 'customer',
      onboarding_complete: false,
    }).select().single();
    if (error) console.error('Error creating profile:', error.message);
    return data as Profile;
  }, []);

  const fetchProfile = useCallback(async (user: User) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error && error.code === 'PGRST116') {
      return await createProfileIfMissing(user);
    }
    if (error) console.error('Error fetching profile:', error.message);
    return data as Profile;
  }, [createProfileIfMissing]);

  // --- THIS IS THE NEW FUNCTION TO ADD ---
  const refreshProfile = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      const profileData = await fetchProfile(currentUser);
      setProfile(profileData);
    }
  }, [fetchProfile]);
  // --- END OF NEW FUNCTION ---

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const profileData = await fetchProfile(currentUser);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = { user, profile, loading, signOut, refreshProfile }; // <-- ADD refreshProfile HERE

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
