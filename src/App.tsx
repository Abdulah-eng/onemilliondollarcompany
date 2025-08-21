import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { Loader2 } from "lucide-react";

// --- LAYOUTS ---
import CustomerShell from "@/components/layouts/CustomerShell";
import CoachShell from "@/components/layouts/CoachShell";

// --- PAGES ---
import LandingPage from "./pages/public/LandingPage";
import GetStartedPage from "./pages/auth/GetStartedPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import GoalSelectionStep from "./pages/onboarding/GoalSelectionStep";
import PersonalInfoStep from "./pages/onboarding/PersonalInfoStep";
import PreferencesStep from "./pages/onboarding/PreferencesStep";
import ContactStep from "./pages/onboarding/ContactStep";
import OnboardingSuccess from "./pages/onboarding/OnboardingSuccess";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CoachDashboard from "./pages/coach/CoachDashboard";

const queryClient = new QueryClient();

// --- LOADING COMPONENT ---
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
  </div>
);

// --- LAYOUT COMPONENTS ---

// Public routes - only accessible to logged-out users
const PublicRoutesLayout = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  // If user is logged in, redirect to appropriate dashboard
  if (profile) {
    if (profile.role === 'coach') {
      return <Navigate to="/coach/dashboard" replace />;
    }
    if (profile.onboarding_complete) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    return <Navigate to="/onboarding/step-1" replace />;
  }
  
  // User is not logged in, show public pages
  return <Outlet />;
};

// Protected routes - only accessible to logged-in users
const ProtectedRoutesLayout = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

// Coach-only gate
const CoachGate = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== 'coach') return <Navigate to="/customer/dashboard" replace />;
  
  return <Outlet />;
};

// Customer-only gate
const CustomerGate = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
  if (!profile.onboarding_complete) return <Navigate to="/onboarding/step-1" replace />;
  
  return <Outlet />;
};

// Onboarding gate - only for incomplete customers
const OnboardingGate = () => {
  const { profile, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
  if (profile.onboarding_complete) return <Navigate to="/customer/dashboard" replace />;
  
  return <Outlet />;
};

// --- MAIN APP COMPONENT ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutesLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutesLayout />}>
              {/* Coach Routes */}
              <Route element={<CoachGate />}>
                <Route path="/coach/*" element={<CoachShell />}>
                  <Route path="dashboard" element={<CoachDashboard />} />
                </Route>
              </Route>

              {/* Customer Routes */}
              <Route element={<CustomerGate />}>
                <Route path="/customer/*" element={<CustomerShell />}>
                  <Route path="dashboard" element={<CustomerDashboard />} />
                </Route>
              </Route>

              {/* Onboarding Routes */}
              <Route element={<OnboardingGate />}>
                <Route path="/onboarding/*" element={
                  <OnboardingProvider>
                    <Routes>
                      <Route path="step-1" element={<GoalSelectionStep />} />
                      <Route path="step-2" element={<PersonalInfoStep />} />
                      <Route path="step-3" element={<PreferencesStep />} />
                      <Route path="step-4" element={<ContactStep />} />
                      <Route path="success" element={<OnboardingSuccess />} />
                    </Routes>
                  </OnboardingProvider>
                } />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;