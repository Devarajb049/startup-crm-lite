import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect routes by verifying the JSON Web Token.
 * Attaches user to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to req
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return errorResponse(res, 'Not authorized, user not found', 401);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return errorResponse(res, 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }
};
