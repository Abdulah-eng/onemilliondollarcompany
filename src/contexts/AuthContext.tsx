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
  refreshProfile: () => Promise<void>; // <-- 1. ADDED TO THE TYPE
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfileIfMissing = useCallback(async (user: User) => {
    console.log('🔧 Creating missing profile for user:', user.id);
    const profileData = {
      id: user.id,
      email: user.email,
      role: 'customer' as const,
      onboarding_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('profiles').insert(profileData).select().single();
    if (error) {
      console.error('❌ Error creating profile:', error.message);
      return null;
    }
    console.log('✅ Profile created successfully:', data);
    return data as Profile;
  }, []);

  const fetchProfile = useCallback(async (user: User) => {
    console.log('🔍 Fetching profile for user:', user.id);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('🔧 No profile found, creating one...');
        return await createProfileIfMissing(user);
      }
      console.error('❌ Error fetching profile:', error.message);
      return null;
    }
    console.log('✅ Profile fetched:', data);
    return data as Profile;
  }, [createProfileIfMissing]);

  // --- 2. THE NEW REFRESH FUNCTION ---
  const refreshProfile = useCallback(async () => {
    const currentUser = supabase.auth.getUser(); // Get the most current user session
    if (currentUser) {
      console.log('🔄 Manually refreshing profile...');
      const profileData = await fetchProfile(currentUser);
      setProfile(profileData);
      console.log('🔄 Profile refreshed.');
    }
  }, [fetchProfile]);
  // --- END OF NEW FUNCTION ---

  useEffect(() => {
    console.log('🚀 AuthContext: Setting up auth listener');
    setLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', { event, hasSession: !!session, hasUser: !!session?.user });
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', { hasSession: !!session, hasUser: !!session?.user });
      setUser(session?.user ?? null);
    });

    return () => {
      console.log('🧹 AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log('👤 User detected, fetching/creating profile...');
      setLoading(true);
      fetchProfile(user).then(profileData => {
        console.log('🎯 Setting profile:', profileData);
        setProfile(profileData);
        setLoading(false);
      }).catch(err => {
        console.error('❌ Profile fetch/create failed:', err);
        setLoading(false);
      });
    } else {
      console.log('🚪 No user, clearing profile and stopping load');
      setProfile(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
  };

  const value = { user, profile, loading, signOut, refreshProfile }; // <-- 3. ADDED TO THE VALUE

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
