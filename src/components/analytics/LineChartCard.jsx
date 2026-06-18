import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getConversionByMonth } from '../../utils/analyticsHelpers';

/**
 * @typedef {Object} Lead
 * @property {string} status - Pipeline status
 * @property {string} createdAt - Date timestamp
 */

/**
 * @typedef {Object} LineChartCardProps
 * @property {Lead[]} leads - List of opportunities to aggregate
 */

/**
 * LineChartCard Component
 * Displays a Recharts Line chart plotting pipeline win conversion rates (Won / Total)
 * by month over the past 6 months in a success green color.
 * 
 * @param {LineChartCardProps} props
 */
const LineChartCard = ({ leads }) => {
  const chartData = getConversionByMonth(leads);

  return (
    <div className="p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs flex flex-col justify-between">
      
      {/* Chart Headers */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Win Rate Conversion Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Ratio of won opportunities over total opportunities registered by month.
        </p>
      </div>

      {/* Line Chart Canvas */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Grid grids */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />
            
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]} 
              tickFormatter={(val) => `${val}%`} 
            />
            
            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-lg shadow-lg text-white text-[11px]">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-success mt-0.5">Win Rate: {payload[0].value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Success green line */}
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#22C55E" 
              strokeWidth={3} 
              dot={{ r: 4, stroke: '#22C55E', strokeWidth: 2, fill: '#FFFFFF' }}
              activeDot={{ r: 6 }} 
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default LineChartCard;
