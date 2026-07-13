import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Analytics Component
 * Assembles the production-ready Sales Performance and Pipeline Analytics Dashboard.
 */
const Analytics = () => {
  const navigate = useNavigate();
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

  // Trigger brief loading animation on filter change to give high-fidelity feedback
  const handleFilterRangeChange = (range) => {
    setIsLoading(true);
    setFilterRange(range);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      
      {/* 1. Dashboard Page Header */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h2 className="text-xl font-extrabold text-slate-905 dark:text-white sm:text-2xl tracking-tight">
          Analytics Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track sales performance and growth trends.
        </p>
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
        <div className="space-y-6">
          
          {/* KPI summary section: 6 cards grid */}
          <StatsCards 
            leads={leads} 
            stats={stats} 
            filterRange={filterRange} 
          />

          {/* Row 1: Pie Chart & Funnel Chart (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartCard leads={leads} />
            <FunnelChartCard leads={leads} />
          </div>

          {/* Row 2: Monthly Lead Counts Bar & Monthly Conversion Trend Line (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChartCard leads={leads} />
            <LineChartCard leads={leads} />
          </div>

          {/* Row 3: Revenue Area Chart & Lead Source Horizontal Bar (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChartCard leads={leads} />
            <LeadSourceChart leads={leads} />
          </div>

          {/* Row 4: Heatmap & Top Performers rep list (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityHeatmap leads={leads} />
            <TopPerformersCard leads={leads} />
          </div>

          {/* Row 5: Revenue Forecast & Sales Velocity Widget (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
