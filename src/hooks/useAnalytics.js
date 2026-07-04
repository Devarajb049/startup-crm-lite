import { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData
} from '../utils/analyticsHelpers';

/**
 * Custom Hook: useAnalytics
 * Manages date filters and aggregates leads database metrics.
 */
const useAnalytics = () => {
  const { leads } = useLeads();
  const [filterRange, setFilterRange] = useState('All Time');
  const [customRange, setCustomRange] = useState({ startDate: '', endDate: '' });

  // Filter leads based on selected date range
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];

    const now = new Date();
    // Normalize today to start of day for accurate calculation
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return leads.filter((lead) => {
      const createdStr = lead.createdAt || lead.date;
      if (!createdStr) {
        return filterRange === 'All Time';
      }

      const createdDate = new Date(createdStr);
      if (isNaN(createdDate.getTime())) {
        return filterRange === 'All Time';
      }

      switch (filterRange) {
        case 'Last 7 Days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return createdDate >= sevenDaysAgo;
        }
        case 'Last 30 Days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }
        case 'Last 90 Days': {
          const ninetyDaysAgo = new Date(today);
          ninetyDaysAgo.setDate(today.getDate() - 90);
          return createdDate >= ninetyDaysAgo;
        }
        case 'This Year': {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return createdDate >= startOfYear;
        }
        case 'Custom Range': {
          const { startDate, endDate } = customRange;
          if (!startDate) return true; // fallback if incomplete

          const start = new Date(startDate);
          // Set end date to end of the day
          const end = endDate ? new Date(endDate) : new Date();
          end.setHours(23, 59, 59, 999);

          return createdDate >= start && createdDate <= end;
        }
        default:
          return true;
      }
    });
  }, [leads, filterRange, customRange]);

  // Compute stats based on the filtered leads list
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const wonLeadsCount = filteredLeads.filter((l) => l.status === 'Won').length;

    const conversionRate = totalLeads > 0 ? Math.round((wonLeadsCount / totalLeads) * 100) : 0;
    const pipelineValue = getPipelineValue(filteredLeads);
    const wonRevenue = getWonRevenue(filteredLeads);
    const averageSalesCycle = getAverageSalesCycle(filteredLeads);
    const lostRate = getLostRate(filteredLeads);

    return {
      totalLeads,
      conversionRate,
      pipelineValue,
      wonRevenue,
      averageSalesCycle,
      lostRate
    };
  }, [filteredLeads]);

  // Compute trend metrics for comparison (e.g. for Sales Velocity)
  // We can calculate comparison metrics on the full/unfiltered leads list
  const totalStats = useMemo(() => {
    return {
      statusDistribution: getStatusDistribution(filteredLeads),
      monthlyLeads: getMonthlyLeads(filteredLeads),
      conversionTrend: getConversionByMonth(filteredLeads),
      revenueTrend: getRevenueByMonth(filteredLeads),
      leadSourceStats: getLeadSourceStats(filteredLeads),
      funnelData: getFunnelData(filteredLeads),
      salesVelocity: getSalesVelocity(filteredLeads),
      forecastRevenue: getForecastRevenue(filteredLeads),
      topPerformers: getTopPerformers(filteredLeads),
      activityHeatmapData: getActivityHeatmapData(filteredLeads)
    };
  }, [filteredLeads]);

  return {
    filterRange,
    setFilterRange,
    customRange,
    setCustomRange,
    leads: filteredLeads,
    stats,
    charts: totalStats
  };
};

export default useAnalytics;
