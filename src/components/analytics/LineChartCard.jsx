import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CHART_THEME } from '../../constants/analyticsColors';
import { getConversionByMonth } from '../../utils/analyticsHelpers';

/**
 * LineChartCard Component
 * Renders an animated, smooth line chart showing the monthly opportunity conversion trend (Won / Total).
 */
const LineChartCard = ({ leads }) => {
  const chartData = useMemo(() => getConversionByMonth(leads), [leads]);

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Monthly Conversion Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Ratio of won opportunities over total opportunities registered by month.
        </p>
      </div>

      {/* Line Chart Canvas */}
      <div className="h-52 w-full">
        {chartData && chartData.some(d => d.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-xl shadow-lg text-white text-xs space-y-0.5">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-green-455 font-semibold">Win Rate: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={CHART_THEME.success} 
                strokeWidth={3} 
                dot={{ r: 4, stroke: CHART_THEME.success, strokeWidth: 2, fill: '#FFFFFF' }}
                activeDot={{ r: 6 }} 
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">
            No conversion history available for this period.
          </div>
        )}
      </div>

    </div>
  );
};

export default LineChartCard;
