import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes';

// Redirect direct path entry without a hash to its corresponding HashRouter route path
const pathname = window.location.pathname;
if (pathname !== '/' && !pathname.endsWith('/index.html') && !window.location.hash) {
  const targetHash = '#' + pathname + window.location.search;
  window.location.replace(window.location.origin + '/' + targetHash);
}

/**
 * App Component
 * The central root assembly for AuraCRM.
 * - Wraps the layout in the HTML5 HashRouter to handle router navigation paths.
 * - Renders the AppRoutes which handles protected and public route layouts.
 */
const App = () => {
  return (
    // HashRouter links URLs to specific router configurations via hash pathing, preventing page reload 404s
    <HashRouter>
      
      {/* Toast notifications popup layer */}
      <Toaster position="top-right" />
      
      {/* AppRoutes renders the lazy loaded content pages based on routes */}
      <AppRoutes />
      
    </HashRouter>
  );
};

export default App;