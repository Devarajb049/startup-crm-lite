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

  // Send the email using unified sendEmail helper
  await sendEmail(toEmail, `AuraCRM: ${title}`, htmlContent);
};

/**
 * Core helper function to send an email using either Resend API or Nodemailer SMTP fallback.
 */
export const sendEmail = async (toEmail, subject, htmlContent) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'AuraCRM <onboarding@resend.dev>',
        to: toEmail,
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
  } else {
    // Determine configuration options, supporting SMTP_* keys
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    let transporter;

    if (smtpHost) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Fallback to Gmail SMTP for backward compatibility
      if (!smtpUser || !smtpPass) {
        throw new Error('Failed to send email: neither RESEND_API_KEY nor Nodemailer SMTP credentials (EMAIL_USER/EMAIL_PASS or SMTP_HOST) are defined in environment variables');
      }

      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    // Determine standard/custom from header
    const fromAddress = process.env.SMTP_FROM || `"AuraCRM" <${smtpUser}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
  }
};

/**
 * Sends a confirmation email after a successful password reset.
 */
export const sendPasswordResetSuccessEmail = async (toEmail, name = '') => {
  const title = 'Password Changed Successfully';
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
          .success-badge {
            background: #f0fdf4;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
            border: 1px solid #bbf7d0;
          }
          .success-title {
            font-size: 18px;
            font-weight: 800;
            color: #15803d;
            margin: 0 0 8px 0;
          }
          .success-desc {
            font-size: 12px;
            color: #166534;
            margin: 0;
          }
          .divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 24px 0;
          }
          .security-note {
            font-size: 11px;
            line-height: 1.5;
            color: #ef4444;
            font-weight: 600;
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
              <h1>Security Notification</h1>
              <p>Hello${name ? ` ${name}` : ''},</p>
              
              <div class="success-badge">
                <h3 class="success-title">Password Changed</h3>
                <p class="success-desc">Your password has been successfully updated.</p>
              </div>
              
              <p>This email confirms that the password for your AuraCRM account has been changed. You can now use your new password to sign in to your workspace.</p>
              
              <div class="divider"></div>
              
              <p class="security-note">
                <strong>Important Security Notice:</strong> If you did not request this change or suspect unauthorized access to your account, please reset your password immediately or contact our support team.
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

  await sendEmail(toEmail, `AuraCRM: ${title}`, htmlContent);
};

/**
 * Sends a welcome/registration success email.
 */
export const sendRegistrationSuccessEmail = async (toEmail, name = '') => {
  const title = 'Welcome to AuraCRM!';
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
          .welcome-badge {
            background: #eff6ff;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
            border: 1px solid #bfdbfe;
          }
          .welcome-title {
            font-size: 18px;
            font-weight: 800;
            color: #1d4ed8;
            margin: 0 0 8px 0;
          }
          .welcome-desc {
            font-size: 12px;
            color: #1e40af;
            margin: 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            font-size: 13px;
            font-weight: 750;
            border-radius: 12px;
            text-align: center;
            margin: 8px 0 24px 0;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
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
              <h1>Account Activated!</h1>
              <p>Hello${name ? ` ${name}` : ''},</p>
              
              <div class="welcome-badge">
                <h3 class="welcome-title">Welcome to AuraCRM</h3>
                <p class="welcome-desc">Your workspace has been successfully initialized and is ready to use.</p>
              </div>
              
              <p>Thank you for verification. Your registration is complete, and your AuraCRM account is fully active. You can now start managing your leads, monitoring your pipeline analytics, and optimizing your CRM workflow.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="cta-button">Go to Dashboard</a>
              </div>
              
              <div class="divider"></div>
              
              <p class="security-note">
                <strong>Tip:</strong> We recommend adding our email domain to your contacts to ensure you receive future system alerts, pipeline notifications, and account updates.
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

  await sendEmail(toEmail, `Welcome to AuraCRM!`, htmlContent);
};
