import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Renders the React 19 application.
 * Wraps <App /> inside:
 * 1. LeadProvider: Outer wrapper maintaining CRM opportunity records.
 * 2. ThemeProvider: Inner wrapper managing Dark/Light visual styling.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LeadProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LeadProvider>
  </StrictMode>,
);
