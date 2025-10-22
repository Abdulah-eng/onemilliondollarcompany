// src/lib/config.ts
// Configuration management for deployment

const getAppUrl = () => {
  // In production, use environment variable
  if (import.meta.env.VITE_APP_URL) {
    return import.meta.env.VITE_APP_URL;
  }
  
  // In development, use current origin
  if (import.meta.env.DEV) {
    return window.location.origin;
  }
  
  // Fallback for production if VITE_APP_URL is not set
  return window.location.origin;
};

export const config = {
  appUrl: getAppUrl(),
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'your-anon-key',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
} as const;
