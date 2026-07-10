import { sendOtpEmail } from '../utils/email.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

async function run() {
  const email = process.env.EMAIL_USER || 'mrdevaraj049@gmail.com';
  console.log('Sending test email via Resend to:', email);
  console.log('Using RESEND_API_KEY starting with:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 6) + '...' : 'not set');

  try {
    await sendOtpEmail(email, '123456', 'forgot', 'Deva Raj');
    console.log('Success! Test email sent successfully.');
  } catch (error) {
    console.error('Error during local Resend test:', error.message);
  }
}

run();
