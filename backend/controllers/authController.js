import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendOtpEmail } from '../utils/email.js';

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

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Hash OTP & Password
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upsert the OTP document
    await Otp.findOneAndUpdate(
      { email, purpose: 'register' },
      {
        otp: hashedOtp,
        otpExpires,
        attempts: 0,
        registrationData: { name, password: hashedPassword },
        lastResendTime: new Date(),
      },
      { upsert: true, new: true }
    );

    // Send email
    try {
      await sendOtpEmail(email, otpCode, 'register', name);
    } catch (err) {
      console.error('Failed to send OTP email:', err);
      return errorResponse(res, 'Failed to send verification email. Please check your email credentials.', 500);
    }

    return successResponse(
      res,
      { email },
      'Verification code sent successfully. Please check your inbox.',
      200
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
  const { email, otp, purpose } = req.body;

  if (!email || !otp || !purpose) {
    return errorResponse(res, 'Email, OTP, and purpose are required', 400);
  }

  try {
    const record = await Otp.findOne({ email, purpose });
    if (!record) {
      return errorResponse(res, 'No verification code found or session expired', 404);
    }

    // Check expiry
    if (record.otpExpires < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return errorResponse(res, 'Verification code has expired. Please request a new one.', 400);
    }

    // Check attempts limit
    if (record.attempts >= 3) {
      await Otp.deleteOne({ _id: record._id });
      return errorResponse(res, 'Too many incorrect attempts. Please request a new code.', 400);
    }

    // Increment attempts
    record.attempts += 1;
    await record.save();

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return errorResponse(res, `Invalid verification code. ${3 - record.attempts} attempts remaining.`, 400);
    }

    // Successful Verification
    if (purpose === 'register') {
      // Create user
      const user = await User.create({
        name: record.registrationData.name,
        email: record.email,
        password: record.registrationData.password,
      });

      // Delete OTP document
      await Otp.deleteOne({ _id: record._id });

      // Generate session token
      const token = generateToken(user._id);

      return successResponse(
        res,
        { token, user },
        'Account verified and activated successfully!',
        200
      );
    } else {
      return successResponse(
        res,
        { email, otpValidated: true },
        'Code verified successfully. You may now reset your password.',
        200
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handle password reset request - generates OTP and emails it.
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, 'Email is required', 400);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'No account exists with this email address.', 404);
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Hash OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Save/update OTP document
    await Otp.findOneAndUpdate(
      { email, purpose: 'forgot' },
      {
        otp: hashedOtp,
        otpExpires,
        attempts: 0,
        lastResendTime: new Date(),
      },
      { upsert: true, new: true }
    );

    // Send email
    try {
      await sendOtpEmail(email, otpCode, 'forgot', user.name);
    } catch (err) {
      console.error('Failed to send reset OTP email:', err);
      return errorResponse(res, 'Failed to send reset email. Please check server email configurations.', 500);
    }

    return successResponse(
      res,
      { email },
      'Reset verification code sent successfully.',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Validates OTP and updates User password.
 */
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return errorResponse(res, 'Email, OTP, and new password are required', 400);
  }

  try {
    const record = await Otp.findOne({ email, purpose: 'forgot' });
    if (!record) {
      return errorResponse(res, 'No verification code found or session expired', 404);
    }

    // Validate Expiry
    if (record.otpExpires < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return errorResponse(res, 'Verification code has expired. Please request a new one.', 400);
    }

    // Check attempts limit
    if (record.attempts >= 3) {
      await Otp.deleteOne({ _id: record._id });
      return errorResponse(res, 'Too many incorrect attempts. Please request a new code.', 400);
    }

    // Increment attempts
    record.attempts += 1;
    await record.save();

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return errorResponse(res, `Invalid verification code. ${3 - record.attempts} attempts remaining.`, 400);
    }

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update password (triggers hashing automatically on pre-save)
    user.password = newPassword;
    await user.save();

    // Delete OTP document
    await Otp.deleteOne({ _id: record._id });

    return successResponse(
      res,
      null,
      'Password reset successful. You can now login with your new password.',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Resends a new OTP to the specified email, respecting cooldowns and rate limits.
 */
export const resendOtp = async (req, res, next) => {
  const { email, purpose } = req.body;

  if (!email || !purpose) {
    return errorResponse(res, 'Email and purpose are required', 400);
  }

  try {
    const record = await Otp.findOne({ email, purpose });
    if (!record) {
      return errorResponse(res, 'No active OTP session found. Please register or request reset again.', 404);
    }

    // 1. Check 60-second cooldown
    const resendDelay = parseInt(process.env.OTP_RESEND_DELAY) || 60;
    const secondsElapsed = Math.floor((Date.now() - new Date(record.lastResendTime).getTime()) / 1000);
    if (secondsElapsed < resendDelay) {
      return errorResponse(res, `Please wait ${resendDelay - secondsElapsed} seconds before requesting another code.`, 400);
    }

    // 2. Check Hourly limit (5 resends per hour)
    if (record.resendCount >= 5) {
      const oneHour = 60 * 60 * 1000;
      const timeSinceFirstResend = Date.now() - new Date(record.lastResendTime).getTime();
      if (timeSinceFirstResend < oneHour) {
        return errorResponse(res, 'Resend limit reached (maximum 5 requests per hour). Please try again later.', 429);
      }
      // Reset resend count if more than 1 hour passed
      record.resendCount = 0;
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Hash new OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Get name for email template if available
    let name = '';
    if (purpose === 'register') {
      name = record.registrationData?.name || '';
    } else {
      const user = await User.findOne({ email });
      name = user ? user.name : '';
    }

    // Update document
    record.otp = hashedOtp;
    record.otpExpires = otpExpires;
    record.attempts = 0;
    record.resendCount += 1;
    record.lastResendTime = new Date();
    await record.save();

    // Send email
    try {
      await sendOtpEmail(email, otpCode, purpose, name);
    } catch (err) {
      console.error('Failed to send resend OTP email:', err);
      return errorResponse(res, 'Failed to send verification email. Please check server email config.', 500);
    }

    return successResponse(
      res,
      { email },
      'A new verification code has been sent successfully.',
      200
    );
  } catch (error) {
    next(error);
  }
};
