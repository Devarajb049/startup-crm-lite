import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Higher-order middleware function to execute express-validator schema assertions.
 * Runs all validation checks in parallel and returns any gathered failures
 * under a structured error payload, or proceeds to the next route handler.
 * 
 * @param {Array} validations - Array of validation rules (e.g., body(), param(), query())
 * @returns {Function} Express middleware function (req, res, next)
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }));

      return errorResponse(res, 'Validation failed', 400, formattedErrors);
    }

    next();
  };
};
