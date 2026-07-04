import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to protect routes by verifying the JSON Web Token (JWT).
 * Checks the Authorization header for 'Bearer <token>'.
 * Verifies token validity, expiration, and ensures the referenced user still exists.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header in 'Bearer <token>' format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token component from the header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return errorResponse(res, 'No token provided, access denied', 401);
      }

      // Verify token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user matching token subject payload (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return errorResponse(res, 'User belonging to this token no longer exists', 401);
      }

      // Attach resolved user instance to the request context
      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);

      // If token expired
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired, please login again', 401);
      }

      // If token invalid
      return errorResponse(res, 'Token is invalid', 401);
    }
  }

  // If token is missing completely
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }
};

export default protect;
