/**
 * Analytics Utility Helpers for Startup CRM Lite
 * Contains pure, defensive, and memoizable functions for sales dashboard metrics.
 */

// Helper to get last 6 months names and keys (YYYY-MM)
const getLast6Months = () => {
  const months = [];
  const date = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ label, key, year: d.getFullYear(), monthIndex: d.getMonth() });
  }
  return months;
};

// Helper to parse date to YYYY-MM
const getYearMonthKey = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return null;
  }
};

/**
 * Lead Status Distribution for Doughnut Chart
 */
export const getStatusDistribution = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];
  
  const counts = {};
  leads.forEach((lead) => {
    const status = lead.status || 'New';
    counts[status] = (counts[status] || 0) + 1;
  });

  const total = leads.length;
  return Object.keys(counts).map((status) => ({
    name: status,
    value: counts[status],
    percentage: Math.round((counts[status] / total) * 100)
  }));
};

/**
 * Monthly Lead Registrations (Last 6 Months)
 */
export const getMonthlyLeads = (leads = []) => {
  const months = getLast6Months();
  if (!Array.isArray(leads)) return months.map(m => ({ name: m.label, value: 0 }));

  const counts = {};
  leads.forEach((lead) => {
    const key = getYearMonthKey(lead.createdAt || lead.date);
    if (key) {
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return months.map((m) => ({
    name: m.label,
    value: counts[m.key] || 0
  }));
};

/**
 * Monthly Conversion Rate Trend (Last 6 Months)
 */
export const getConversionByMonth = (leads = []) => {
  const months = getLast6Months();
  if (!Array.isArray(leads) || leads.length === 0) {
    return months.map(m => ({ name: m.label, value: 0 }));
  }

  return months.map((m) => {
    // Leads created in this month
    const createdInMonth = leads.filter((lead) => {
      const key = getYearMonthKey(lead.createdAt || lead.date);
      return key === m.key;
    });

    if (createdInMonth.length === 0) return { name: m.label, value: 0 };

    // Of those created in this month, how many are Won (or were won eventually)
    const wonInMonth = createdInMonth.filter((lead) => lead.status === 'Won');
    const rate = Math.round((wonInMonth.length / createdInMonth.length) * 100);

    return {
      name: m.label,
      value: rate
    };
  });
};

/**
 * Revenue by Month from Won deals (Last 6 Months)
 */
export const getRevenueByMonth = (leads = []) => {
  const months = getLast6Months();
  if (!Array.isArray(leads)) return months.map(m => ({ name: m.label, value: 0 }));

  const revenue = {};
  leads.forEach((lead) => {
    if (lead.status === 'Won') {
      const key = getYearMonthKey(lead.wonAt || lead.createdAt || lead.date);
      if (key) {
        revenue[key] = (revenue[key] || 0) + (Number(lead.value) || 0);
      }
    }
  });

  return months.map((m) => ({
    name: m.label,
    value: revenue[m.key] || 0
  }));
};

/**
 * Active Pipeline Value (Sum of active/non-closed deals)
 */
export const getPipelineValue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((lead) => lead.status !== 'Won' && lead.status !== 'Lost')
    .reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
};

/**
 * Total Won Revenue
 */
export const getWonRevenue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((lead) => lead.status === 'Won')
    .reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
};

/**
 * Average Sales Cycle length in days (wonAt - createdAt)
 */
export const getAverageSalesCycle = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  const wonLeads = leads.filter((lead) => lead.status === 'Won' && (lead.wonAt || lead.createdAt));
  
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let validCount = 0;

  wonLeads.forEach((lead) => {
    const end = new Date(lead.wonAt || lead.createdAt);
    const start = new Date(lead.createdAt || lead.date);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime >= 0) {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
      validCount++;
    }
  });

  return validCount > 0 ? Math.round(totalDays / validCount) : 0;
};

/**
 * Lost Rate (Lost Leads / Total Leads)
 */
export const getLostRate = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lostCount = leads.filter((lead) => lead.status === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

/**
 * Lead Source Stats (sorted descending)
 */
export const getLeadSourceStats = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const counts = {};
  
  leads.forEach((lead) => {
    const source = lead.source || 'Other';
    counts[source] = (counts[source] || 0) + 1;
  });

  return Object.keys(counts)
    .map((source) => ({
      name: source,
      value: counts[source]
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Stage Funnel Data
 */
export const getFunnelData = (leads = []) => {
  if (!Array.isArray(leads)) return [];

  // Funnel counts based on milestones reached
  let newCount = 0;
  let contactedCount = 0;
  let meetingCount = 0;
  let proposalCount = 0;
  let wonCount = 0;

  leads.forEach((lead) => {
    // Stage 1: New (all leads)
    newCount++;

    // Stage 2: Contacted
    if (lead.contactedAt || ['Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'].includes(lead.status)) {
      contactedCount++;
    }

    // Stage 3: Meeting
    if (lead.meetingAt || ['Meeting Scheduled', 'Proposal Sent', 'Won'].includes(lead.status)) {
      meetingCount++;
    }

    // Stage 4: Proposal
    if (lead.proposalAt || ['Proposal Sent', 'Won'].includes(lead.status)) {
      proposalCount++;
    }

    // Stage 5: Won
    if (lead.wonAt || lead.status === 'Won') {
      wonCount++;
    }
  });

  const stages = [
    { stage: 'New', count: newCount },
    { stage: 'Contacted', count: contactedCount },
    { stage: 'Meeting', count: meetingCount },
    { stage: 'Proposal', count: proposalCount },
    { stage: 'Won', count: wonCount }
  ];

  // Calculate conversion rates relative to the first stage (New)
  return stages.map((s) => {
    const pct = newCount > 0 ? Math.round((s.count / newCount) * 100) : 0;
    return {
      name: s.stage,
      value: s.count,
      percentage: pct
    };
  });
};

/**
 * Sales Velocity Widget Calculations
 * Formula: (Opps * WinRate * AvgDealSize) / SalesCycleLength
 */
export const getSalesVelocity = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return { velocity: 0, opportunities: 0, winRate: 0, avgDealSize: 0, cycleLength: 0 };
  }

  const opps = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'Won');
  const winRate = wonLeads.length / opps; // Decimal
  const totalValue = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const avgDealSize = totalValue / opps;
  
  const rawCycle = getAverageSalesCycle(leads);
  // Default to a realistic 14 days if 0, to avoid division by zero or unrealistic velocity
  const cycleLength = rawCycle > 0 ? rawCycle : 14;

  const velocity = (opps * winRate * avgDealSize) / cycleLength;

  return {
    velocity: Math.round(velocity),
    opportunities: opps,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    cycleLength
  };
};

/**
 * Revenue Forecast Next Month (based on average won revenue of last 6 months)
 */
export const getForecastRevenue = (leads = []) => {
  const monthlyRev = getRevenueByMonth(leads);
  const totalRev = monthlyRev.reduce((sum, m) => sum + m.value, 0);
  const avgMonthlyRev = Math.round(totalRev / 6);

  // Confidence score calculation: based on volume and consistency of leads
  let confidence = 75;
  if (leads.length > 50) confidence += 10;
  if (leads.length > 100) confidence += 5;
  
  // Calculate standard deviation of revenue to check consistency
  const mean = totalRev / 6;
  const variance = monthlyRev.reduce((sum, m) => sum + Math.pow(m.value - mean, 2), 0) / 6;
  const stdDev = Math.sqrt(variance);
  
  // If standard deviation is low relative to the mean, revenue is highly consistent
  if (mean > 0) {
    const cv = stdDev / mean; // coefficient of variation
    if (cv < 0.3) confidence += 10; // highly consistent
    else if (cv > 0.8) confidence -= 15; // highly volatile
  } else {
    confidence = 0;
  }

  // Cap confidence score between 10% and 95%
  confidence = Math.max(10, Math.min(95, confidence));

  // Growth trend indicator: compare last 2 months
  const lastMonthVal = monthlyRev[5]?.value || 0;
  const prevMonthVal = monthlyRev[4]?.value || 0;
  let growthTrend = 0;
  if (prevMonthVal > 0) {
    growthTrend = Math.round(((lastMonthVal - prevMonthVal) / prevMonthVal) * 100);
  }

  return {
    predictedRevenue: avgMonthlyRev,
    confidence,
    growthTrend
  };
};

/**
 * Top Performers rep leaderboard
 */
export const getTopPerformers = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const performance = {};

  leads.forEach((lead) => {
    if (lead.status === 'Won') {
      let rep = 'Unassigned';
      if (lead.owner) {
        if (typeof lead.owner === 'object' && lead.owner.name) {
          rep = lead.owner.name;
        } else {
          rep = lead.owner;
        }
      }
      performance[rep] = (performance[rep] || 0) + (Number(lead.value) || 0);
    }
  });

  return Object.keys(performance)
    .map((rep) => ({
      name: rep,
      value: performance[rep]
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Activity Heatmap Data (Activity counts for the last 30 days)
 */
export const getActivityHeatmapData = (leads = []) => {
  const data = [];
  const date = new Date();
  
  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Count activities for this day
    let count = 0;
    
    leads.forEach((lead) => {
      // 1. Lead Created
      const createdDate = (lead.createdAt || lead.date)?.split('T')[0];
      if (createdDate === dateStr) count++;

      // 2. Contacted
      if (lead.contactedAt) {
        const contactedDate = lead.contactedAt.split('T')[0];
        if (contactedDate === dateStr) count++;
      }

      // 3. Meeting
      if (lead.meetingAt) {
        const meetingDate = lead.meetingAt.split('T')[0];
        if (meetingDate === dateStr) count++;
      }

      // 4. Proposal
      if (lead.proposalAt) {
        const proposalDate = lead.proposalAt.split('T')[0];
        if (proposalDate === dateStr) count++;
      }

      // 5. Won
      if (lead.wonAt) {
        const wonDate = lead.wonAt.split('T')[0];
        if (wonDate === dateStr) count++;
      }
    });

    data.push({
      date: dateStr,
      count,
      dayLabel: d.getDate(),
      monthLabel: d.toLocaleString('default', { month: 'short' })
    });
  }

  return data;
};
