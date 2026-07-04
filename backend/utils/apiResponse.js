/**
 * Helper function to send a consistent success response.
 *
 * @param {Object} res - Express response object
 * @param {any} data - The payload data to be returned
 * @param {string} message - Optional summary or info message
 * @param {number} statusCode - HTTP status code (defaults to 200)
 * @returns {Object} JSON response
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper function to send a consistent error response.
 *
 * @param {Object} res - Express response object
 * @param {string} message - Error explanation message
 * @param {number} statusCode - HTTP status code (defaults to 500)
 * @param {any} errors - Additional details (like validation error objects or stack trace)
 * @returns {Object} JSON response
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Helper function to send a consistent paginated response.
 *
 * @param {Object} res - Express response object
 * @param {Array} data - Paginated data array
 * @param {number} total - Total records in database
 * @param {number} page - Current active page number
 * @param {number} limit - Maximum items allowed per page
 * @returns {Object} JSON response with pagination metadata
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
      pages: totalPages,
    },
  });
};
