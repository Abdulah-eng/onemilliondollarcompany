// src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { Loader2 } from "lucide-react";

// --- LAYOUTS ---
import CustomerShell from "@/components/layout/CustomerShell";
import CoachShell from "@/components/layout/CoachShell";

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

// --- DASHBOARD & LOADING COMPONENTS ---
const CustomerDashboard = () => <div>Customer Dashboard Content</div>;
const CoachDashboard = () => <div>Coach Dashboard Content</div>;
const LoadingScreen = () => <div className="flex h-screen w-full items-center justify-center bg-emerald-50"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>;

const queryClient = new QueryClient();

// --- NEW, SIMPLIFIED ROUTING LOGIC ---

// Layout for Authentication pages (/login, /get-started)
// If the user is already logged in, it redirects them to their correct dashboard.
const AuthRedirectLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Outlet />; // User is not logged in, so show the login/signup page.

  // User is logged in, redirect them.
  if (profile.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

// Layout for all protected parts of the app.
// It handles all role and onboarding checks.
const ProtectedLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  if (profile.role === 'coach') {
    return <CoachShell />; // Coaches see the coach layout
  }

  if (profile.role === 'customer') {
    if (profile.onboarding_complete) {
      return <CustomerShell />; // Onboarded customers see the customer layout
    } else {
      // Customers who need to onboard are shown the onboarding flow.
      // The OnboardingProvider wraps the <Outlet /> to manage state.
      return (
        <OnboardingProvider>
          <Outlet />
        </OnboardingProvider>
      );
    }
  }

  // Fallback if role is not recognized
  return <Navigate to="/login" replace />;
};


// --- MAIN APP COMPONENT ---

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            {/* 1. Public Routes (e.g., Landing Page) */}
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
              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              
              {/* Coach Routes */}
              <Route path="/coach/dashboard" element={<CoachDashboard />} />

              {/* Onboarding Flow */}
              <Route path="/onboarding/step-1" element={<GoalSelectionStep />} />
              <Route path="/onboarding/step-2" element={<PersonalInfoStep />} />
              <Route path="/onboarding/step-3" element={<PreferencesStep />} />
              <Route path="/onboarding/step-4" element={<ContactStep />} />
              <Route path="/onboarding/success" element={<OnboardingSuccess />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
