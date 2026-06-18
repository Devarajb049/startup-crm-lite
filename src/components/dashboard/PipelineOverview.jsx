import React from 'react';

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
  const stages = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  
  // Tailwind BG color variants for horizontal segment bar
  const stageColors = {
    'New': 'bg-slate-400 dark:bg-slate-500',
    'Contacted': 'bg-warning',
    'Meeting Scheduled': 'bg-indigo-500',
    'Proposal Sent': 'bg-primary',
    'Won': 'bg-success',
    'Lost': 'bg-danger'
  };

  const totalLeads = leads.length;

  // Aggregate stats across all stages
  const stageStats = stages.map((stage) => {
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

  // Formatting utility for currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="p-5 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs">
      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
        Pipeline Segment Summary
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
        Visual representation of active opportunities across pipeline stages.
      </p>

      {totalLeads > 0 ? (
        <div className="space-y-5">
          {/* Horizontal Progress Bar representing percentages of each stage */}
          <div className="h-4 w-full flex rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
            {stageStats.map((stat) => {
              if (stat.count === 0) return null;
              return (
                <div
                  key={stat.name}
                  style={{ width: `${stat.percentage}%` }}
                  className={`${stageColors[stat.name]} h-full transition-opacity duration-150 hover:opacity-90`}
                  title={`${stat.name}: ${stat.count} leads (${Math.round(stat.percentage)}%)`}
                />
              );
            })}
          </div>

          {/* Sub-grid listing stage count details and cumulative values */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
            {stageStats.map((stat) => {
              return (
                <div key={stat.name} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`w-2 h-2 rounded-full ${stageColors[stat.name]}`} />
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
