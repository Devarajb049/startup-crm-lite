import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, ArrowLeft, HelpCircle } from 'lucide-react';

/**
 * NotFound Component
 * Custom fallback view for invalid endpoints (404 Page).
 * Renders a premium, aesthetic, and helpful interface with options to navigate to key CRM zones.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const navOptions = [
    {
      title: 'Dashboard Overview',
      description: 'Check active metrics & pipeline status.',
      path: '/',
      icon: LayoutDashboard,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
    },
    {
      title: 'Leads Directory',
      description: 'View and manage opportunity records.',
      path: '/leads',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
    },
    {
      title: 'Sales Analytics',
      description: 'Review growth trends & forecasts.',
      path: '/analytics',
      icon: BarChart3,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto px-4 text-center py-10">
      
      {/* 1. Large Aesthetic Radar & 404 Block */}
      <div className="relative w-full max-w-sm mx-auto mb-6 flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute w-44 h-44 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute w-36 h-36 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5" />
        
        {/* Radial graphic SVG */}
        <svg viewBox="0 0 200 120" className="w-full h-full text-slate-300 dark:text-slate-700 drop-shadow-xl select-none">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          
          {/* Radar Circles */}
          <circle cx="100" cy="60" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" fill="none" />
          <circle cx="100" cy="60" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" fill="none" />
          <circle cx="100" cy="60" r="20" stroke="currentColor" strokeWidth="0.75" opacity="0.5" fill="none" />
          
          {/* Big Neon 404 Text */}
          <text x="100" y="70" textAnchor="middle" className="fill-[url(#glowGrad)] text-5xl font-extrabold tracking-widest font-mono select-none">
            404
          </text>
          
          {/* Orbital nodes */}
          <circle cx="65" cy="30" r="3" fill="#3B82F6" className="animate-pulse" />
          <circle cx="140" cy="85" r="2.5" fill="#EC4899" className="animate-pulse" />
          <circle cx="135" cy="35" r="4" fill="#8B5CF6" className="animate-pulse" />
        </svg>
      </div>

      {/* 2. Headline & Descriptions */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Lost in the Pipeline?
      </h2>
      <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
        The link you followed may be broken or the page might have been removed. Let's get you back on track.
      </p>

      {/* 3. Helper Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10">
        {navOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.path}
              type="button"
              onClick={() => navigate(opt.path)}
              className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 hover:shadow-md rounded-2xl text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus:outline-hidden"
            >
              <div className={`p-2.5 w-fit rounded-xl border ${opt.color} group-hover:scale-105 transition-transform duration-200`}>
                <Icon size={16} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-905 dark:text-white mt-4 group-hover:text-primary transition-colors">
                {opt.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* 4. Secondary Action (Back one step) */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white cursor-pointer transition-colors duration-150 focus:outline-hidden"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <a
          href="mailto:support@auracrm.com"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-655 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors duration-150"
        >
          <HelpCircle size={16} />
          <span>Contact Support</span>
        </a>
      </div>

    </div>
  );
};

export default NotFound;
