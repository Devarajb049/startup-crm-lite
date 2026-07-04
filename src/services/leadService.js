import api from './api';

/**
 * Fetch all leads for the authenticated session user, with optional filters and sorting parameters.
 *
 * @param {Object} [params] - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.search] - Search name, company, or email
 * @param {number} [params.page] - Page number (defaults to 1)
 * @param {number} [params.limit] - Max items per page (defaults to 20)
 * @param {string} [params.sortBy] - Sort column name
 * @param {string} [params.sortOrder] - Sort ordering ('asc' or 'desc')
 * @returns {Promise<Object>} API response data containing leads and pagination info
 */
export const getLeads = async (params) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Create a new lead.
 *
 * @param {Object} leadData - Lead attributes
 * @returns {Promise<Object>} API response data containing the new lead
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * Update an existing lead record.
 *
 * @param {string} id - Lead ID
 * @param {Object} leadData - Lead attributes to update
 * @returns {Promise<Object>} API response data containing the updated lead
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Update only the status of an existing lead record.
 *
 * @param {string} id - Lead ID
 * @param {string} status - New pipeline status stage
 * @returns {Promise<Object>} API response data containing the updated lead
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Delete a lead record.
 *
 * @param {string} id - Lead ID
 * @returns {Promise<Object>} API response data confirming deletion
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fetch overview stats and KPIs summary.
 *
 * @returns {Promise<Object>} API response data containing pipeline calculations
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * Fetch monthly lead counts and won statuses trends.
 *
 * @returns {Promise<Object>} API response data containing monthly aggregation charts
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};
