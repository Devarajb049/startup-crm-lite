import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import BarChartCard from '../components/analytics/BarChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import ForecastCard from '../components/analytics/ForecastCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

/**
 * Analytics Component
 * Assembles the production-ready Sales Performance and Pipeline Analytics Dashboard.
 */
const Analytics = () => {
  const navigate = useNavigate();

  useDocumentMetadata(
    'Analytics Engine | AuraCRM',
    'Evaluate leads distribution, customer conversion ratios, source ROI performance charts, and team pipeline statistics.'
  );
  const {
    filterRange,
    setFilterRange,
    customRange,
    setCustomRange,
    leads,
    stats
  } = useAnalytics();

  // Simulated transition loading state for polished skeleton pulse animation
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger brief loading animation on filter change to give high-fidelity feedback
  const handleFilterRangeChange = (range) => {
    setIsLoading(true);
    setFilterRange(range);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      toast.success('Analytics refreshed.');
    }, 450);
  };

  useEffect(() => {
    if (isLoading && !isRefreshing) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isRefreshing]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-8">
      
      {/* 1. Dashboard Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-905 dark:text-white sm:text-2xl tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track sales performance and growth trends.
          </p>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="p-2.5 rounded-xl border border-border/80 dark:border-border/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-surface dark:bg-card hover:bg-hover active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:pointer-events-none"
          title="Refresh analytics"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 2. Real-time Memoized Filters toolbar */}
      <AnalyticsFilters
        filterRange={filterRange}
        onFilterRangeChange={handleFilterRangeChange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />

      {/* 3. Loading, Empty, or Dashboard Canvas Presentation */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : stats.totalLeads > 0 ? (
        <div className="space-y-8">
          
          {/* KPI summary section: 6 cards grid */}
          <StatsCards 
            leads={leads} 
            stats={stats} 
            filterRange={filterRange} 
          />

          {/* 2-Column Responsive Dashboard Canvas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Row 1: Pie Chart & Funnel Chart */}
            <PieChartCard leads={leads} />
            <FunnelChartCard leads={leads} />

            {/* Row 2: Bar Chart & Line Chart */}
            <BarChartCard leads={leads} />
            <LineChartCard leads={leads} />

            {/* Row 3: Revenue & Lead Sources */}
            <RevenueChartCard leads={leads} />
            <LeadSourceChart leads={leads} />

            {/* Row 4: Heatmap & Top Performers */}
            <ActivityHeatmap leads={leads} />
            <TopPerformersCard leads={leads} />

            {/* Row 5: Forecast & Sales Velocity */}
            <ForecastCard leads={leads} />
            <SalesVelocityCard leads={leads} filterRange={filterRange} />

          </div>

        </div>
      ) : (
        /* Empty State Fallback */
        <EmptyAnalyticsState onAddLeadClick={() => navigate('/leads')} />
      )}

    </div>
  );
};

export default Analytics;
