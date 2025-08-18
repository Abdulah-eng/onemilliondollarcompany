
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

  // Self-healing: create profile if missing
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

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating profile:', error.message);
      return null;
    }
    
    console.log('✅ Profile created successfully:', data);
    return data as Profile;
  }, []);

  // Fetch profile with self-healing capability
  const fetchProfile = useCallback(async (user: User) => {
    console.log('🔍 Fetching profile for user:', user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found - create one (self-healing)
        console.log('🔧 No profile found, creating one...');
        return await createProfileIfMissing(user);
      }
      console.error('❌ Error fetching profile:', error.message);
      return null;
    }
    
    console.log('✅ Profile fetched:', data);
    return data as Profile;
  }, [createProfileIfMissing]);

  useEffect(() => {
    console.log('🚀 AuthContext: Setting up auth listener');
    setLoading(true);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', { event, hasSession: !!session, hasUser: !!session?.user });
      
      // Synchronously update user state
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false); // No user = done loading
      }
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', { hasSession: !!session, hasUser: !!session?.user });
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Separate effect for profile fetching with self-healing
  useEffect(() => {
    if (user && !profile) {
      console.log('👤 User detected, fetching/creating profile...');
      fetchProfile(user).then(profileData => {
        console.log('🎯 Setting profile:', profileData);
        setProfile(profileData);
        setLoading(false); // Profile loaded = done loading
      }).catch(err => {
        console.error('❌ Profile fetch/create failed:', err);
        setLoading(false); // Even on error, stop loading
      });
    } else if (!user) {
      console.log('🚪 No user, clearing profile');
      setProfile(null);
    }
  }, [user, profile, fetchProfile]);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
    // onAuthStateChange will handle clearing the state
  };

  const value = { user, profile, loading, signOut };

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
