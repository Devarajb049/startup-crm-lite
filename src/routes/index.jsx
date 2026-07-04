import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

// Use React.lazy to import pages asynchronously to split code bundles
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));

// Premium visual page loader rendered in place of the page chunk until lazy imports resolve
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full py-20" aria-label="Loading page">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Guard Component: ProtectedRoute
 * Restricts access to authenticated sessions. Renders app shell Layout wrapper with sub-route Outlet.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

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

  if (isLoading) return <PageLoader />;

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
