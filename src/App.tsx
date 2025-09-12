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

// --- PAGES (Lazy Loaded) ---
import LandingPage from "./pages/public/LandingPage";
import { lazy, Suspense } from "react";

// Legal pages
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));

const GetStartedPage = lazy(() => import("./pages/auth/GetStartedPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GoalSelectionStep = lazy(() => import("./pages/onboarding/GoalSelectionStep"));
const PersonalInfoStep = lazy(() => import("./pages/onboarding/PersonalInfoStep"));
const PreferencesStep = lazy(() => import("./pages/onboarding/PreferencesStep"));
const ContactStep = lazy(() => import("./pages/onboarding/ContactStep"));
const OnboardingSuccess = lazy(() => import("./pages/onboarding/OnboardingSuccess"));
const CustomerDashboardPage = lazy(() => import("./pages/customer/CustomerDashboard"));
const CoachDashboardPage = lazy(() => import("./pages/coach/CoachDashboard"));
const ClientOverviewPage = lazy(() => import("./pages/coach/ClientOverviewPage"));
const ClientCard = lazy(() => import("./pages/coach/ClientCard"));

const MyProgramsPage = lazy(() => import("./pages/customer/MyProgramsPage"));
const ViewProgramPage = lazy(() => import("./pages/customer/ViewProgramPage"));
const LibraryPage = lazy(() => import("./pages/customer/LibraryPage"));
const ProgressPage = lazy(() => import("./pages/customer/ProgressPage"));
const MyCoachPage = lazy(() => import("./pages/customer/MyCoach"));
const BlogPage = lazy(() => import("./pages/customer/BlogPage"));
const ProfilePage = lazy(() => import("./pages/customer/Profile"));
const UpdatePaymentPlanPage = lazy(() => import("./pages/customer/UpdatePaymentPlanPage"));
const CancelSubscriptionPage = lazy(() => import("./pages/customer/CancelSubscriptionPage"));


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

        {/* Legal pages - accessible without authentication */}
        <Route path="/terms" element={
          <Suspense fallback={<LoadingScreen />}>
            <TermsPage />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<LoadingScreen />}>
            <PrivacyPage />
          </Suspense>
        } />

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
                  <Route path="/coach/dashboard" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachDashboardPage />
                    </Suspense>
                  } />
                  <Route path="/coach/clients/:clientId" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientCard />
                    </Suspense>
                  } />
                  <Route path="/coach/clients" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientOverviewPage />
                    </Suspense>
                  } />
                </Route>

                {/* Customer Routes */}
                <Route
                  element={
                    <RoleGate allowedRole="customer">
                      <AppShell />
                    </RoleGate>
                  }
                >
                  <Route path="/customer/dashboard" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CustomerDashboardPage />
                    </Suspense>
                  } />
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
                  <Route path="/customer/payment/update-plan" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <UpdatePaymentPlanPage />
                    </Suspense>
                  } />
                  <Route path="/customer/payment/cancel-subscription" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CancelSubscriptionPage />
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
