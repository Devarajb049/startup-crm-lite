import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendOtpEmail, sendPasswordResetSuccessEmail, sendRegistrationSuccessEmail } from '../utils/email.js';

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
 * Validates email availability, generates a 6-digit OTP, sends it via Gmail SMTP,
 * and stores pending details in the Otp collection without creating the active User.
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

    // Create user directly (hashing happens pre-save automatically)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send welcome email asynchronously
    sendRegistrationSuccessEmail(user.email, user.name).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    const userObject = user.toJSON();

    return successResponse(
      res,
      { token, user: userObject },
      'Registration successful!',
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

    // Send password change confirmation email asynchronously if updated
    if (newPassword) {
      sendPasswordResetSuccessEmail(user.email, user.name).catch((err) => {
        console.error('Failed to send password change success email for profile update:', err);
      });
    }

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

/**
 * Verify Google ID Token / Access Token and login or auto-create account.
 */
export const googleLogin = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return errorResponse(res, 'Google ID token is required', 400);
  }

  try {
    // 1. Verify token by calling Google TokenInfo endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) {
      return errorResponse(res, 'Invalid Google token signature', 400);
    }

    const payload = await response.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return errorResponse(res, 'Google account email not verified or missing', 400);
    }

    // Optional client ID check
    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return errorResponse(res, 'Google client identity mismatch', 400);
    }

    // 2. Locate or create user
    let user = await User.findOne({ email });

    if (user) {
      // Link Google Account if not linked yet
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.picture && picture) {
          user.picture = picture;
        }
        await user.save();
      }
    } else {
      // Create user
      user = await User.create({
        name,
        email,
        googleId,
        picture: picture || null
      });

      // Send welcome email asynchronously
      sendRegistrationSuccessEmail(user.email, user.name).catch((err) => {
        console.error('Failed to send Google registration welcome email:', err);
      });
    }

    // 3. Verify active status
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 4. Generate JWT
    const token = generateToken(user._id);
    const userObject = user.toJSON();

    return successResponse(
      res,
      { token, user: userObject },
      'Google Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP entered by the user.
 * Activates the pending registration account if correct, or validates for password reset.
 */
export const verifyOtp = async (req, res, next) => {
  return errorResponse(res, 'OTP verification is deprecated.', 400);
};

export const forgotPassword = async (req, res, next) => {
  return errorResponse(res, 'Password resets must be performed inside Profile Settings when logged in.', 400);
};

export const resetPassword = async (req, res, next) => {
  return errorResponse(res, 'Password resets must be performed inside Profile Settings when logged in.', 400);
};

export const resendOtp = async (req, res, next) => {
  return errorResponse(res, 'OTP verification is deprecated.', 400);
};
