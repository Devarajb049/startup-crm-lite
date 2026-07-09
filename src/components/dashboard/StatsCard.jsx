import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard Component
 * Displays a single key performance indicator (KPI) metric box.
 * Styles cards as custom Glassmorphism components with premium ambient accents.
 */
const StatsCard = ({ index = 0, title, value, icon: Icon, change }) => {
  const isPositive = change >= 0;

  // Curated premium color schemes for each card
  const colorSchemes = [
    {
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-605 dark:text-blue-400',
      glow: 'shadow-blue-500/2 dark:shadow-blue-500/5 border-blue-500/10 dark:border-blue-500/15',
    },
    {
      text: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-605 dark:text-purple-400',
      glow: 'shadow-purple-500/2 dark:shadow-purple-500/5 border-purple-500/10 dark:border-purple-500/15',
    },
    {
      text: 'text-amber-605 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-605 dark:text-amber-400',
      glow: 'shadow-amber-500/2 dark:shadow-amber-500/5 border-amber-500/10 dark:border-amber-500/15',
    },
    {
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-605 dark:text-emerald-400',
      glow: 'shadow-emerald-500/2 dark:shadow-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/15',
    },
  ];

  const theme = colorSchemes[index % colorSchemes.length];

  return (
    <div className={`p-6 rounded-2xl glass-card border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${theme.glow}`}>
      {/* Top row: metric title & accent icon container */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
          {title}
        </span>
        <div className={`p-2 rounded-xl transition-all duration-300 ${theme.iconBg}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Big KPI Metric number */}
      <div className="mt-4">
        <h4 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900 dark:text-white">
          {value}
        </h4>
      </div>
 
      {/* Percentage change trend block */}
      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
        <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {isPositive ? <TrendingUp size={13} strokeWidth={2.5} /> : <TrendingDown size={13} strokeWidth={2.5} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          vs last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
