import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { SOURCE_COLORS } from '../../constants/analyticsColors';
import { getLeadSourceStats } from '../../utils/analyticsHelpers';

/**
 * LeadSourceChart Component
 * Displays a horizontal bar chart illustrating lead counts by channel source, sorted descending.
 */
const LeadSourceChart = ({ leads }) => {
  const chartData = useMemo(() => getLeadSourceStats(leads), [leads]);

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Acquisition Channels
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Breakdown of opportunities by original lead generation channel.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 w-full">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={chartData} 
              margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E293B" className="hidden dark:block" />
              
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
              
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-xl shadow-lg text-white text-xs space-y-0.5">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-blue-400 font-semibold">{data.value} Leads</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                maxBarSize={20} 
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SOURCE_COLORS[entry.name] || '#64748B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">
            No channel source metrics found.
          </div>
        )}
      </div>

    </div>
  );
};

export default LeadSourceChart;
