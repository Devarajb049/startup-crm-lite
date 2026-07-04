/**
 * Sends a consistent successful API response.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - Response payload data
 * @param {string} message - User-friendly success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} JSON response payload
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a consistent error API response.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - User-friendly error explanation message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Validation errors detail or error stack trace details
 * @returns {Object} JSON response payload
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a consistent paginated API response.
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array of paginated data items
 * @param {number} total - Total count of records in database matching query
 * @param {number} page - Current requested page number
 * @param {number} limit - Maximum number of records per page
 * @returns {Object} JSON response payload with pagination metadata
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: totalPages
    }
  });
};
