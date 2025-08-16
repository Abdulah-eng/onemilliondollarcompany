// src/lib/supabase/actions.ts
import { supabase } from './client';

export async function sendMagicLink(email: string) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/onboarding/step-1`,
    },
  });
}

export async function signInWithPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function sendPasswordResetLink(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
}

export async function updateUserPassword(password: string) {
  return await supabase.auth.updateUser({ password });
}