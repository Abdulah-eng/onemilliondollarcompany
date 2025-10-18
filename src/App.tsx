import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { RefreshProvider } from "./contexts/RefreshContext";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import StripeSyncHandler from "@/components/system/StripeSyncHandler";
import AuthLinkHandler from "@/components/system/AuthLinkHandler";
import { DiagnosticPanel } from "@/components/system/DiagnosticPanel";
import "@/lib/i18n";

// --- LAYOUTS ---
import AppShell from "@/components/layouts/AppShell";
import RoleGate from "@/components/routing/RoleGate";
import SubscriptionGate from "@/components/routing/SubscriptionGate";
import AccessControl from "@/components/routing/AccessControl";
import LibraryAccessControl from "@/components/routing/LibraryAccessControl";
import AdminGate from "@/components/routing/AdminGate";

// --- PAGES (Lazy Loaded) ---
import LandingPage from "./pages/public/LandingPage";
import { lazy, Suspense } from "react";

// Legal pages
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));

const GetStartedPage = lazy(() => import("./pages/auth/GetStartedPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const UpdatePasswordPage = lazy(() => import("./pages/auth/UpdatePasswordPage"));
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
const CoachProgramsPage = lazy(() => import("./pages/coach/ProgramsPage"));
const ProgramBuilder = lazy(() => import("./pages/coach/ProgramBuilder")); // ✅ Lazy-load the new page
const ProgramViewPage = lazy(() => import("./pages/coach/ProgramViewPage")); // ✅ Lazy-load the program view page
const CoachLibraryPage = lazy(() => import("./pages/coach/LibraryPage"));
const CoachBlogPage = lazy(() => import("./pages/coach/BlogPage"));
const IncomePage = lazy(() => import("./pages/coach/IncomePage"));
const CoachSettingsPage = lazy(() => import("./pages/coach/SettingsPage"));
const CoachMessagesPage = lazy(() => import("./pages/coach/MessagesPage"));

const MyProgramsPage = lazy(() => import("./pages/customer/MyProgramsPage"));
const ViewProgramPage = lazy(() => import("./pages/customer/ViewProgramPage"));
const LibraryPage = lazy(() => import("./pages/customer/LibraryPage"));
const ProgressPage = lazy(() => import("./pages/customer/ProgressPage"));
const ProgramHistoryPage = lazy(() => import("./pages/customer/ProgramHistoryPage"));
const MyCoachPage = lazy(() => import("./pages/customer/MyCoach"));
const BlogPage = lazy(() => import("./pages/customer/BlogPage"));
const ProfilePage = lazy(() => import("./pages/customer/Profile"));
const CustomerMessagesPage = lazy(() => import("./pages/customer/MessagesPage"));
const UpdatePaymentPlanPage = lazy(() => import("./pages/customer/UpdatePaymentPlanPage"));
const CancelSubscriptionPage = lazy(() => import("./pages/customer/CancelSubscriptionPage"));

const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
  </div>
);

const queryClient = new QueryClient();

const PublicRoutesLayout = () => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <LoadingScreen />;
  
  // Only redirect to dashboard if user is on a public route (not already on a protected route)
  if (profile) {
    const publicRoutes = ['/', '/login', '/get-started', '/forgot-password', '/update-password', '/terms', '/privacy'];
    const isOnPublicRoute = publicRoutes.includes(location.pathname);
    
    if (isOnPublicRoute) {
      if (profile.role === "coach") return <Navigate to="/coach/dashboard" replace />;
      if (profile.onboarding_complete) return <Navigate to="/customer/dashboard" replace />;
      return <Navigate to="/onboarding/step-1" replace />;
    }
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
  const lightThemePages = ['/', '/login', '/get-started', '/forgot-password', '/update-password'];
  const shouldForceLightTheme = lightThemePages.includes(location.pathname);
  
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      forcedTheme={shouldForceLightTheme ? "light" : undefined}
    >
      <Toaster richColors position="top-right" />
      <StripeSyncHandler />
      <AuthLinkHandler />
      <Routes>
        {/* 1. Landing Page (Outside AuthProvider for performance) */}
        <Route path="/" element={<LandingPage />} />

        {/* Diagnostic page - accessible without authentication */}
        <Route path="/diagnostic" element={<DiagnosticPanel />} />

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
             <RefreshProvider>
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
                <Route path="/update-password" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <UpdatePasswordPage />
                  </Suspense>
                } />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoutesLayout />}>
                {/* Coach Routes - Only accessible to coaches */}
                <Route
                  element={
                    <RoleGate allowedRole="coach">
                      <AppShell />
                    </RoleGate>
                  }
                >
                  {/* Coach Dashboard - Coach only */}
                  <Route path="/coach/dashboard" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachDashboardPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Settings - Coach only */}
                  <Route path="/coach/settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachSettingsPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Clients - Coach only (their own clients) */}
                  <Route path="/coach/clients" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientOverviewPage />
                    </Suspense>
                  } />
                  <Route path="/coach/clients/:clientId" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientCard />
                    </Suspense>
                  } />
                  
                  {/* Coach Programs - Coach only (their own programs) */}
                  <Route path="/coach/programs" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachProgramsPage />
                    </Suspense>
                  } />
                  <Route path="/coach/programs/create" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProgramBuilder />
                    </Suspense>
                  } />
                  <Route path="/coach/programs/edit/:id" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProgramBuilder />
                    </Suspense>
                  } />
                  <Route path="/coach/programs/view/:id" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProgramViewPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Library - Coach only */}
                  <Route path="/coach/library" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachLibraryPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Messages - Coach only (with their clients) */}
                  <Route path="/coach/messages" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachMessagesPage />
                    </Suspense>
                  } />
                  <Route path="/coach/messages/:conversationId" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachMessagesPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Blog - Coach only */}
                  <Route path="/coach/blog" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CoachBlogPage />
                    </Suspense>
                  } />
                  
                  {/* Coach Income - Coach only */}
                  <Route path="/coach/income" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <IncomePage />
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
                  {/* Home - Free access */}
                  <Route path="/customer/dashboard" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <CustomerDashboardPage />
                    </Suspense>
                  } />
                  
                  {/* My Coach - Free access */}
                  <Route path="/customer/my-coach" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <MyCoachPage />
                    </Suspense>
                  } />
                  
                  {/* Settings - Free access for all users */}
                  <Route path="/customer/settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProfilePage />
                    </Suspense>
                  } />
                  
                  {/* Messages - Coach OR Payment plan access */}
                  <Route path="/customer/messages" element={
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <CustomerMessagesPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  <Route path="/customer/messages/:conversationId" element={
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <CustomerMessagesPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  
                  {/* Blog - Coach OR Payment plan access */}
                  <Route path="/customer/blog" element={
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <BlogPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  
                  {/* My Programs - Coach OR Payment plan access */}
                  <Route path="/customer/programs" element={
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <MyProgramsPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  
                  {/* Library - Coach OR Payment plan access (with partial access for coach clients) */}
                  <Route path="/customer/library" element={
                    <LibraryAccessControl>
                      <Suspense fallback={<LoadingScreen />}>
                        <LibraryPage />
                      </Suspense>
                    </LibraryAccessControl>
                  } />
                  
                  {/* Progress - Payment plan access only */}
                  <Route path="/customer/progress" element={
                    <AccessControl requiredAccess="payment">
                      <Suspense fallback={<LoadingScreen />}>
                        <ProgressPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  
                  {/* History - Payment plan access only */}
                  <Route path="/customer/history" element={
                    <AccessControl requiredAccess="payment">
                      <Suspense fallback={<LoadingScreen />}>
                        <ProgramHistoryPage />
                      </Suspense>
                    </AccessControl>
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
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <ViewProgramPage />
                      </Suspense>
                    </AccessControl>
                  } />
                  <Route path="/program/:id" element={
                    <AccessControl requiredAccess="coach">
                      <Suspense fallback={<LoadingScreen />}>
                        <ViewProgramPage />
                      </Suspense>
                    </AccessControl>
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
            </RefreshProvider>
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
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ThemedApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
