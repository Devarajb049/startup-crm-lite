import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { getStatusDistribution } from '../../utils/analyticsHelpers';

/**
 * PieChartCard Component
 * Displays a premium doughnut chart representing lead status distribution.
 * Supports active slice expansion on hover, custom tooltips, and a clean scrollable legend.
 */
const PieChartCard = ({ leads }) => {
  const chartData = useMemo(() => getStatusDistribution(leads), [leads]);
  const totalLeads = leads.length;
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Custom active shape to expand the hovered slice
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5} // Expand by 5px on hover
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Lead Status Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Proportional breakdown of opportunities in pipeline stages.
        </p>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Doughnut Chart Canvas */}
          <div className="h-48 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={66}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  isAnimationActive={true}
                >
                  {chartData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={STATUS_COLORS[entry.name] || '#94A3B8'} 
                      style={{ filter: activeIndex === chartData.indexOf(entry) ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' : 'none', transition: 'all 0.2s' }}
                    />
                  ))}
                </Pie>
                
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const segment = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 dark:bg-slate-950 border border-slate-800 rounded-xl shadow-lg text-white text-xs space-y-1">
                          <p className="font-bold">{segment.name}</p>
                          <p className="text-blue-400 font-semibold">{segment.value} Leads</p>
                          <p className="text-slate-350">{segment.percentage}% of total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered Summary Count */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalLeads}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Total Leads
              </span>
            </div>
          </div>

          {/* Color-coded Legend */}
          <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4 max-h-[150px] overflow-y-auto pr-1">
            {chartData.map((entry) => {
              const color = STATUS_COLORS[entry.name] || '#94A3B8';
              return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-600 dark:text-slate-400 font-bold truncate max-w-[140px]">{entry.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                    {entry.value} <span className="text-slate-450 dark:text-slate-500 font-medium">({entry.percentage}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-450 dark:text-slate-600 text-xs">
          No status distribution metrics found.
        </div>
      )}

    </div>
  );
};

export default PieChartCard;
