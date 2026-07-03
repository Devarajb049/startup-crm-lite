/**
 * Sends a successful API response.
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response payload data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends an error API response.
 * @param {object} res - Express response object
 * @param {string} message - Error explanation message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Validation errors or stack trace details
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
