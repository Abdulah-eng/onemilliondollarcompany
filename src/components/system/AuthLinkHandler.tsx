import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Handles Supabase magic link/hash params by setting the session and redirecting
const AuthLinkHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = location.hash || '';
      if (!hash.startsWith('#')) return;

      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      // If Supabase returned tokens in the URL hash, set session and clean URL
      if (access_token && refresh_token) {
        try {
          const { data, error } = await supabase.auth.setSession({ 
            access_token, 
            refresh_token 
          });
          
          if (error) {
            console.error('Error setting session:', error);
            navigate('/login?error=auth_failed', { replace: true });
            return;
          }

          // Clean URL (remove the hash)
          navigate(location.pathname + location.search, { replace: true });
          
          // Wait a moment for the auth state to update, then redirect appropriately
          setTimeout(() => {
            if (type === 'recovery') {
              console.log('AuthLinkHandler: Redirecting to password recovery');
              navigate('/update-password', { replace: true });
            } else {
              // Check if we're already on an onboarding page (from emailRedirectTo)
              if (location.pathname.startsWith('/onboarding')) {
                console.log('AuthLinkHandler: Already on onboarding page, staying put');
                // Stay on the current onboarding page, let the route guards handle it
                return;
              } else {
                console.log('AuthLinkHandler: Redirecting to onboarding');
                // For other cases, redirect to onboarding first
                // The route guards will handle further redirection based on user state
                navigate('/onboarding/step-1', { replace: true });
              }
            }
          }, 100);
        } catch (error) {
          console.error('Error in auth callback:', error);
          navigate('/login?error=auth_failed', { replace: true });
        }
        return;
      }

      // If recovery flow, redirect to update password page
      if (type === 'recovery') {
        navigate('/update-password', { replace: true });
      }
    };

    handleAuthCallback();
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

export default AuthLinkHandler;


