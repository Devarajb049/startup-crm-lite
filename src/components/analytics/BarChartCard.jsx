import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getMonthlyLeads } from '../../utils/analyticsHelpers';

/**
 * @typedef {Object} Lead
 * @property {string} createdAt - Date timestamp
 */

/**
 * @typedef {Object} BarChartCardProps
 * @property {Lead[]} leads - List of opportunities to aggregate
 */

/**
 * BarChartCard Component
 * Displays a Recharts Bar chart graphing the count of new leads registered per month
 * over the last 6 months in a blue bar chart.
 * 
 * @param {BarChartCardProps} props
 */
const BarChartCard = ({ leads }) => {
  const chartData = getMonthlyLeads(leads);

  return (
    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs flex flex-col justify-between">
      
      {/* Header labels */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Lead Acquisition Velocity
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Volume of new opportunities registered monthly over the last 6 months.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            {/* Grid grids */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />
            
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            
            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-lg shadow-lg text-white text-[11px]">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-blue-400 mt-0.5">Leads: {payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Single bar dataset */}
            <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={true} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default BarChartCard;
