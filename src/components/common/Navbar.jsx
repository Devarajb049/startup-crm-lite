import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, Plus } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

/**
 * @typedef {Object} NavbarProps
 * @property {function} toggleSidebar - Shows or hides sidebar drawer on mobile
 * @property {function} onOpenAddLead - Triggers the modal dialog to register new leads
 */

/**
 * Navbar Component
 * Renders the top header bar. Displays the active page title,
 * the DarkModeToggle switch, notifications bell, and the quick lead creation button.
 * 
 * @param {NavbarProps} props
 */
const Navbar = ({ toggleSidebar, onOpenAddLead }) => {
  const location = useLocation();

  // Resolve active page titles based on pathnames
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/leads':
        return 'Lead Management';
      case '/analytics':
        return 'Analytics Overview';
      default:
        return 'Page Not Found';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 dark:bg-card-dark dark:border-border-dark transition-colors duration-200 md:px-6">

      {/* Left Area: Mobile Menu Hamburger Trigger + Dynamic Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 -ml-2 rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-hover-dark text-slate-500 dark:text-slate-400 focus:outline-hidden"
          onClick={toggleSidebar}
          aria-label="Open navigation drawer"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg md:text-xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Area: Interactive Controls (Create Lead, Dark Mode Slider, Alerts Notification) */}
      <div className="flex items-center gap-3">

        {/* Quick Lead Registration CTA Button */}
        <button
          type="button"
          onClick={onOpenAddLead}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden"
        >
          <Plus size={15} />
          <span>New Lead</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Custom Animated Theme Toggle Switch */}
        <DarkModeToggle />

        {/* Notification bell badge */}
        <button
          type="button"
          className="relative p-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-hover-dark transition-colors duration-150 focus:outline-hidden"
          aria-label="View alerts"
        >
          <Bell size={17} />
          {/* Pulsing visual alert status badge */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger border border-white dark:border-card-dark animate-pulse" />

        </button>
      </div>
    </header>
  );
};

export default Navbar;
