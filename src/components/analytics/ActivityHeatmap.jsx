import React, { useMemo } from 'react';
import { getActivityHeatmapData } from '../../utils/analyticsHelpers';
import { CalendarRange } from 'lucide-react';

// Color classes based on activity count (shades of green)
const getActivityColor = (count) => {
  if (count === 0) return 'bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/20 text-slate-400 dark:text-slate-500';
  if (count <= 2) return 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200/20';
  if (count <= 4) return 'bg-green-300 dark:bg-green-800/60 text-green-900 dark:text-green-300 hover:bg-green-400 dark:hover:bg-green-700/70 border border-green-400/20';
  if (count <= 7) return 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500 border border-green-600/20';
  return 'bg-green-700 dark:bg-green-400 text-white dark:text-slate-900 hover:bg-green-800 dark:hover:bg-green-300 border border-green-800/20';
};

/**
 * ActivityHeatmap Component
 * Renders a GitHub-style 30-day grid representing daily CRM activity volume.
 */
const ActivityHeatmap = ({ leads }) => {
  const heatmapData = useMemo(() => getActivityHeatmapData(leads), [leads]);

  // Compute stats
  const stats = useMemo(() => {
    const totalActivities = heatmapData.reduce((sum, d) => sum + d.count, 0);
    const activeDays = heatmapData.filter((d) => d.count > 0).length;
    const peakActivity = Math.max(...heatmapData.map((d) => d.count), 0);
    
    return {
      totalActivities,
      activeDays,
      peakActivity
    };
  }, [heatmapData]);

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Daily Sales Activity Grid
          </h3>
          <div className="p-2 bg-slate-50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-150 dark:border-slate-800">
            <CalendarRange size={16} />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Visual contribution grid showing sales team workflow touchpoints over the last 30 days.
        </p>
      </div>

      {/* Grid Container */}
      <div className="space-y-4">
        
        {/* Heatmap blocks */}
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${getActivityColor(day.count)} transition-all duration-150 flex items-center justify-center text-[10px] font-bold cursor-pointer relative group`}
            >
              {day.dayLabel}

              {/* High-fidelity CSS Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-40 p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white text-[10px] rounded-xl shadow-lg pointer-events-none text-center animate-fade-in leading-relaxed">
                <p className="font-extrabold text-blue-400">{day.monthLabel} {day.dayLabel}, 2026</p>
                <p className="mt-0.5 text-slate-300">{day.count} activities logged</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-950 border-r border-b border-slate-800 rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* Legend / Key */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-450 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800/50" />
            <span className="w-2.5 h-2.5 rounded bg-green-100 dark:bg-green-950/40" />
            <span className="w-2.5 h-2.5 rounded bg-green-300 dark:bg-green-800/60" />
            <span className="w-2.5 h-2.5 rounded bg-green-500 dark:bg-green-600" />
            <span className="w-2.5 h-2.5 rounded bg-green-700 dark:bg-green-400" />
            <span>More</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-400">
            {stats.activeDays}/30 Active Days ({stats.totalActivities} Touchpoints)
          </span>
        </div>

      </div>

    </div>
  );
};

export default ActivityHeatmap;
