import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";

// --- LAYOUTS ---
import AppShell from "@/components/layouts/AppShell";
import RoleGate from "@/components/routing/RoleGate";

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
import CustomerDashboardPage from "./pages/customer/CustomerDashboard";
import CoachDashboardPage from "./pages/coach/CoachDashboard";
import MyProgramsPage from "./pages/customer/MyProgramsPage";
import ViewProgramPage from "./pages/customer/ViewProgramPage";
import LibraryPage from "./pages/customer/LibraryPage";
// ✅ IMPORT THE NEW PROGRESS PAGE
import ProgressPage from "./pages/customer/ProgressPage";


// ... (LoadingScreen, queryClient, and routing logic components remain unchanged) ...

const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
  </div>
);

const queryClient = new QueryClient();

const PublicRoutesLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (profile) {
    if (profile.role === "coach") return <Navigate to="/coach/dashboard" replace />;
    if (profile.onboarding_complete) return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/onboarding/step-1" replace />;
  }
  return <Outlet />;
};

const ProtectedRoutesLayout = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const OnboardingGate = () => {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== "customer") return <Navigate to="/login" replace />;
  if (profile.onboarding_complete) return <Navigate to="/customer/dashboard" replace />;
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
};


// Themed App wrapper that forces light theme on specific pages
const ThemedApp = () => {
  const location = useLocation();
  
  // Pages that should always use light theme
  const lightThemePages = ['/', '/login', '/get-started', '/forgot-password'];
  const shouldForceLightTheme = lightThemePages.includes(location.pathname);
  
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      forcedTheme={shouldForceLightTheme ? "light" : undefined}
    >
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* 1. Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Authentication Routes */}
          <Route element={<PublicRoutesLayout />}>
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* 3. Protected Routes */}
          <Route element={<ProtectedRoutesLayout />}>
            {/* Coach Routes */}
            <Route
              element={
                <RoleGate allowedRole="coach">
                  <AppShell />
                </RoleGate>
              }
            >
              <Route path="/coach/dashboard" element={<CoachDashboardPage />} />
            </Route>

            {/* Customer Routes */}
            <Route
              element={
                <RoleGate allowedRole="customer">
                  <AppShell />
                </RoleGate>
              }
            >
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/programs" element={<MyProgramsPage />} />
              <Route path="/customer/library" element={<LibraryPage />} />
              {/* ✅ ADDED THE NEW PROGRESS ROUTE */}
              <Route path="/customer/progress" element={<ProgressPage />} />
              <Route path="/program/:type/:id" element={<ViewProgramPage />} />
              <Route path="/program/:id" element={<ViewProgramPage />} />
            </Route>

            {/* Onboarding Routes */}
            <Route path="/onboarding" element={<OnboardingGate />}>
              <Route path="step-1" element={<GoalSelectionStep />} />
              <Route path="step-2" element={<PersonalInfoStep />} />
              <Route path="step-3" element={<PreferencesStep />} />
              <Route path="step-4" element={<ContactStep />} />
              <Route path="success" element={<OnboardingSuccess />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
