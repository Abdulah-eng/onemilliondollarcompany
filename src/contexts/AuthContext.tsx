
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
  plan?: string | null;
  plan_expiry?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  coach_id?: string | null;
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

        // Ensure customer record exists
        try {
          await supabase
            .from('customers')
            .upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id' });
        } catch (e) {
          console.warn('Non-fatal: failed to upsert into customers for new profile', e);
        }
        return newData as Profile;
      }
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      const prof = data as Profile;
      // Keep customers table in sync for customer role
      if (prof.role === 'customer') {
        try {
          await supabase
            .from('customers')
            .upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id' });
        } catch (e) {
          console.warn('Non-fatal: failed to upsert into customers', e);
        }
      }
      return prof;
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
    // Set up auth state listener FIRST
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

    // THEN check for existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      
      if (currentUser) {
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
    try {
      // Clear payment modal session storage on logout
      sessionStorage.removeItem('paymentModalDismissed');
      sessionStorage.removeItem('paymentModalShown');
      
      // Force local session clear regardless of server response
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear local state immediately
      setUser(null);
      setProfile(null);
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error during signOut:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setProfile(null);
    }
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
