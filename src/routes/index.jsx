import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Use React.lazy to import pages asynchronously to split code bundles and speed up initial page load.
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// A premium visual page loader rendered in place of the page chunk until the lazy import resolves.
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full py-20" aria-label="Loading page">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * AppRoutes Component
 * Sets up the routing tree using React Router DOM.
 * Integrates standard path mappings:
 * - "/" for Dashboard
 * - "/leads" for Lead Management
 * - "/analytics" for Analytics
 * - "*" (wildcard fallback) for the 404 Not Found screen
 */
export const AppRoutes = () => {
  return (
    // Wrap routes in React Suspense to catch the lazy chunk load transitions
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Route targeting the main landing Dashboard overview */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route targeting the Leads table CRUD control desk */}
        <Route path="/leads" element={<Leads />} />
        
        {/* Route targeting deep graphical charts & stats */}
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Wildcard route displaying a custom 404 fallback page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
