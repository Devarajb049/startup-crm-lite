import nodemailer from 'nodemailer';

/**
 * Sends a premium, responsive HTML email containing the generated OTP.
 * 
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit numeric OTP
 * @param {string} purpose - 'register' or 'forgot'
 * @param {string} name - Optional name of the user
 */
export const sendOtpEmail = async (toEmail, otp, purpose, name = '') => {
  const isRegister = purpose === 'register';
  const title = isRegister ? 'Email Verification' : 'Password Reset Request';
  const actionText = isRegister ? 'verify your email address' : 'reset your account password';

  // Configure transporter using environment values
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const welcomeMessage = isRegister
    ? `Welcome to AuraCRM${name ? `, ${name}` : ''}! Thank you for signing up. To complete your registration and activate your workspace, please use the verification code below.`
    : `Hello${name ? ` ${name}` : ''}, we received a request to reset your password for your AuraCRM account. Please use the verification code below to authorize this request.`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #ffffff;
            padding: 30px 40px 15px 40px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
          }
          .logo {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #0f172a;
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .logo-dot {
            color: #3b82f6;
          }
          .content {
            padding: 35px 40px;
            text-align: left;
          }
          h1 {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 0;
            margin-bottom: 16px;
            letter-spacing: -0.025em;
          }
          p {
            font-size: 13px;
            line-height: 1.6;
            color: #64748b;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .otp-card {
            background: #f1f5f9;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 900;
            letter-spacing: 0.15em;
            color: #3b82f6;
            margin: 0;
          }
          .expiry-notice {
            font-size: 11px;
            color: #ef4444;
            font-weight: 700;
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 24px 0;
          }
          .security-note {
            font-size: 11px;
            line-height: 1.5;
            color: #94a3b8;
            margin-bottom: 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px 40px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
          }
          .footer a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">
                Aura<span class="logo-dot">CRM</span>
              </div>
            </div>
            <div class="content">
              <h1>${title}</h1>
              <p>${welcomeMessage}</p>
              
              <div class="otp-card">
                <div class="otp-code">${otp}</div>
                <div class="expiry-notice">Valid for 5 minutes</div>
              </div>
              
              <p>Please enter this code on the application verification screen to ${actionText}.</p>
              
              <div class="divider"></div>
              
              <p class="security-note">
                <strong>Security Notice:</strong> If you did not request this email or create an account with AuraCRM, please ignore this message. Your email address remains secure.
              </p>
            </div>
            <div class="footer">
              &copy; 2026 AuraCRM Systems, Inc. All rights reserved.<br>
              Developed by <a href="https://bhojanapudevaraj.dev" target="_blank">Deva Raj Bhojanapu</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send the email
  await transporter.sendMail({
    from: `"AuraCRM Systems" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `[AuraCRM] ${title}`,
    html: htmlContent,
  });
};
