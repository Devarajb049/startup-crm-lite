import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/common/Layout';
import { AppRoutes } from './routes';

/**
 * App Component
 * The central root assembly for AuraCRM.
 * - Wraps the layout in the HTML5 BrowserRouter to handle router navigation paths.
 * - Renders the Layout shell (Sidebar + Navbar frame) surrounding the lazy-loaded Page Switcher AppRoutes.
 */
const App = () => {
  return (
    // BrowserRouter links URLs to specific router configurations
    <BrowserRouter>
      
      {/* Toast notifications popup layer */}
      <Toaster position="top-right" />
      
      {/* Layout provides the outer structural wireframe */}
      <Layout>
        
        {/* AppRoutes renders the lazy loaded content pages based on routes */}
        <AppRoutes />
        
      </Layout>
      
    </BrowserRouter>
  );
};

export default App;