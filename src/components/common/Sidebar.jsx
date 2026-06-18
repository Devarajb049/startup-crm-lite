import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, TrendingUp, LogOut, X } from 'lucide-react';

/**
 * @typedef {Object} SidebarProps
 * @property {boolean} isOpen - Mobile drawer toggle state
 * @property {function} toggleSidebar - Mobile drawer close handler
 */

/**
 * Sidebar Component
 * Renders the primary navigation panel.
 * - Mobile: Hidden from view (replaced by bottom navigation, but supports slide-out drawer)
 * - Tablet: Collapses to `w-20` showing centered icons only
 * - Desktop: Expands to `w-64` showing icons, labels, and workspace metadata
 * 
 * @param {SidebarProps} props
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Navigation details with subtext annotations for desktop view
  const navigationLinks = [
    { name: 'Dashboard', subLabel: 'Overview & KPI Metrics', path: '/', icon: LayoutDashboard },
    { name: 'Leads Management', subLabel: 'Active Opportunities Directory', path: '/leads', icon: Users },
    { name: 'Analytics', subLabel: 'Conversion & Revenue Charts', path: '/analytics', icon: BarChart3 }
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-250 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:w-20 lg:w-64`}
      >

        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 mx-auto lg:mx-0">
            {/* Visual logo grid block */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-md shadow-primary/20 shrink-0">
              <TrendingUp size={16} strokeWidth={2.5} />
            </div>

            {/* Brand details - Hidden on tablet collapsed sidebar */}
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">
                Aura<span className="text-primary">CRM</span>
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
                Lite
              </span>
            </div>
          </div>

          {/* Close Sidebar Drawer Button (Mobile only) */}
          <button
            type="button"
            className="p-1.5 rounded-lg md:hidden hover:bg-slate-800 text-slate-400 hover:text-white focus:outline-hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sidebar NavLinks */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {/* Workspace label - Hidden on tablet collapsed sidebar */}
          <p className="hidden lg:block px-3.5 mb-2.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none">
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
                  `flex items-center justify-center lg:justify-start gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/10 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`
                }
                title={link.name}
              >
                <IconComponent size={18} strokeWidth={2} className="shrink-0" />

                {/* Text Labels - Hidden on tablet collapsed sidebar */}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-semibold text-xs leading-none">{link.name}</span>
                  <span className="text-[9px] text-slate-500 mt-1 font-medium group-hover:text-slate-400 leading-none truncate max-w-[150px]">
                    {link.subLabel}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-3 lg:p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-center lg:justify-between gap-3">
            {/* Profile Avatar */}
            <div className="relative w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 select-none shrink-0">
              JD
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-slate-900" />
            </div>

            {/* Profile Info - Hidden on tablet collapsed sidebar */}
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">John Doe</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">SaaS founder</p>
            </div>

            {/* Logout - Hidden on tablet collapsed sidebar */}
            <button
              type="button"
              className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white focus:outline-hidden"
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
