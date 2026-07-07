import { useMemo } from 'react';

// Static constants lifted outside of the render cycle
const STAGES = ['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

// Tailwind BG color variants for horizontal segment bar
const STAGE_COLORS = {
  'New': 'bg-slate-400 dark:bg-slate-500',
  'Contacted': 'bg-warning',
  'Qualified': 'bg-purple-500',
  'Meeting Scheduled': 'bg-indigo-500',
  'Proposal Sent': 'bg-primary',
  'Negotiation': 'bg-pink-500',
  'Won': 'bg-success',
  'Lost': 'bg-danger'
};

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique lead identifier
 * @property {string} name - Contact person's name
 * @property {string} company - Organization name
 * @property {number} value - Financial opportunity value in USD
 * @property {string} stage - Active pipeline status (e.g. New, Contacted, Proposal, Won, Lost)
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - List of leads in active workspace
 */

/**
 * PipelineOverview Component
 * Renders a segmented horizontal progress bar representing lead statuses.
 * Underneath the bar, a status legend shows lead counts, percentages, and dollar values.
 * 
 * @param {PipelineOverviewProps} props
 */
const PipelineOverview = ({ leads }) => {
  const totalLeads = leads.length;

  // Aggregate stats across all stages
  const stageStats = useMemo(() => {
    return STAGES.map((stage) => {
      const stageLeads = leads.filter((l) => l.status === stage);
      const value = stageLeads.reduce((sum, l) => sum + l.value, 0);
      const percentage = totalLeads > 0 ? (stageLeads.length / totalLeads) * 100 : 0;
      return {
        name: stage,
        count: stageLeads.length,
        value,
        percentage
      };
    });
  }, [leads, totalLeads]);

  // Formatting utility for currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-200/40 dark:border-white/5 shadow-xs">
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        Pipeline Segment Summary
      </h3>
      <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1 mb-5 leading-relaxed">
        Visual representation of active opportunities across pipeline stages.
      </p>

      {totalLeads > 0 ? (
        <div className="space-y-5">
          {/* Horizontal Progress Bar representing percentages of each stage */}
          <div className="h-3 w-full flex rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
            {stageStats.map((stat) => {
              if (stat.count === 0) return null;
              return (
                <div
                  key={stat.name}
                  style={{ width: `${stat.percentage}%` }}
                  className={`${STAGE_COLORS[stat.name]} h-full transition-opacity duration-150 hover:opacity-95`}
                  title={`${stat.name}: ${stat.count} leads (${Math.round(stat.percentage)}%)`}
                />
              );
            })}
          </div>

          {/* Sub-grid listing stage count details and cumulative values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 pt-1">
            {stageStats.map((stat) => {
              return (
                <div key={stat.name} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[stat.name]}`} />
                    <span className="text-slate-700 dark:text-slate-350 truncate">{stat.name}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white pl-3.5">
                    {stat.count} <span className="text-[10px] text-slate-400 font-medium">({Math.round(stat.percentage)}%)</span>
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 pl-3.5 font-bold">
                    {formatCurrency(stat.value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            No opportunities registered in current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PipelineOverview;
