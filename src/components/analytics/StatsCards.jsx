import React, { useMemo } from 'react';
import { useLeads } from '../../context/LeadContext';
import { Users, Percent, DollarSign, TrendingUp, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

/**
 * StatsCards Component
 * Renders the 6 key performance indicator cards at the top of the analytics dashboard.
 */
const StatsCards = ({ stats, filterRange }) => {
  const { leads: allLeads, formatCurrency, currency } = useLeads();

  // Compute previous period stats for growth comparisons
  const comparison = useMemo(() => {
    if (!Array.isArray(allLeads) || allLeads.length === 0) {
      return { totalLeadsChange: 0, convRateChange: 0, pipeChange: 0, revChange: 0 };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let rangeDays = 30;
    if (filterRange === 'Last 7 Days') rangeDays = 7;
    else if (filterRange === 'Last 90 Days') rangeDays = 90;
    else if (filterRange === 'This Year') rangeDays = 365;
    else if (filterRange === 'Custom Range') rangeDays = 30; // default fallback

    const currentPeriodStart = new Date(today);
    currentPeriodStart.setDate(today.getDate() - rangeDays);

    const prevPeriodStart = new Date(today);
    prevPeriodStart.setDate(today.getDate() - (rangeDays * 2));

    // Filter leads from previous period
    const prevLeads = allLeads.filter((lead) => {
      const createdStr = lead.createdAt || lead.date;
      if (!createdStr) return false;
      const createdDate = new Date(createdStr);
      return createdDate >= prevPeriodStart && createdDate < currentPeriodStart;
    });

    const prevTotal = prevLeads.length;
    const prevWon = prevLeads.filter((l) => l.status === 'Won').length;
    const prevConv = prevTotal > 0 ? Math.round((prevWon / prevTotal) * 100) : 0;
    
    const prevPipe = prevLeads
      .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
      
    const prevRev = prevLeads
      .filter((l) => l.status === 'Won')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    // Calculate percentage changes
    const getPctChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalLeadsChange: getPctChange(stats.totalLeads, prevTotal),
      convRateChange: stats.conversionRate - prevConv, // absolute change in percentage points
      pipeChange: getPctChange(stats.pipelineValue, prevPipe),
      revChange: getPctChange(stats.wonRevenue, prevRev)
    };
  }, [allLeads, stats, filterRange]);

  const cards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-500/10 dark:border-blue-500/15 shadow-blue-500/2 dark:shadow-blue-500/5',
      trend: comparison.totalLeadsChange,
      trendType: 'percentage',
      subtext: 'vs previous period'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Percent,
      color: 'green',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/10 dark:border-emerald-500/15 shadow-emerald-500/2 dark:shadow-emerald-500/5',
      trend: comparison.convRateChange,
      trendType: 'points',
      subtext: 'vs previous period'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: currency === '₹' ? IndianRupee : DollarSign,
      color: 'amber',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500/10 dark:border-amber-500/15 shadow-amber-500/2 dark:shadow-amber-500/5',
      trend: comparison.pipeChange,
      trendType: 'percentage',
      subtext: 'active opportunities'
    },
    {
      title: 'Won Revenue',
      value: formatCurrency(stats.wonRevenue),
      icon: TrendingUp,
      color: 'success-green',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/10 dark:border-emerald-500/15 shadow-emerald-500/2 dark:shadow-emerald-500/5',
      trend: comparison.revChange,
      trendType: 'percentage',
      subtext: 'closed won deals'
    },
    {
      title: 'Avg Sales Cycle',
      value: `${stats.averageSalesCycle} Days`,
      icon: Clock,
      color: 'purple',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500/10 dark:border-purple-500/15 shadow-purple-500/2 dark:shadow-purple-500/5',
      trend: stats.averageSalesCycle > 0 ? -8 : 0, // Mock improvement indicating shorter cycle
      trendType: 'percentage',
      subtext: 'createdAt to wonAt'
    },
    {
      title: 'Lost Rate',
      value: `${stats.lostRate}%`,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-500/10 dark:border-rose-500/15 shadow-rose-500/2 dark:shadow-rose-500/5',
      trend: stats.lostRate > 20 ? 5 : -5, // Warning indicators
      trendType: 'points',
      subtext: 'Lost / Total Leads'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = card.trend >= 0;
        // For Lost Rate and Sales Cycle, negative changes are actually good/favorable!
        const isFavorable = (card.title === 'Lost Rate' || card.title === 'Avg Sales Cycle') 
          ? !isPositive 
          : isPositive;

        return (
          <div
            key={idx}
            className={`p-5 glass-card border ${card.borderColor} rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-350 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} shrink-0`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </h4>

              {/* Trend Indicator */}
              <div className="flex items-center gap-1 mt-2.5">
                {card.trend !== 0 ? (
                  <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isFavorable 
                      ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' 
                      : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {isPositive ? '+' : ''}
                    {card.trend}
                    {card.trendType === 'percentage' ? '%' : '%p'}
                    {isPositive ? (
                      <ArrowUpRight size={10} className="ml-0.5" />
                    ) : (
                      <ArrowDownRight size={10} className="ml-0.5" />
                    )}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40 px-1.5 py-0.5 rounded">
                    0%
                  </span>
                )}
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium truncate select-none">
                  {card.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
