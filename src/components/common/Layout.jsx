import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3 } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AddLeadModal from '../leads/AddLeadModal';

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
  // Mobile sidebar drawer display toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Add Lead modal toggle state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Toggle handlers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openAddLeadModal = () => setIsAddLeadOpen(true);
  const closeAddLeadModal = () => setIsAddLeadOpen(false);

  // Bottom Navigation links definition for Mobile viewports
  const bottomNavLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen flex bg-bg dark:bg-brand-dark transition-colors duration-200">
      
      {/* 1. Left Sidebar (tablet + desktop) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col md:pl-20 lg:pl-64 min-w-0 pb-16 md:pb-0">
        
        {/* Top Header Navigation Toolbar */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          onOpenAddLead={openAddLeadModal} 
        />

        {/* Content canvas with dynamic view entrance animation */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in focus:outline-hidden">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-card-dark border-t border-slate-200 dark:border-border-dark flex items-center justify-around z-40 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors">
        {bottomNavLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90 ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-primary' 
                    : 'text-slate-400 hover:text-slate-650 dark:text-slate-500'
                }`
              }
              aria-label={link.name}
            >
              <Icon size={20} strokeWidth={2} />
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
