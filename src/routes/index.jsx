import React, { lazy, Suspense } from 'react';
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
      new Promise((resolve) => setTimeout(resolve, 2800))
    ]).then(([moduleExports]) => moduleExports);
  });
};

// Use delayed imports for main app views to show the complete A-U-R-A logo loop
const Dashboard = delayedImport(() => import('../pages/Dashboard'));
const Leads = delayedImport(() => import('../pages/Leads'));
const Analytics = delayedImport(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));

// Premium visual page loader rendered in place of the page chunk until lazy imports resolve
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent select-none">
    <style>{`
      :root {
        --dot-neutral: #cbd5e1;
      }
      .dark :root {
        --dot-neutral: #334155;
      }
      .loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
      }
      .loader-svg {
        width: 148px;
        height: 40px;
        animation: svg-glow-scale 2s forwards ease-in-out;
      }
      .path-a1 {
        stroke-dasharray: 65;
        stroke-dashoffset: 65;
        animation: write-a1 2s forwards ease-in-out;
      }
      .path-u {
        stroke-dasharray: 65;
        stroke-dashoffset: 65;
        animation: write-u 2s forwards ease-in-out;
      }
      .path-r {
        stroke-dasharray: 85;
        stroke-dashoffset: 85;
        animation: write-r 2s forwards ease-in-out;
      }
      .path-a2 {
        stroke-dasharray: 65;
        stroke-dashoffset: 65;
        animation: write-a2 2s forwards ease-in-out;
      }
      @keyframes write-a1 {
        0% { stroke-dashoffset: 65; opacity: 0; stroke: currentColor; }
        15%, 60% { stroke-dashoffset: 0; opacity: 1; stroke: currentColor; }
        68%, 80% { stroke-dashoffset: 0; opacity: 1; stroke: #3B82F6; filter: drop-shadow(0 0 6px rgba(59,130,246,0.6)); }
        85%, 100% { opacity: 0; }
      }
      @keyframes write-u {
        0%, 15% { stroke-dashoffset: 65; opacity: 0; stroke: currentColor; }
        30%, 60% { stroke-dashoffset: 0; opacity: 1; stroke: currentColor; }
        68%, 80% { stroke-dashoffset: 0; opacity: 1; stroke: #6366F1; filter: drop-shadow(0 0 6px rgba(99,102,241,0.6)); }
        85%, 100% { opacity: 0; }
      }
      @keyframes write-r {
        0%, 30% { stroke-dashoffset: 85; opacity: 0; stroke: currentColor; }
        45%, 60% { stroke-dashoffset: 0; opacity: 1; stroke: currentColor; }
        68%, 80% { stroke-dashoffset: 0; opacity: 1; stroke: #8B5CF6; filter: drop-shadow(0 0 6px rgba(139,92,246,0.6)); }
        85%, 100% { opacity: 0; }
      }
      @keyframes write-a2 {
        0%, 45% { stroke-dashoffset: 65; opacity: 0; stroke: currentColor; }
        60% { stroke-dashoffset: 0; opacity: 1; stroke: currentColor; }
        68%, 80% { stroke-dashoffset: 0; opacity: 1; stroke: #EC4899; filter: drop-shadow(0 0 6px rgba(236,72,153,0.6)); }
        85%, 100% { opacity: 0; }
      }
      @keyframes svg-glow-scale {
        0%, 60% { transform: scale(1); }
        68%, 80% { transform: scale(1.05); }
        85%, 100% { transform: scale(1); }
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background-color: var(--dot-neutral);
        opacity: 0.5;
        position: absolute;
        transition: background-color 0.2s ease, opacity 0.2s ease;
      }
      .dot-1 { left: 16px; animation: dot-light-1 2.8s infinite ease-in-out; }
      .dot-2 { left: 52px; animation: dot-light-2 2.8s infinite ease-in-out; }
      .dot-3 { left: 88px; animation: dot-light-3 2.8s infinite ease-in-out; }
      .dot-4 { left: 124px; animation: dot-light-4 2.8s infinite ease-in-out; }
      @keyframes dot-light-1 {
        0%, 14.9% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
        15%, 80% { background-color: #3B82F6; opacity: 1; box-shadow: 0 0 8px rgba(59,130,246,0.6); }
        85%, 100% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
      }
      @keyframes dot-light-2 {
        0%, 29.9% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
        30%, 80% { background-color: #6366F1; opacity: 1; box-shadow: 0 0 8px rgba(99,102,241,0.6); }
        85%, 100% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
      }
      @keyframes dot-light-3 {
        0%, 44.9% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
        45%, 80% { background-color: #8B5CF6; opacity: 1; box-shadow: 0 0 8px rgba(139,92,246,0.6); }
        85%, 100% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
      }
      @keyframes dot-light-4 {
        0%, 59.9% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
        60%, 80% { background-color: #EC4899; opacity: 1; box-shadow: 0 0 8px rgba(236,72,153,0.6); }
        85%, 100% { background-color: var(--dot-neutral); opacity: 0.5; box-shadow: none; }
      }
    `}</style>

    <div className="loader-container">
      <svg viewBox="0 0 148 40" className="loader-svg text-slate-800 dark:text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Character A1 Path */}
        <path
          className="path-a1"
          d="M 12 32 L 20 8 L 28 32 M 16.5 23 L 23.5 23"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Character U Path */}
        <path
          className="path-u"
          d="M 48 8 L 48 24 C 48 30, 64 30, 64 24 L 64 8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Character R Path */}
        <path
          className="path-r"
          d="M 84 32 L 84 8 L 96 8 C 102 8, 102 18, 96 18 L 84 18 M 93 18 L 102 32"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Character A2 Path */}
        <path
          className="path-a2"
          d="M 120 32 L 128 8 L 136 32 M 124.5 23 L 131.5 23"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Spaced dots matching letter centers */}
      <div className="relative w-[148px] h-2">
        <div className="dot dot-1" />
        <div className="dot dot-2" />
        <div className="dot dot-3" />
        <div className="dot dot-4" />
      </div>
    </div>
  </div>
);

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

        {/* Private Dashboard Shell Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Route targeting the main landing Dashboard overview */}
          <Route path="/" element={<Dashboard />} />

          {/* Route targeting the Leads table CRUD control desk */}
          <Route path="/leads" element={<Leads />} />

          {/* Route targeting deep graphical charts & stats */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Wildcard route displaying a custom 404 fallback page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
