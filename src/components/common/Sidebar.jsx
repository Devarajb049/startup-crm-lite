import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, LogOut, X, Settings as SettingsIcon, PieChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

/**
 * Sidebar Component
 * Renders the primary navigation panel.
 * - Mobile: Hidden from view (replaced by bottom navigation, but supports slide-out drawer)
 * - Tablet: Collapses to `w-20` showing centered icons only
 * - Desktop: Expands to `w-64` showing icons, labels, and workspace metadata (collapsible to `w-20`)
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
  const navigationLinks = [
    { name: 'Dashboard', subLabel: 'Overview & KPI Metrics', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads Management', subLabel: 'Active Opportunities Directory', path: '/leads', icon: Users },
    { name: 'Analytics', subLabel: 'Conversion & Revenue Charts', path: '/analytics', icon: BarChart3 },
    { name: 'Source Analytics', subLabel: 'Source Channel Charts', path: '/source-analytics', icon: PieChart },
    { name: 'Settings', subLabel: 'User & System Profiles', path: '/settings', icon: SettingsIcon }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-sidebar/40 dark:bg-sidebar/60 backdrop-blur-2xl border-r border-border/50 dark:border-border/10 text-body dark:text-muted transition-all duration-250 ease-in-out shadow-[4px_0_30px_rgba(0,0,0,0.015)] dark:shadow-[4px_0_30px_rgba(0,0,0,0.15)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 ${isCollapsed ? 'md:w-20 lg:w-20' : 'md:w-20 lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className={`flex ${isCollapsed ? 'flex-col justify-center py-3 gap-2.5' : 'items-center justify-between'} h-auto min-h-[64px] px-4 border-b border-border/50 dark:border-border/10 shrink-0`}>
          <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
            <Logo className="w-8 h-8 text-primary shrink-0 transition-transform duration-300" />
 
            {/* Brand details */}
            <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:flex'} items-center gap-1.5`}>
              <span className="text-sm font-bold tracking-tight text-heading dark:text-white uppercase">
                AURA<span className="text-primary">CRM</span>
              </span>
              <span className="text-[9px] bg-bg dark:bg-white/10 text-body dark:text-muted px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
                Lite
              </span>
            </div>
          </div>
 
          {/* Close Sidebar Drawer Button (Mobile only) */}
          <button
            type="button"
            className="p-1.5 rounded-lg md:hidden hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white focus:outline-hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar drawer"
          >
            <X size={16} />
          </button>
        </div>
 
        {/* Sidebar NavLinks */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          <p className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:block'} px-3.5 mb-2.5 text-[10px] font-bold tracking-wider text-slate-400/85 dark:text-slate-500 uppercase select-none`}>
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
                  `group flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'} gap-3 px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 border ${isActive
                    ? 'active text-primary dark:text-white border-l-[3px] border-l-primary rounded-r-xl rounded-l-none pl-3 border-y-transparent border-r-transparent bg-transparent'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-transparent rounded-xl'
                  }`
                }
                title={link.name}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent size={17} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
 
                    {/* Text Labels */}
                    <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:flex'} flex-col text-left`}>
                      <span className="font-bold text-[11px] uppercase tracking-wider">{link.name}</span>
                      <span className={`text-[9px] mt-0.5 font-medium leading-none truncate max-w-[150px] ${isActive
                        ? 'text-primary/70 dark:text-white/70'
                        : 'text-slate-400 dark:text-slate-550 group-hover:text-slate-650 dark:group-hover:text-slate-350'
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
        <div className="p-3 lg:p-4 border-t border-border/50 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-between'} gap-3`}>
            {/* Profile Avatar */}
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white border border-white/10 select-none shrink-0" title={user?.name}>
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-white dark:border-sidebar" />
            </div>

            {/* Profile Info */}
            <div className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:flex'} flex-col min-w-0 flex-1`}>
              <p className="text-xs font-bold text-slate-850 dark:text-white truncate" title={user?.name}>
                {user?.name || 'User'}
              </p>
              <p className="text-[9px] text-slate-500 truncate" title={user?.email}>
                {user?.email || 'SaaS founder'}
              </p>

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className={`hidden ${isCollapsed ? 'md:hidden' : 'lg:block'} p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white focus:outline-hidden cursor-pointer`}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
