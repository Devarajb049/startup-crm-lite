/**
 * Email Utility Service
 * Modified to disable all outbound email sending for privacy, security, and simplicity.
 * All email actions are logged to the console instead of being delivered.
 */

/**
 * Log message helper
 */
const logBlockedEmail = (type, toEmail, subject) => {
  console.log(`[Email Blocked] Type: ${type} | To: ${toEmail} | Subject: ${subject}`);
};

/**
 * Core helper function to mock sending an email.
 * 
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML message content
 */
export const sendEmail = async (toEmail, subject, htmlContent) => {
  logBlockedEmail('General Email', toEmail, subject);
};

/**
 * Sends a premium, responsive HTML email containing the generated OTP.
 * (MOCK - Deactivated)
 */
export const sendOtpEmail = async (toEmail, otp, purpose, name = '') => {
  logBlockedEmail('OTP Code', toEmail, `AuraCRM OTP: ${purpose}`);
};

/**
 * Sends a confirmation email after a successful password reset.
 * (MOCK - Deactivated)
 */
export const sendPasswordResetSuccessEmail = async (toEmail, name = '') => {
  logBlockedEmail('Password Reset Success', toEmail, 'AuraCRM: Password Changed Successfully');
};

/**
 * Sends a welcome/registration success email.
 * (MOCK - Deactivated)
 */
export const sendRegistrationSuccessEmail = async (toEmail, name = '') => {
  logBlockedEmail('Welcome Success', toEmail, 'Welcome to AuraCRM!');
};
