import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate a JSON Web Token (JWT) for a authenticated user.
 * 
 * @param {string} userId - User document ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Register a new user account.
 * Checks for existing emails, creates user document, generates authentication JWT,
 * and returns success code 201 with signed payload (excluding password).
 * 
 * PRODUCTION TIP: Wire up express-rate-limit middleware on this endpoint to block registration spam.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists', 400);
    }

    // Create new User instance (password auto-hashed on save hook)
    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    // Format user payload excluding password (handled by User.toJSON custom schema method)
    return successResponse(
      res,
      { token, user },
      'User registered successfully',
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
 * PRODUCTION TIP: Wire up express-rate-limit middleware on this login endpoint to prevent brute-force attacks.
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

    const token = generateToken(user._id);

    // Format user payload (toJSON handles password exclusion)
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
    // Find user by ID and select password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update name only
    if (name) {
      user.name = name;
    }

    // Handle password update flow
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to change password', 400);
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid old password', 401);
      }

      user.password = newPassword;
    }

    // Save user document (triggers validation and pre-save password hash)
    await user.save();

    // Retrieve updated record without password for response
    const updatedUser = await User.findById(user._id);

    return successResponse(
      res,
      updatedUser,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};
