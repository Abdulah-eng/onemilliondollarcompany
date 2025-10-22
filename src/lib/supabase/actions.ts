// src/lib/supabase/actions.ts
import { supabase } from './client';
import { config } from '@/lib/config';

export async function sendMagicLink(email: string) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${config.appUrl}/onboarding/step-1`,
    },
  });
}

export async function signInWithPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function sendPasswordResetLink(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.appUrl}/update-password`,
  });
}

export async function updateUserPassword(password: string) {
  return await supabase.auth.updateUser({ password });
}

// Check if user already exists
export async function checkUserExists(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', email)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // User doesn't exist
      return { exists: false, user: null };
    }
    
    if (error) {
      throw error;
    }
    
    return { exists: true, user: data };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return { exists: false, user: null };
  }
}