import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Handles Supabase magic link/hash params by setting the session and redirecting
const AuthLinkHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash || '';
    if (!hash.startsWith('#')) return;

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    // If Supabase returned tokens in the URL hash, set session and clean URL
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .finally(() => {
          // Clean URL (remove the hash)
          navigate(location.pathname + location.search, { replace: true });
          // Send user to a safe default; route guards will redirect appropriately once profile loads
          navigate('/customer/dashboard', { replace: true });
        });
      return;
    }

    // If recovery flow, redirect to update password page
    if (type === 'recovery') {
      navigate('/update-password', { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

export default AuthLinkHandler;


