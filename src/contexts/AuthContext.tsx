
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
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it (self-healing)
        console.log('Profile not found, creating new profile for user:', user.id);
        const { data: newData, error: newError } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id, 
            email: user.email, 
            role: 'customer' 
          })
          .select()
          .single();
        
        if (newError) {
          console.error('Error creating profile:', newError.message);
          return null;
        }
        return newData as Profile;
      }
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      const profileData = await fetchProfile(currentUser);
      setProfile(profileData);
    }
  }, [fetchProfile]);

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      
      // Synchronous state updates to prevent deadlocks
      if (currentUser) {
        // Defer async profile fetch using setTimeout to avoid blocking
        setTimeout(() => {
          fetchProfile(currentUser).then(setProfile);
        }, 0);
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

  const value = { user, profile, loading, signOut, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
