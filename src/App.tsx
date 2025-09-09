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

// --- PAGES (Eager and Lazy Loaded) ---
import LandingPage from "./pages/public/LandingPage";
// Eager load critical dashboards
import CustomerDashboardPage from "./pages/customer/CustomerDashboard";
import CoachDashboardPage from "./pages/coach/CoachDashboard";

import { lazy, Suspense } from "react";
import { lazyWithRetry } from "./utils/lazyWithRetry";

const GetStartedPage = lazyWithRetry(() => import("./pages/auth/GetStartedPage"));
const LoginPage = lazyWithRetry(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = lazyWithRetry(() => import("./pages/auth/ForgotPasswordPage"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const GoalSelectionStep = lazyWithRetry(() => import("./pages/onboarding/GoalSelectionStep"));
const PersonalInfoStep = lazyWithRetry(() => import("./pages/onboarding/PersonalInfoStep"));
const PreferencesStep = lazyWithRetry(() => import("./pages/onboarding/PreferencesStep"));
const ContactStep = lazyWithRetry(() => import("./pages/onboarding/ContactStep"));
const OnboardingSuccess = lazyWithRetry(() => import("./pages/onboarding/OnboardingSuccess"));
const MyProgramsPage = lazyWithRetry(() => import("./pages/customer/MyProgramsPage"));
const ViewProgramPage = lazyWithRetry(() => import("./pages/customer/ViewProgramPage"));
const LibraryPage = lazyWithRetry(() => import("./pages/customer/LibraryPage"));
const ProgressPage = lazyWithRetry(() => import("./pages/customer/ProgressPage"));
const MyCoachPage = lazyWithRetry(() => import("./pages/customer/MyCoach"));
const BlogPage = lazyWithRetry(() => import("./pages/customer/BlogPage"));
const ProfilePage = lazyWithRetry(() => import("./pages/customer/Profile"));


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
      <Toaster richColors position="top-right" />
      <Routes>
        {/* 1. Landing Page (Outside AuthProvider for performance) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. All other routes inside AuthProvider */}
        <Route path="*" element={
          <AuthProvider>
            <Routes>
              {/* Authentication Routes */}
              <Route element={<PublicRoutesLayout />}>
                <Route path="/get-started" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <GetStartedPage />
                  </Suspense>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <LoginPage />
                  </Suspense>
                } />
                <Route path="/forgot-password" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ForgotPasswordPage />
                  </Suspense>
                } />
              </Route>

              {/* Protected Routes */}
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
                  <Route path="/customer/programs" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <MyProgramsPage />
                    </Suspense>
                  } />
                  <Route path="/customer/library" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <LibraryPage />
                    </Suspense>
                  } />
                  <Route path="/customer/progress" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProgressPage />
                    </Suspense>
                  } />
                  <Route path="/customer/my-coach" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <MyCoachPage />
                    </Suspense>
                  } />
                  <Route path="/customer/blog" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <BlogPage />
                    </Suspense>
                  } />
                  <Route path="/customer/settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProfilePage />
                    </Suspense>
                  } />
                  <Route path="/program/:type/:id" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ViewProgramPage />
                    </Suspense>
                  } />
                  <Route path="/program/:id" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ViewProgramPage />
                    </Suspense>
                  } />
                </Route>

                {/* Onboarding Routes */}
                <Route path="/onboarding" element={<OnboardingGate />}>
                  <Route path="step-1" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <GoalSelectionStep />
                    </Suspense>
                  } />
                  <Route path="step-2" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <PersonalInfoStep />
                    </Suspense>
                  } />
                  <Route path="step-3" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <PreferencesStep />
                    </Suspense>
                  } />
                  <Route path="step-4" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ContactStep />
                    </Suspense>
                  } />
                  <Route path="success" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <OnboardingSuccess />
                    </Suspense>
                  } />
                </Route>
              </Route>

              {/* Catch all */}
              <Route path="*" element={
                <Suspense fallback={<LoadingScreen />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </AuthProvider>
        } />
      </Routes>
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
