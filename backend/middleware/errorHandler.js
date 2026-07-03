import { errorResponse } from '../utils/apiResponse.js';

/**
 * Centrally manages unhandled Express execution pipeline exceptions.
 */
export const errorHandler = (err, req, res, next) => {
  // Log full trace locally for diagnostic review
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
  }

  // Return standard error payload formatting
  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};
