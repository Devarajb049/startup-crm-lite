import api from './api';

/**
 * Register a new user account.
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} The API response payload data
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

/**
 * Log in a user with credentials.
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} The API response payload containing the user object and JWT token
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Logs out the active user session. Clears tokens locally.
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
  localStorage.removeItem('startup-crm-auth-user');
};

/**
 * Retrieve the profile details of the currently authenticated session user.
 * 
 * @returns {Promise<Object>} The API response payload containing the user details
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * Update the user's profile details.
 * 
 * @param {Object} data - Profile updates payload (e.g. name, oldPassword, newPassword)
 * @returns {Promise<Object>} The API response payload containing the updated user details
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

/**
 * Log in a user with Google credentials ID token.
 * 
 * @param {string} idToken - The identity token from Google
 * @returns {Promise<Object>} The API response payload
 */
export const googleLogin = async (idToken) => {
  const response = await api.post('/api/auth/google-login', { idToken });
  return response.data;
};

/**
 * Verify OTP entered by the user.
 * 
 * @param {string} email - User's email
 * @param {string} otp - 6-digit numeric OTP
 * @param {string} purpose - 'register' or 'forgot'
 * @returns {Promise<Object>} The API response payload
 */
export const verifyOtp = async (email, otp, purpose) => {
  const response = await api.post('/api/auth/verify-otp', { email, otp, purpose });
  return response.data;
};

/**
 * Request password reset OTP code.
 * 
 * @param {string} email - User's email
 * @returns {Promise<Object>} The API response payload
 */
export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password using the received OTP code.
 * 
 * @param {string} email - User's email
 * @param {string} otp - 6-digit verification code
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} The API response payload
 */
export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
  return response.data;
};

/**
 * Resend code to user email respecting cooldowns and limits.
 * 
 * @param {string} email - User's email
 * @param {string} purpose - 'register' or 'forgot'
 * @returns {Promise<Object>} The API response payload
 */
export const resendOtp = async (email, purpose) => {
  const response = await api.post('/api/auth/resend-otp', { email, purpose });
  return response.data;
};
