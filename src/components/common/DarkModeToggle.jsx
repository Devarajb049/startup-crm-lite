import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * DarkModeToggle Component
 * Renders an animated slider switch to toggle light/dark theme modes.
 * Uses useTheme context hooks.
 */
const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-250 ease-in-out focus:outline-hidden"
      role="switch"
      aria-checked={isDarkMode}
      aria-label="Toggle theme mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Sliding knob with contextual Sun/Moon icon */}
      <span
        className={`pointer-events-none flex items-center justify-center h-7.5 w-7.5 transform rounded-full bg-white dark:bg-slate-950 shadow-sm transition duration-250 ease-in-out ${isDarkMode ? 'translate-x-7 text-blue-400' : 'translate-x-0.5 text-amber-500'
          }`}
      >
        {isDarkMode ? (
          <Moon size={13} fill="currentColor" className="transition-transform duration-250 rotate-0" />
        ) : (
          <Sun size={13} fill="currentColor" className="transition-transform duration-250 rotate-45" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
