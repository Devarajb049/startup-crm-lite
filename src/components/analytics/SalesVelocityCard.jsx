import React, { useMemo } from 'react';
import { useLeads } from '../../context/LeadContext';
import { getSalesVelocity } from '../../utils/analyticsHelpers';
import { Zap, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

/**
 * SalesVelocityCard Component
 * Displays the calculated sales velocity (money flowing through pipeline per day).
 * Formula: (Opportunities * Win Rate * Avg Deal Size) / Sales Cycle Length
 */
const SalesVelocityCard = ({ leads: filteredLeads, filterRange }) => {
  const { leads: allLeads, formatCurrency } = useLeads();
  const current = useMemo(() => getSalesVelocity(filteredLeads), [filteredLeads]);

  // Calculate previous period sales velocity for comparison
  const comparison = useMemo(() => {
    if (!Array.isArray(allLeads) || allLeads.length === 0) return { change: 0, isPositive: true };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let rangeDays = 30;
    if (filterRange === 'Last 7 Days') rangeDays = 7;
    else if (filterRange === 'Last 90 Days') rangeDays = 90;
    else if (filterRange === 'This Year') rangeDays = 365;
    else if (filterRange === 'Custom Range') rangeDays = 30;

    const currentPeriodStart = new Date(today);
    currentPeriodStart.setDate(today.getDate() - rangeDays);

    const prevPeriodStart = new Date(today);
    prevPeriodStart.setDate(today.getDate() - (rangeDays * 2));

    const prevLeads = allLeads.filter((lead) => {
      const createdStr = lead.createdAt || lead.date;
      if (!createdStr) return false;
      const createdDate = new Date(createdStr);
      return createdDate >= prevPeriodStart && createdDate < currentPeriodStart;
    });

    const prev = getSalesVelocity(prevLeads);
    
    const diff = current.velocity - prev.velocity;
    const change = prev.velocity > 0 ? Math.round((diff / prev.velocity) * 100) : 0;

    return {
      change,
      isPositive: diff >= 0,
      prevVelocity: prev.velocity
    };
  }, [allLeads, filterRange, current.velocity]);

  return (
    <div className="p-6 glass-card border border-border/40 dark:border-border/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Sales Velocity Widget
          </h3>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-warning rounded-xl">
            <Zap size={16} />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Estimated revenue flowing through your sales funnel daily.
        </p>
      </div>

      {/* Primary Value */}
      <div className="my-3 py-1 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
          Current Sales Velocity
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(current.velocity)}
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-450 font-semibold">/day</span>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          {comparison.change !== 0 ? (
            <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
              comparison.isPositive 
                ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' 
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
            }`}>
              {comparison.isPositive ? '+' : ''}
              {comparison.change}%
              {comparison.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950/40 px-1.5 py-0.5 rounded">
              0% change
            </span>
          )}
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            vs previous period
          </span>
        </div>
      </div>

      {/* Formula Variables Breakdown */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Info size={11} /> Formula Variables
        </p>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 bg-slate-100/50 dark:bg-slate-950/20 border border-border/40 dark:border-border/10 rounded-lg">
            <span className="text-slate-400 dark:text-slate-500 block">Opportunities</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{current.opportunities} Deals</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-950/20 border border-border/40 dark:border-border/10 rounded-lg">
            <span className="text-slate-400 dark:text-slate-500 block">Conversion Win Rate</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{current.winRate}%</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-950/20 border border-border/40 dark:border-border/10 rounded-lg">
            <span className="text-slate-400 dark:text-slate-500 block">Avg Deal Size</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(current.avgDealSize)}</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-950/20 border border-border/40 dark:border-border/10 rounded-lg">
            <span className="text-slate-400 dark:text-slate-500 block">Avg Sales Cycle</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{current.cycleLength} Days</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SalesVelocityCard;
