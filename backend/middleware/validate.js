import { validationResult } from 'express-validator';

/**
 * Validation middleware to handle express-validator schema checks.
 * Accepts validation chains, runs them in parallel, and returns standard
 * error payloads if failures are found.
 *
 * @param {Array} validations - Array of express-validator assertions
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation chains in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Gather errors from request context
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      }));

      // Return 400 with the exact requested layout
      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }

    // Call next middleware if checks pass
    next();
  };
};

export default validate;
