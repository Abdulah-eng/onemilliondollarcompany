
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

// Define the Profile type clearly
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Use useCallback to memoize the fetch function
  const fetchProfile = useCallback(async (user: User) => {
    console.log('🔍 Fetching profile for user:', user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ Error fetching profile:', error.message);
      return null;
    }
    console.log('✅ Profile fetched:', data);
    return data as Profile;
  }, []);

  useEffect(() => {
    console.log('🚀 AuthContext: Setting up auth listener');
    setLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', { event, hasSession: !!session, hasUser: !!session?.user });
      
      // Synchronously update user and session state
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      // Always set loading to false after auth state change
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', { hasSession: !!session, hasUser: !!session?.user });
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Separate effect for profile fetching
  useEffect(() => {
    if (user && !profile) {
      console.log('👤 User detected, fetching profile...');
      fetchProfile(user).then(profileData => {
        console.log('🎯 Setting profile:', profileData);
        setProfile(profileData);
      });
    } else if (!user) {
      console.log('🚪 No user, clearing profile');
      setProfile(null);
    }
  }, [user, profile, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // No need to set state here, onAuthStateChange will handle it.
  };

  const value = { user, profile, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook remains the same, but is now much more reliable.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
