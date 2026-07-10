import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

async function main() {
  console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
  console.log('Using EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('Verifying transporter connection...');
    await transporter.verify();
    console.log('Transporter is ready to take messages!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"AuraCRM Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to self
      subject: 'AuraCRM SMTP Test Connection',
      text: 'If you receive this email, your SMTP configuration is working correctly.',
      html: '<b>If you receive this email, your SMTP configuration is working correctly.</b>',
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

main();
