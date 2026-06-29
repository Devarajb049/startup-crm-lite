import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Plus } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useLeads } from '../../context/LeadContext';

/**
 * @typedef {Object} NavbarProps
 * @property {function} toggleSidebar - Shows or hides sidebar drawer on mobile
 * @property {function} onOpenAddLead - Triggers the modal dialog to register new leads
 */

/**
 * Navbar Component
 * Renders the top header bar. Displays the active page title,
 * the DarkModeToggle switch, notifications bell dropdown, and the quick lead creation button.
 * 
 * @param {NavbarProps} props
 */
const Navbar = ({ onOpenAddLead }) => {
  const location = useLocation();
  const { notifications } = useLeads();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-200 md:px-6">

      {/* Left Area: Dynamic Page Title */}
      <div className="flex items-center gap-3">
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

        {/* Notification bell dropdown button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 focus:outline-hidden cursor-pointer"
            aria-label="View alerts"
          >
            <Bell size={17} />
            {/* Dynamic unread badge count */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white border border-white dark:border-slate-900 shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Floating dropdown panel */}
          <NotificationDropdown 
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
