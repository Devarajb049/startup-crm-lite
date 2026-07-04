import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Plus, LogOut, PanelLeft } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useLeads } from '../../context/LeadContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar Component
 * Renders the top header bar. Displays page breadcrumbs, Favorites star,
 * DarkModeToggle, search pill layout, notifications, and logout controls.
 */
const Navbar = ({ onOpenAddLead, isCollapsed, toggleCollapse }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const { notifications } = useLeads();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Resolve active page titles based on pathnames for breadcrumbs
  const getBreadcrumbs = () => {
    switch (location.pathname) {
      case '/':
        return { parent: 'Dashboards', active: 'Overview' };
      case '/leads':
        return { parent: 'Workspace', active: 'Leads' };
      case '/analytics':
        return { parent: 'Workspace', active: 'Analytics' };
      default:
        return { parent: 'Pages', active: 'Not Found' };
    }
  };

  const crumbs = getBreadcrumbs();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/95 border-b border-slate-100 dark:bg-[#1C1C1C]/95 dark:border-slate-800/40 transition-colors duration-200 md:px-6 backdrop-blur-xs">

      {/* Left Area: Sidebar toggle, Star, Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden md:block"
          aria-label="Toggle sidebar collapse"
        >
          <PanelLeft size={16} />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs select-none">
          <span className="text-slate-400 dark:text-slate-500 font-medium">{crumbs.parent}</span>
          <span className="text-slate-350 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-800 dark:text-white">{crumbs.active}</span>
        </div>
      </div>

      {/* Right Area: Controls (Search capsule, Add Lead button, dark mode toggle, alerts notification, Logout) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Add Lead Button */}
        <button
          type="button"
          onClick={onOpenAddLead}
          className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-600 active:bg-blue-750 text-white text-xs font-semibold rounded-xl cursor-pointer transition-all duration-150 active:scale-95 shadow-xs"
          title="Create New Lead"
          aria-label="Create New Lead"
        >
          <Plus size={15} className="shrink-0" />
          <span className="hidden sm:inline text-[11px]">Add Lead</span>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Theme Toggle Slider Replaced by simple icon switch */}
        <DarkModeToggle />

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 focus:outline-hidden cursor-pointer"
            aria-label="View alerts"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white border-2 border-white dark:border-slate-900 shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>



        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-rose-605 dark:hover:text-rose-400 transition-colors duration-150 focus:outline-hidden cursor-pointer"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
