import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

// Global session flag to check if the full A-U-R-A splash animation has already run
let hasLoaderRun = false;

// Helper to delay lazy chunk resolution so the PageLoader completes its full animation loop
const delayedImport = (importFunc) => {
  return lazy(() => {
    if (hasLoaderRun) {
      return importFunc();
    }
    hasLoaderRun = true;
    return Promise.all([
      importFunc(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).then(([moduleExports]) => moduleExports);
  });
};

// Use delayed imports for main app views to show the complete A-U-R-A logo loop
const Dashboard = delayedImport(() => import('../pages/Dashboard'));
const Leads = delayedImport(() => import('../pages/Leads'));
const Analytics = delayedImport(() => import('../pages/Analytics'));
const Settings = delayedImport(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

const loadingMessages = [
  "Loading Startup CRM...",
  "Preparing your workspace...",
  "Initializing dashboard...",
  "Please wait..."
];

// Premium visual page loader rendered in place of the page chunk until lazy imports resolve
const PageLoader = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 150);
    }, 600);

    return () => clearInterval(textTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/75 dark:bg-bg/85 backdrop-blur-2xl transition-all duration-300">
      <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center select-none">
        
        {/* Centered logo with soft glow, scaling and floating animation */}
        <div className="relative flex items-center justify-center animate-premium-float">
          <div className="absolute w-24 h-24 bg-blue-500/10 dark:bg-blue-500/15 blur-2xl rounded-full -z-10 animate-pulse-glow" />
          <Logo className="w-20 h-20 text-primary" />
        </div>

        {/* 3 jumping dots */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/80 animate-[bounce_1s_infinite_0ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-[bounce_1s_infinite_200ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-[bounce_1s_infinite_400ms]" />
        </div>

        {/* Message with fade transitions */}
        <p className={`text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-h-[16px] transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {loadingMessages[msgIndex]}
        </p>
      </div>
    </div>
  );
};

/**
 * Guard Component: ProtectedRoute
 * Restricts access to authenticated sessions. Renders app shell Layout wrapper with sub-route Outlet.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();
  const [delayActive, setDelayActive] = React.useState(!hasLoaderRun);

  React.useEffect(() => {
    if (!isLoading) {
      if (hasLoaderRun) {
        setDelayActive(false);
      } else {
        const timer = setTimeout(() => {
          setDelayActive(false);
          hasLoaderRun = true;
        }, 2800);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading]);

  if (isLoading || delayActive) return <PageLoader />;

  return token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

/**
 * Guard Component: PublicOnly
 * Prevents authenticated sessions from accessing login or registration screens.
 */
const PublicOnly = ({ children }) => {
  const { token, isLoading } = useAuth();
  const [delayActive, setDelayActive] = React.useState(!hasLoaderRun);

  React.useEffect(() => {
    if (!isLoading) {
      if (hasLoaderRun) {
        setDelayActive(false);
      } else {
        const timer = setTimeout(() => {
          setDelayActive(false);
          hasLoaderRun = true;
        }, 2800);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading]);

  if (isLoading || delayActive) return <PageLoader />;

  return !token ? children : <Navigate to="/" replace />;
};

/**
 * AppRoutes Component
 * Sets up the routing tree using React Router DOM.
 */
export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />

        {/* Private Dashboard Shell Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Route targeting the main landing Dashboard overview */}
          <Route path="/" element={<Dashboard />} />

          {/* Route targeting the Leads table CRUD control desk */}
          <Route path="/leads" element={<Leads />} />

          {/* Route targeting deep graphical charts & stats */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Route targeting user account profile configurations */}
          <Route path="/settings" element={<Settings />} />

          {/* Wildcard route displaying a custom 404 fallback page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
