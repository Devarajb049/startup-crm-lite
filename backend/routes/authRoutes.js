import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  googleLogin,
  verifyOtp,
  forgotPassword,
  resetPassword,
  resendOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * PRODUCTION NOTE:
 * You should add `express-rate-limit` middleware to the login and register routes
 * below in order to safeguard the authentication routes from brute force/DoS attacks.
 * Example:
 *   import rateLimit from 'express-rate-limit';
 *   const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
 *   router.post('/register', authLimiter, ...);
 */

// Validation rules for user registration
const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for OTP verification
const verifyOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must be numeric'),
  body('purpose')
    .isIn(['register', 'forgot'])
    .withMessage('Invalid OTP purpose'),
];

// Validation rules for forgot password
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
];

// Validation rules for reset password
const resetPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must be numeric'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// Validation rules for resending OTP
const resendOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('purpose')
    .isIn(['register', 'forgot'])
    .withMessage('Invalid OTP purpose'),
];

// 1. POST /api/auth/register - Register a new user
router.post('/register', validate(registerValidation), register);

// 2. POST /api/auth/login - User login authentication
router.post('/login', validate(loginValidation), login);

// 3. GET /api/auth/profile - Retrieve authenticated user's profile details
router.get('/profile', protect, getProfile);

// 4. PUT /api/auth/profile - Update authenticated user's profile details
router.put('/profile', protect, updateProfile);

// 5. POST /api/auth/logout - Logout user and clear session state (invalidated client-side)
router.post('/logout', protect, logout);

// 6. POST /api/auth/google-login - Google OAuth login endpoint
router.post('/google-login', googleLogin);

// 7. POST /api/auth/verify-otp - Verify Email or Forgot Password OTP
router.post('/verify-otp', validate(verifyOtpValidation), verifyOtp);

// 8. POST /api/auth/forgot-password - Request Forgot Password reset OTP
router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

// 9. POST /api/auth/reset-password - Verify OTP and Reset User Password
router.post('/reset-password', validate(resetPasswordValidation), resetPassword);

// 10. POST /api/auth/resend-otp - Resend new OTP respecting limits
router.post('/resend-otp', validate(resendOtpValidation), resendOtp);

export default router;
