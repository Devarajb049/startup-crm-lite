import React, { useMemo } from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, Cell, Tooltip, LabelList } from 'recharts';
import { getFunnelData } from '../../utils/analyticsHelpers';

// Harmonious gradient colors for the funnel stages using design tokens
const FUNNEL_COLORS = ['var(--accent)', 'var(--primary)', 'var(--secondary)', 'var(--purple)', 'var(--success)'];

/**
 * FunnelChartCard Component
 * Displays a conversion funnel representing the sales pipeline milestones.
 * Includes absolute counts, stage conversion ratios, and drop-off percentages.
 */
const FunnelChartCard = ({ leads }) => {
  const chartData = useMemo(() => getFunnelData(leads), [leads]);

  // Compute conversion and drop-off rates for side list display
  const richFunnelData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    return chartData.map((item, idx) => {
      const prevItem = idx > 0 ? chartData[idx - 1] : null;
      
      // Conversion from the previous stage
      let stageConversion = 100;
      let dropOff = 0;
      
      if (prevItem && prevItem.value > 0) {
        stageConversion = Math.round((item.value / prevItem.value) * 100);
        dropOff = 100 - stageConversion;
      } else if (idx > 0) {
        stageConversion = 0;
        dropOff = 100;
      }

      return {
        ...item,
        stageConversion,
        dropOff,
        color: FUNNEL_COLORS[idx] || '#64748B'
      };
    });
  }, [chartData]);

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Sales Conversion Funnel
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Track stage conversion efficiency and funnel leakage.
        </p>
      </div>

      {chartData.length > 0 && chartData[0].value > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          
          {/* Recharts Funnel Visualizer (3/5 width on desktop) */}
          <div className="lg:col-span-3 h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-xl shadow-lg text-white text-xs space-y-1">
                          <p className="font-bold">{data.name} Stage</p>
                          <p className="text-blue-400 font-semibold">{data.value} Leads</p>
                          <p className="text-slate-350">{data.percentage}% overall conversion</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Funnel
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index] || '#64748B'} />
                  ))}
                  <LabelList 
                    position="right" 
                    fill="#94A3B8" 
                    stroke="none" 
                    dataKey="name" 
                    style={{ fontSize: '9px', fontWeight: 'bold', textAnchor: 'start' }} 
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Table (2/5 width on desktop) */}
          <div className="lg:col-span-2 space-y-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-4 lg:pt-0 lg:pl-5">
            {richFunnelData.map((item, idx) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-950 dark:text-white">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {item.value} <span className="text-slate-400 dark:text-slate-500 font-medium">({item.percentage}%)</span>
                  </span>
                </div>

                {/* Progress bar and drop-off indicator */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                  />
                </div>

                {/* Micro details */}
                {idx > 0 && (
                  <div className="flex items-center justify-between text-[9px] text-slate-450 dark:text-slate-500 font-medium">
                    <span>Conv: {item.stageConversion}% from prev</span>
                    <span className="text-rose-500 dark:text-rose-400">-{item.dropOff}% drop-off</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="py-16 text-center text-slate-450 dark:text-slate-600 text-xs">
          Add active leads to visualize your pipeline conversion.
        </div>
      )}

    </div>
  );
};

export default FunnelChartCard;
