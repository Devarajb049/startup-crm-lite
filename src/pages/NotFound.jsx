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
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto px-4 text-center py-10 overflow-hidden">
      
      {/* Floating background glowing mesh elements - fixed to fill full viewport */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-primary/6 dark:bg-primary/4 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-emerald-500/6 dark:bg-emerald-500/4 blur-3xl animate-float-reverse" />
        <div className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-pink-500/6 dark:bg-pink-500/4 blur-3xl animate-float-alternate" />
      </div>

      {/* 1. Large Aesthetic Radar & 404 Block */}
      <div className="relative w-full max-w-sm mx-auto mb-6 flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute w-44 h-44 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5 animate-float-slow" />
        <div className="absolute w-36 h-36 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5 animate-float-reverse" />
        
        {/* Radial graphic SVG */}
        <svg viewBox="0 0 200 120" className="w-full h-full text-slate-300 dark:text-slate-700 drop-shadow-xl select-none">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <style>{`
              @keyframes radar-spin-cw {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes radar-spin-ccw {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              .spin-radar-slow {
                transform-origin: 100px 60px;
                animation: radar-spin-cw 25s linear infinite;
              }
              .spin-radar-fast {
                transform-origin: 100px 60px;
                animation: radar-spin-ccw 15s linear infinite;
              }
              .spin-radar-inner {
                transform-origin: 100px 60px;
                animation: radar-spin-cw 10s linear infinite;
              }
            `}</style>
          </defs>
          
          {/* Group 1: Outer Radar circle & nodes (Clockwise slow) */}
          <g className="spin-radar-slow">
            <circle cx="100" cy="60" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" fill="none" />
            <circle cx="65" cy="30" r="3" fill="#3B82F6" className="animate-pulse" />
          </g>
          
          {/* Group 2: Middle Radar circle & nodes (Counter-clockwise fast) */}
          <g className="spin-radar-fast">
            <circle cx="100" cy="60" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" fill="none" />
            <circle cx="135" cy="35" r="4" fill="#8B5CF6" className="animate-pulse" />
          </g>
          
          {/* Group 3: Inner Radar circle & nodes (Clockwise inner) */}
          <g className="spin-radar-inner">
            <circle cx="100" cy="60" r="20" stroke="currentColor" strokeWidth="0.75" opacity="0.5" fill="none" />
            <circle cx="118" cy="52" r="2" fill="#EC4899" className="animate-pulse" />
          </g>
          
          {/* Big Neon 404 Text */}
          <text x="100" y="70" textAnchor="middle" className="fill-[url(#glowGrad)] text-5xl font-extrabold tracking-widest font-mono select-none">
            404
          </text>
          
          {/* Extra orbital nodes that hover slowly */}
          <circle cx="140" cy="85" r="2.5" fill="#EC4899" className="animate-pulse animate-float-slow" />
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
              className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 hover:shadow-md rounded-2xl text-left cursor-pointer transition-all duration-200 focus:outline-hidden"
            >
              <div className={`p-2.5 w-fit rounded-xl border ${opt.color} transition-transform duration-200`}>
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
