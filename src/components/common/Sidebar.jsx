import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, TrendingUp, LogOut, X, ChevronsLeft, ChevronsRight, Settings } from 'lucide-react';

/**
 * @typedef {Object} SidebarProps
 * @property {boolean} isOpen - Mobile drawer toggle state
 * @property {function} toggleSidebar - Mobile drawer close handler
 * @property {boolean} isCollapsed - Desktop sidebar collapse state
 * @property {function} toggleCollapse - Desktop sidebar collapse toggle handler
 */

import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar Component
 * Renders the primary navigation panel.
 * - Mobile: Hidden from view (replaced by bottom navigation, but supports slide-out drawer)
 * - Tablet: Collapses to `w-20` showing centered icons only
 * - Desktop: Expands to `w-64` showing icons, labels, and workspace metadata (collapsible to `w-20`)
 * 
 * @param {SidebarProps} props
 */
const Sidebar = ({ isOpen, toggleSidebar, isCollapsed = false, toggleCollapse }) => {
  const { user, logout } = useAuth();
  
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);
  // Navigation details with subtext annotations for desktop view
  const navigationLinks = [
    { name: 'Dashboard', subLabel: 'Overview & KPI Metrics', path: '/', icon: LayoutDashboard },
    { name: 'Leads Management', subLabel: 'Active Opportunities Directory', path: '/leads', icon: Users },
    { name: 'Analytics', subLabel: 'Conversion & Revenue Charts', path: '/analytics', icon: BarChart3 },
    { name: 'Settings & Profile', subLabel: 'Account & CRM Config', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay: visible on mobile backdrop tap */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-250 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 ${isCollapsed ? 'md:w-20 lg:w-20' : 'md:w-20 lg:w-64'}`}
      >

        {/* Brand Header */}
        <div className={`flex ${isCollapsed ? 'flex-col justify-center py-3 gap-2.5' : 'items-center justify-between'} h-auto min-h-[64px] px-4 border-b border-slate-200 dark:border-slate-800 shrink-0`}>
          <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
            {/* Brand Logo - Loaded directly from favicon.svg to guarantee identity */}
            <img 
              src="/favicon.svg" 
              alt="AuraCRM Logo" 
              className="w-8 h-8 shrink-0 rounded-lg shadow-md shadow-primary/10 select-none"
            />

            {/* Brand details - Hidden on tablet collapsed sidebar or when collapsed */}
            <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:flex'} items-center gap-1.5`}>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Aura<span className="text-primary">CRM</span>
              </span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
                Lite
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Collapse Arrow Trigger */}
          <button
            type="button"
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-hidden cursor-pointer"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>

          {/* Close Sidebar Drawer Button (Mobile only) */}
          <button
            type="button"
            className="p-1.5 rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white focus:outline-hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sidebar NavLinks */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {/* Workspace label - Hidden on tablet collapsed sidebar or when collapsed */}
          <p className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:block'} px-3.5 mb-2.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none`}>
            Workspace
          </p>

          {navigationLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `group flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'} gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-slate-100'
                  }`
                }
                title={link.name}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent size={18} strokeWidth={2} className="shrink-0" />

                    {/* Text Labels - Hidden on tablet collapsed sidebar or when collapsed */}
                    <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:flex'} flex-col text-left`}>
                      <span className="font-semibold text-xs leading-none">{link.name}</span>
                      <span className={`text-[9px] mt-1 font-medium leading-none truncate max-w-[150px] ${
                        isActive
                          ? 'text-blue-200/95'
                          : 'text-slate-450 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}>
                        {link.subLabel}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-3 lg:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-between'} gap-3`}>
            {/* Profile Avatar */}
            <div className="relative w-9 h-9 rounded-xl bg-slate-250 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-750 dark:text-white border border-slate-300 dark:border-slate-700 select-none shrink-0" title={user?.name}>
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-white dark:border-slate-900" />
            </div>

            {/* Profile Info - Hidden on tablet collapsed sidebar or when collapsed */}
            <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:block'} flex-1 min-w-0`}>
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate" title={user?.name}>
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5" title={user?.email}>
                {user?.email || 'SaaS founder'}
              </p>
            </div>

            {/* Logout - Hidden on tablet collapsed sidebar or when collapsed */}
            <button
              type="button"
              onClick={logout}
              className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:block'} p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white focus:outline-hidden cursor-pointer`}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
