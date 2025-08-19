// src/App.tsx

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

// --- LOADING COMPONENTS ---
const LoadingScreen = () => <div className="flex h-screen w-full items-center justify-center bg-emerald-50"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>;

const queryClient = new QueryClient();

// --- ROUTING LOGIC ---

// This layout handles pages that should ONLY be seen by logged-out users.
const AuthRedirectLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (profile) {
    // User is logged in, redirect them away from auth pages.
    if (profile.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
    if (profile.onboarding_complete) return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/onboarding/step-1" replace />;
  }
  return <Outlet />; // User is not logged in, show the login/signup page.
};

// This layout protects all routes for logged-in users.
const ProtectedLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  
  // The user is logged in, so render the nested protected routes.
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
            {/* 1. Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFound />} />

            {/* 2. Authentication Routes (for logged-out users) */}
            <Route element={<AuthRedirectLayout />}>
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* 3. Protected Routes (for logged-in users) */}
            <Route element={<ProtectedLayout />}>
              <Route path="/customer/*" element={<CustomerShell />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
              </Route>
              <Route path="/coach/*" element={<CoachShell />}>
                <Route path="dashboard" element={<CoachDashboard />} />
              </Route>
              
              {/* Onboarding Flow is now correctly wrapped */}
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
              }/>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
