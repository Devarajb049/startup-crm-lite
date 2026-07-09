import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CHART_THEME } from '../../constants/analyticsColors';
import { getMonthlyLeads } from '../../utils/analyticsHelpers';

/**
 * BarChartCard Component
 * Displays monthly lead counts (last 6 months) using an animated bar graph.
 */
const BarChartCard = ({ leads }) => {
  const chartData = useMemo(() => getMonthlyLeads(leads), [leads]);

  return (
    <div className="p-6 glass-card border border-border/40 dark:border-border/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">

      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Monthly Leads Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Volume of new opportunities registered monthly over the last 6 months.
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 w-full">
        {chartData && chartData.some(d => d.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />

              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />

              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
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
                fill={CHART_THEME.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">
            No leads data found for this period.
          </div>
        )}
      </div>

    </div>
  );
};

export default BarChartCard;
