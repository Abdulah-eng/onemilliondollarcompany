// src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";

// --- LAYOUTS & ROUTE PROTECTION ---
import CustomerShell from "./components/layout/CustomerShell";
import CoachShell from "./components/layout/CoachShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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

// --- DASHBOARD PLACEHOLDERS ---
const CustomerDashboard = () => <div>Customer Dashboard Content</div>;
const CoachDashboard = () => <div>Coach Dashboard Content</div>;

const queryClient = new QueryClient();

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
            <Route element={<ProtectedRoute />}>
              <Route path="/customer/*" element={<CustomerShell />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                {/* Future customer pages go here */}
              </Route>

              <Route path="/coach/*" element={<CoachShell />}>
                <Route path="dashboard" element={<CoachDashboard />} />
                {/* Future coach pages go here */}
              </Route>

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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
