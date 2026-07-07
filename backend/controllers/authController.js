import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate a JSON Web Token (JWT) for a user.
 * 
 * @param {string} userId - User database ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new user account.
 * Checks for existing emails, creates user document, generates authentication JWT,
 * and returns success code 201 with signed payload (excluding password).
 * 
 * PRODUCTION NOTE:
 * In a production environment, you should add `express-rate-limit` middleware
 * to this endpoint to prevent denial-of-service (DoS) or automated registration spam.
 * Example registration rate limiter:
 *   const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
 *   router.post('/register', registerLimiter, ...);
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      res,
      { token, user },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user credentials and return authentication JWT token.
 * Validates existence, verifies password, and checks active status.
 * 
 * PRODUCTION NOTE:
 * In a production environment, you should add `express-rate-limit` middleware
 * to this login endpoint to prevent brute-force attacks on user passwords.
 * Example login rate limiter:
 *   const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
 *   router.post('/login', loginLimiter, ...);
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email and explicitly select password field for validation
    const user = await User.findOne({ email }).select('+password');

    // Security best practice: Never tell the client whether email or password was wrong
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Compare input password with database hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Verify account active status
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Strip password from user payload
    const userObject = user.toJSON();

    return successResponse(
      res,
      { token, user: userObject },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile details of the currently authenticated user.
 * 
 * @param {Object} req - Express request object (contains req.user set by protect middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been attached by the protect middleware without the password field
    return successResponse(
      res,
      req.user,
      'User profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated user profile details.
 * Restricts updates to the 'name' field, and allows changing password
 * if old password matches current records.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateProfile = async (req, res, next) => {
  const { name, oldPassword, newPassword } = req.body;

  try {
    // Find user by ID and select password field to validate old password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Allow updating name only
    if (name) {
      user.name = name;
    }

    // Handle password update flow
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to change password', 400);
      }

      // Validate old password first
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid old password', 401);
      }

      // Update password field (triggers pre-save hook to hash password)
      user.password = newPassword;
    }

    // Save user document (triggers validation and password hashing if updated)
    await user.save();

    // Retrieve updated record without password for response
    const updatedUser = await User.findById(user._id).select('-password');

    return successResponse(
      res,
      updatedUser,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout the currently authenticated user.
 * Handled client-side by invalidating the token, but this endpoint provides a clean success response 
 * and can optionally be extended to clear token cookies or blacklist tokens.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const logout = async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logged out successfully. Token invalidated client-side.');
  } catch (error) {
    next(error);
  }
};
