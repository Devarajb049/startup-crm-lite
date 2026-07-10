import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Plus, LogOut, PanelLeft } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import NotificationDropdown from './NotificationDropdown';
import ShimmerButton from './ShimmerButton';
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
      case '/dashboard':
        return { parent: 'Dashboards', active: 'Overview' };
      case '/leads':
        return { parent: 'Workspace', active: 'Leads' };
      case '/analytics':
        return { parent: 'Workspace', active: 'Analytics' };
      case '/settings':
        return { parent: 'Workspace', active: 'Settings' };
      default:
        return { parent: 'Pages', active: 'Not Found' };
    }
  };

  const crumbs = getBreadcrumbs();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-bg/55 dark:bg-bg/60 border-b border-border/40 dark:border-border/10 transition-colors duration-200 md:px-6 backdrop-blur-xl">
 
      {/* Left Area: Sidebar toggle, Star, Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer hidden md:block"
          aria-label="Toggle sidebar collapse"
        >
          <PanelLeft size={16} />
        </button>
 
        <div className="h-4 w-px bg-slate-200/80 dark:bg-white/10 mx-1 hidden sm:block" />
 
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs select-none">
          <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">{crumbs.parent}</span>
          <span className="text-slate-300 dark:text-slate-800">/</span>
          <span className="font-bold text-slate-850 dark:text-white uppercase tracking-wider">{crumbs.active}</span>
        </div>
      </div>
 
      {/* Right Area: Controls (Search capsule, Add Lead button, dark mode toggle, alerts notification, Logout) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Add Lead Button */}
        <ShimmerButton
          onClick={onOpenAddLead}
          className="shadow-md shadow-primary/10 border border-blue-400/20"
          title="Create New Lead"
          aria-label="Create New Lead"
          px="px-2 sm:px-4"
          py="py-2"
        >
          <Plus size={14} className="stroke-[2.5] shrink-0" />
          <span className="hidden sm:inline text-[11px] tracking-wide">Add Lead</span>
        </ShimmerButton>
 
        <div className="h-5 w-px bg-slate-200/80 dark:bg-white/10" />
 
        {/* Theme Toggle Slider Replaced by simple icon switch */}
        <DarkModeToggle />
 
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-150 focus:outline-hidden cursor-pointer"
            aria-label="View alerts"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-extrabold text-white border border-white dark:border-bg shadow-sm">
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
          className="p-2 rounded-xl text-slate-500 dark:text-slate-405 hover:bg-white/40 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 focus:outline-hidden cursor-pointer"
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
