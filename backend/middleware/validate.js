import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Validates request inputs against defined route schema constraints.
 * Halts pipeline if rules fail, returning validation failure payload.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Validation failed',
      400,
      errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    );
  }
  next();
};
