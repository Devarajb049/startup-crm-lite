import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, LogOut, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AddLeadModal from '../leads/AddLeadModal';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../context/AuthContext';

/**
 * Layout Component
 * Coordinates the application shell.
 * - Left Sidebar: collapsed `w-20` on tablet, expanded `w-64` on desktop
 * - Top Navbar: title and action controls
 * - Bottom Bar: visible on mobile only, containing quick navigation tabs
 * - Main content container padding shifts based on active viewport margins
 * 
 * Props:
 * - children (React.ReactNode): Router pages inside the layout
 */
const Layout = ({ children }) => {
  const { logout } = useAuth();

  // Mobile sidebar drawer display toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persisted desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);

  // Add Lead modal toggle state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Toggle handlers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const openAddLeadModal = () => setIsAddLeadOpen(true);
  const closeAddLeadModal = () => setIsAddLeadOpen(false);

  // Bottom Navigation links definition for Mobile viewports
  const bottomNavLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon }
  ];

  return (
    <div className="h-screen flex bg-bg dark:bg-bg relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient background glows for glassmorphism mesh effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-650/8 blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 dark:bg-purple-650/6 blur-[150px] pointer-events-none animate-float-reverse" />
      <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-pink-500/3 dark:bg-pink-650/4 blur-[120px] pointer-events-none animate-float-alternate" />

      {/* 1. Left Sidebar (tablet + desktop) */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* 2. Main Page Container */}
      <div className={`flex-1 flex flex-col min-w-0 pb-16 md:pb-0 transition-all duration-250 ease-in-out relative z-10 ${isCollapsed ? 'md:pl-20 lg:pl-20' : 'md:pl-20 lg:pl-64'
        }`}>

        {/* Top Header Navigation Toolbar */}
        <Navbar
          onOpenAddLead={openAddLeadModal}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Content canvas with dynamic view entrance animation */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in focus:outline-hidden">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface/70 dark:bg-surface/75 backdrop-blur-xl border-t border-border/50 dark:border-border/10 flex items-center justify-around z-40 md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)] transition-colors">
        {bottomNavLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `w-11 h-11 flex items-center justify-center transition-all duration-155 active:scale-90 ${isActive
                  ? 'active text-primary border-b-[3px] border-b-primary rounded-none'
                  : 'text-slate-400 hover:text-slate-650 dark:text-slate-550'
                }`
              }
              aria-label={link.name}
            >
              <Icon size={19} strokeWidth={2} />
            </NavLink>
          );
        })}
      </nav>

      {/* 4. Global Add Lead Modal entry form */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={closeAddLeadModal}
      />

    </div>
  );
};

export default Layout;
