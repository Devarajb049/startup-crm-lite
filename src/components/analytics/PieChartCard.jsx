import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getStatusDistribution } from '../../utils/analyticsHelpers';

/**
 * @typedef {Object} Lead
 * @property {string} status - Pipeline status category
 * @property {number} value - Deal size value
 */

/**
 * @typedef {Object} PieChartCardProps
 * @property {Lead[]} leads - List of opportunities to aggregate
 */

/**
 * PieChartCard Component
 * Displays a Recharts Pie chart illustrating the proportion of opportunities in each pipeline status.
 * Underneath, renders a detailed color-coded legend showing lead counts and percentage shares.
 * 
 * @param {PieChartCardProps} props
 */
const PieChartCard = ({ leads }) => {
  const chartData = getStatusDistribution(leads);
  const totalLeads = leads.length;

  // Visual color codes for each pipeline stage as requested in specifications
  const COLOR_MAP = {
    'New': '#94A3B8',
    'Contacted': '#2563EB',
    'Meeting Scheduled': '#F59E0B',
    'Proposal Sent': '#7C3AED',
    'Won': '#22C55E',
    'Lost': '#EF4444'
  };

  return (
    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs flex flex-col justify-between">
      
      {/* Chart Headers */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Lead Status Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Proportional breakdown of leads in each stage.
        </p>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Pie chart container */}
          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={2.5}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLOR_MAP[entry.name] || '#94A3B8'} />
                  ))}
                </Pie>
                
                {/* Tooltip config */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const segment = payload[0].payload;
                      const segmentPct = totalLeads > 0 ? Math.round((segment.value / totalLeads) * 100) : 0;
                      return (
                        <div className="p-2.5 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-lg shadow-lg text-white text-[11px] space-y-0.5">
                          <p className="font-bold">{segment.name}</p>
                          <p className="text-blue-400">Leads: {segment.value} ({segmentPct}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary count overlay */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{totalLeads}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Total</span>
            </div>
          </div>

          {/* Color-coded Legend */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 max-h-[160px] overflow-y-auto pr-1">
            {chartData.map((entry) => {
              const itemPct = totalLeads > 0 ? Math.round((entry.value / totalLeads) * 100) : 0;
              return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLOR_MAP[entry.name] }} />
                    <span className="text-slate-600 dark:text-slate-400 font-semibold truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {entry.value} <span className="text-slate-400 dark:text-slate-500 font-normal">({itemPct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-xs">
          No segment distribution metrics found.
        </div>
      )}

    </div>
  );
};

export default PieChartCard;
