// src/components/auth/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
    <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
    </div>
);

const ProtectedRoute = () => {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        if (!profile) {
            navigate('/login', { replace: true });
            return;
        }

        const isCoach = profile.role === 'coach';
        const isCustomer = profile.role === 'customer';
        const isOnboardingComplete = profile.onboarding_complete;
        const currentPath = location.pathname;

        // Redirect coaches away from customer/onboarding routes
        if (isCoach && (currentPath.startsWith('/customer') || currentPath.startsWith('/onboarding'))) {
            navigate('/coach/dashboard', { replace: true });
            return;
        }

        // Redirect customers away from coach routes
        if (isCustomer && currentPath.startsWith('/coach')) {
            navigate('/customer/dashboard', { replace: true });
            return;
        }

        // Redirect onboarded customers away from onboarding
        if (isCustomer && isOnboardingComplete && currentPath.startsWith('/onboarding')) {
            navigate('/customer/dashboard', { replace: true });
            return;
        }

        // Force new customers to onboard
        if (isCustomer && !isOnboardingComplete && !currentPath.startsWith('/onboarding')) {
            navigate('/onboarding/step-1', { replace: true });
        }
    }, [profile, loading, navigate, location]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!profile) {
        return null; // Render nothing while redirecting
    }

    return <Outlet />; // Render the appropriate nested route (e.g., a Shell)
};

export default ProtectedRoute;
