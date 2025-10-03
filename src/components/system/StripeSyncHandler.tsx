import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { syncCheckoutSession } from '@/lib/stripe/api';

// Runs globally on every page load; if URL contains Stripe success params, syncs and then cleans URL
const StripeSyncHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || !import.meta.env.VITE_API_BASE_URL) {
      // eslint-disable-next-line no-console
      console.warn('[Stripe] Missing envs: VITE_STRIPE_PUBLISHABLE_KEY or VITE_API_BASE_URL');
    }
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');
    if (status === 'success' && sessionId) {
      console.log('[Frontend] Global StripeSyncHandler: syncing session', sessionId);
      syncCheckoutSession(sessionId)
        .then((data) => {
          console.log('[Frontend] Global StripeSyncHandler: sync response', data);
          if (data && (data as any).ok) {
            alert('Subscription activated successfully. Plan info updated.');
          } else {
            alert(`Subscription sync failed: ${(data as any)?.error || 'Unknown error'}`);
          }
        })
        .catch((err) => {
          console.error('[Frontend] Global StripeSyncHandler: sync error', err);
          alert('Subscription sync failed due to a network error.');
        })
        .finally(() => {
          // Clean URL: remove status and session_id but keep the current path
          const cleanUrl = location.pathname;
          navigate(cleanUrl, { replace: true });
        });
    }
  }, [location.search, location.pathname, navigate]);

  return null;
};

export default StripeSyncHandler;


