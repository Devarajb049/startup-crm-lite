import React, { useMemo } from 'react';
import { getTopPerformers } from '../../utils/analyticsHelpers';
import { Trophy, Medal, UserCheck } from 'lucide-react';

const formatRupee = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * TopPerformersCard Component
 * Displays a leaderboard ranking team reps by closed-won deal revenue.
 */
const TopPerformersCard = ({ leads }) => {
  const performers = useMemo(() => getTopPerformers(leads), [leads]);

  // Compute the max value to calculate proportional progress bars
  const maxRevenue = useMemo(() => {
    if (performers.length === 0) return 0;
    return Math.max(...performers.map((p) => p.value), 1);
  }, [performers]);

  // Total won revenue for the team
  const totalTeamRevenue = useMemo(() => {
    return performers.reduce((sum, p) => sum + p.value, 0);
  }, [performers]);

  const getMedalIcon = (rank) => {
    if (rank === 0) return <Trophy size={16} className="text-yellow-500" />;
    if (rank === 1) return <Medal size={16} className="text-slate-400" />;
    if (rank === 2) return <Medal size={16} className="text-amber-600" />;
    return <UserCheck size={14} className="text-slate-400" />;
  };

  return (
    <div className="p-6 glass-card border border-border/40 dark:border-border/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Top Performers Leaderboard
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Ranking sales representatives by closed won deal revenue.
        </p>
      </div>

      {/* Leaderboard Rows */}
      {performers.length > 0 ? (
        <div className="space-y-4">
          {performers.map((rep, idx) => {
            const pctOfMax = Math.round((rep.value / maxRevenue) * 100);
            const pctOfTotal = totalTeamRevenue > 0 ? Math.round((rep.value / totalTeamRevenue) * 100) : 0;
            
            return (
              <div key={rep.name} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-705 dark:text-slate-400 border border-slate-150 dark:border-slate-800">
                      {getMedalIcon(idx)}
                    </div>
                    <span className="font-extrabold text-slate-905 dark:text-white group-hover:text-primary transition-colors">
                      {rep.name}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatRupee(rep.value)}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-1.5 font-medium">
                      ({pctOfTotal}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 transition-all duration-500" 
                    style={{ width: `${pctOfMax}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-450 dark:text-slate-600 text-xs">
          No rep closures recorded for this period.
        </div>
      )}

    </div>
  );
};

export default TopPerformersCard;
