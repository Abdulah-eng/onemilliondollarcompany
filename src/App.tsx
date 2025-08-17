// src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { Loader2 } from "lucide-react";

// --- PAGES ---
import LandingPage from "./pages/public/LandingPage";
import GetStartedPage from "./pages/auth/GetStartedPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import GoalSelectionStep from "./pages/onboarding/GoalSelectionStep";
import PersonalInfoStep from "./pages/onboarding/PersonalInfoStep";
import PreferencesStep from "./pages/onboarding/PreferencesStep";
import PhotoContactStep from "./pages/onboarding/PhotoContactStep";
import OnboardingSuccess from "./pages/onboarding/OnboardingSuccess";

// --- DASHBOARD & LOADING COMPONENTS ---
const CustomerDashboard = () => <div className="p-8"><h1>Welcome to your Dashboard!</h1><p>You have successfully logged in and completed onboarding.</p></div>;
const LoadingScreen = () => <div className="flex h-screen w-full items-center justify-center bg-emerald-50"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>;

const queryClient = new QueryClient();

// --- ROUTING LOGIC ---

// This component layout protects routes that require authentication.
// It also directs users to onboarding if they haven't completed it.
const ProtectedLayout = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (!profile.onboarding_complete) {
    // If onboarding is not complete, the user is directed to the onboarding flow.
    // The <Outlet /> here will render the specific onboarding step based on the URL.
    return (
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    );
  }

  // If onboarding IS complete, render the main app content (e.g., dashboard).
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
            {/* Public Routes: Accessible to everyone */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes: Require login and onboarding status check */}
            <Route element={<ProtectedLayout />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/onboarding/step-1" element={<GoalSelectionStep />} />
              <Route path="/onboarding/step-2" element={<PersonalInfoStep />} />
              <Route path="/onboarding/step-3" element={<PreferencesStep />} />
              <Route path="/onboarding/step-4" element={<PhotoContactStep />} />
              <Route path="/onboarding/success" element={<OnboardingSuccess />} />
            </Route>
            
            {/* Not Found Route: Catches any other URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
