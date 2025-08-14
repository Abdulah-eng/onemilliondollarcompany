import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export const useRedirectIfAuthenticated = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until loading is false and we have user data
    if (!loading && user && profile) {
      if (profile.role === 'coach') {
        navigate('/coach/dashboard', { replace: true });
      } else if (profile.onboarding_complete) {
        navigate('/customer/dashboard', { replace: true });
      } else {
        navigate('/onboarding/step-1', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  // Return loading state so the page can show a spinner while we check
  return { loading };
};
