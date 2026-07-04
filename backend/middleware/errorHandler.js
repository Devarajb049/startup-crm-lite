import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handler Middleware.
 * Handles validation, database key conflicts, token expiration, and database cast exceptions.
 * Ensures stack traces are never exposed in production environments.
 * 
 * @param {Error} err - Error object thrown in application pipeline
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Always log the stack trace locally on the server console for debugging
  console.error(err.stack || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = {};
    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
    // Create a aggregated message string for convenience
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }
  // 2. Mongoose CastError (e.g., invalid MongoDB ObjectId lookup)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. MongoDB Duplicate Key Error (e.g., non-unique index conflict)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
    // If the error contains specific keys, try to customize the message dynamically
    if (err.keyValue) {
      const duplicateField = Object.keys(err.keyValue)[0];
      const capitalizedField = duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1);
      message = `${capitalizedField} already exists`;
    }
  }
  // 4. JWT JsonWebTokenError (Signature validation failed)
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token, authorization denied';
  }
  // 5. JWT TokenExpiredError (Token expiration validation failed)
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired, please log in again';
  }

  // Include stack trace in development mode only
  const responsePayloadErrors = process.env.NODE_ENV === 'development'
    ? { stack: err.stack, details: errors }
    : errors;

  return errorResponse(res, message, statusCode, responsePayloadErrors);
};
