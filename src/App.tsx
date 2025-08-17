
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
import ContactStep from "./pages/onboarding/ContactStep";
import OnboardingSuccess from "./pages/onboarding/OnboardingSuccess";

// --- DASHBOARD & LOADING COMPONENTS ---
const CustomerDashboard = () => <div className="p-8"><h1>Customer Dashboard</h1></div>;
const CoachDashboard = () => <div className="p-8"><h1>Coach Dashboard</h1></div>;
const LoadingScreen = () => <div className="flex h-screen w-full items-center justify-center bg-emerald-50"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>;

const queryClient = new QueryClient();

// --- ROUTING LOGIC ---

const ProtectedRoutes = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirection
  if (profile.role === 'coach') {
    // Coaches are always sent to their dashboard
    return <Navigate to="/coach/dashboard" replace />;
  }

  if (profile.role === 'customer') {
    if (!profile.onboarding_complete) {
      // Customers without completed onboarding are sent to the flow
      return (
        <OnboardingProvider>
          <Outlet />
        </OnboardingProvider>
      );
    }
    // Onboarded customers can access their dashboard
    return <Outlet />;
  }

  // Fallback for any other case
  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/coach/dashboard" element={<CoachDashboard />} />
              
              {/* Onboarding Flow */}
              <Route path="/onboarding/step-1" element={<GoalSelectionStep />} />
              <Route path="/onboarding/step-2" element={<PersonalInfoStep />} />
              <Route path="/onboarding/step-3" element={<PreferencesStep />} />
              <Route path="/onboarding/step-4" element={<ContactStep />} />
              <Route path="/onboarding/success" element={<OnboardingSuccess />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
