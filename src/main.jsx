import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

/**
 * Renders the React 19 application.
 * Wraps <App /> inside:
 * 1. AuthProvider: Manages active user sessions.
 * 2. LeadProvider: Maintains CRM opportunity records.
 * 3. ThemeProvider: Managing Dark/Light visual styling.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LeadProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LeadProvider>
    </AuthProvider>
  </StrictMode>,
);
