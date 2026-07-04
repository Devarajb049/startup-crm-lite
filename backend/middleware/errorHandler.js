import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express centralized error-handling middleware.
 * Catch-all handler for errors occurring inside the application routing logic.
 *
 * @param {Error} err - Error object caught by Express
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Define default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // Log the actual error stack in the server console for debugging purposes
  console.error('Logged Error:', err);

  // 1. Handle Mongoose validation errors (e.g. schema checks fail)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};

    // Construct field-by-field error details map
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  // 2. Handle Mongoose CastError (e.g. invalid MongoDB ObjectId format)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. Handle MongoDB Duplicate Key Conflict (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }
  // 4. Handle JWT authorization verification issues
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
  }
  // 5. Handle all other unmapped errors
  else {
    // If status code was not explicitly set on the error, fallback to 500 "Server error"
    if (!err.statusCode) {
      statusCode = 500;
      message = 'Server error';
    }
  }

  // Format error payload: Include stack trace when process.env.NODE_ENV is 'development'
  let errorPayload;
  if (process.env.NODE_ENV === 'development') {
    errorPayload = {
      stack: err.stack,
      details: errors,
    };
  } else {
    errorPayload = errors;
  }

  // Respond using the API response helper
  return errorResponse(res, message, statusCode, errorPayload);
};
