/**
 * Analytics Utility Helper Functions for AuraCRM
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Lead identifier
 * @property {string} status - Pipeline stage status
 * @property {number} value - Deal size value
 * @property {string} createdAt - ISO timestamp when lead was created
 * @property {string} [date] - Calendar date fallback (YYYY-MM-DD)
 */

/**
 * Computes lead status categories count distribution for Pie charts.
 * 
 * @param {Lead[]} leads - Entire list of leads
 * @returns {Array<{ name: string, value: number }>} Array of segments
 */
export const getStatusDistribution = (leads) => {
  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  return statuses.map((status) => {
    const matchingLeads = leads.filter((l) => l.status === status);
    return {
      name: status,
      value: matchingLeads.length,
      revenue: matchingLeads.reduce((sum, l) => sum + l.value, 0)
    };
  }).filter((item) => item.value > 0);
};

/**
 * Groups lead registrations over the last 6 months for Bar charts.
 * 
 * @param {Lead[]} leads - Entire list of leads
 * @returns {Array<{ name: string, count: number }>} Array of monthly counts
 */
export const getMonthlyLeads = (leads) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const now = new Date();

  // Iterate back 6 months from the current calendar month
  for (let i = 5; i >= 0; i--) {
    const checkDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = checkDate.getMonth();
    const year = checkDate.getFullYear();

    const count = leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt || lead.date);
      return leadDate.getMonth() === monthIndex && leadDate.getFullYear() === year;
    }).length;

    result.push({
      name: monthNames[monthIndex],
      count
    });
  }

  return result;
};

/**
 * Calculates conversion rates (Won / Total) over the last 6 months for Line charts.
 * 
 * @param {Lead[]} leads - Entire list of leads
 * @returns {Array<{ name: string, rate: number }>} Array of monthly rates
 */
export const getConversionByMonth = (leads) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const now = new Date();

  // Iterate back 6 months from the current calendar month
  for (let i = 5; i >= 0; i--) {
    const checkDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = checkDate.getMonth();
    const year = checkDate.getFullYear();

    const monthlyLeads = leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt || lead.date);
      return leadDate.getMonth() === monthIndex && leadDate.getFullYear() === year;
    });

    const totalCount = monthlyLeads.length;
    const wonCount = monthlyLeads.filter((lead) => lead.status === 'Won').length;
    const rate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;

    result.push({
      name: monthNames[monthIndex],
      rate
    });
  }

  return result;
};
