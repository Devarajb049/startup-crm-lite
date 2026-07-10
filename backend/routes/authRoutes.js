import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  googleLogin,
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

export default router;
