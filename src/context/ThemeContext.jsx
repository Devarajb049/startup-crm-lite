import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create the Context object
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider Component
 * Exposes isDarkMode and theme toggling capabilities to consumer layouts.
 * Updates the document root node class list to enable class-based dark mode rules.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const ThemeProvider = ({ children }) => {
  // Sync dark mode state to local storage with default light mode (false)
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false);

  // Apply dark class immediately to documentElement on change
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles dark mode state
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme custom hook
 * Developer consumer hook to retrieve theme state variables and updates.
 * Throws a developer exception if used outside ThemeProvider wrapper.
 * 
 * @returns {{ isDarkMode: boolean, toggleTheme: () => void }}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be consumed inside a ThemeProvider');
  }
  return context;
};
