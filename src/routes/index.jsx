import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

// Use React.lazy to import pages asynchronously to split code bundles and speed up initial page load.
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Settings = lazy(() => import('../pages/Settings'));

// A premium visual page loader rendered in place of the page chunk until the lazy import resolves.
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full py-20" aria-label="Loading page">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Guard Component: ProtectedLayout
 * Restricts access to authenticated sessions. Renders app shell wrapper Layout with sub-route Outlet.
 */
const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

/**
 * Guard Component: PublicOnly
 * Prevents authenticated sessions from accessing login or registration layouts.
 */
const PublicOnly = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

/**
 * AppRoutes Component
 * Sets up the routing tree using React Router DOM.
 * Integrates standard path mappings:
 * - "/login" for Login (Public only)
 * - "/register" for Register (Public only)
 * - "/" for Dashboard (Protected)
 * - "/leads" for Lead Management (Protected)
 * - "/analytics" for Analytics (Protected)
 * - "/settings" for Settings & Profile (Protected)
 * - "*" (wildcard fallback) for the 404 Not Found screen (Protected)
 */
export const AppRoutes = () => {
  return (
    // Wrap routes in React Suspense to catch the lazy chunk load transitions
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Authentication Pages */}
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

        {/* Private Dashboard Shell Canvas */}
        <Route element={<ProtectedLayout />}>
          {/* Route targeting the main landing Dashboard overview */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Route targeting the Leads table CRUD control desk */}
          <Route path="/leads" element={<Leads />} />
          
          {/* Route targeting deep graphical charts & stats */}
          <Route path="/analytics" element={<Analytics />} />

          {/* Route targeting user settings and crm configurations */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Wildcard route displaying a custom 404 fallback page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
