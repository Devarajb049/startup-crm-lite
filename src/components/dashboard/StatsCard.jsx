import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The display label of the KPI metric
 * @property {string|number} value - The formatted main metric display number
 * @property {React.ComponentType} icon - Lucide React Icon component
 * @property {number} change - Percent difference vs last month (e.g. 8.2 or -3.5)
 * @property {'primary' | 'success' | 'warning' | 'danger'} color - Color variant identifier for icons
 */

/**
 * StatsCard Component
 * Displays a single key performance indicator (KPI) metric box.
 * Shows the metric label, the formatted large number, and a green/red percentage trend indicator.
 * 
 * @param {StatsCardProps} props
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  // Map our base color variants to Tailwind configuration classes
  const colorMap = {
    primary: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-primary',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-950/40',
      text: 'text-success',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-warning',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      text: 'text-danger',
    }
  };

  const themeClasses = colorMap[color] || colorMap.primary;
  const isPositive = change >= 0;

  return (
    <div className="p-5 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Top row: metric title & accent icon container */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${themeClasses.bg} ${themeClasses.text}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      
      {/* Big KPI Metric number */}
      <div className="mt-4">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {value}
        </h4>
      </div>

      {/* Percentage change trend block */}
      <div className="mt-2.5 flex items-center gap-1 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-bold ${
          isPositive ? 'text-success' : 'text-danger'
        }`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </span>
        <span className="text-slate-400 dark:text-slate-500 font-medium">
          vs last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
