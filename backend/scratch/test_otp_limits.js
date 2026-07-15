import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Otp from '../models/Otp.js';
import User from '../models/User.js';

dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

const dbURI = process.env.MONGODB_URI;
const API_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = 'test-otp-flow@auracrm.com';

async function run() {
  console.log('Connecting to database to clean up test records...');
  await mongoose.connect(dbURI);

  // Clean up any old test records
  await Otp.deleteMany({ email: TEST_EMAIL });
  await User.deleteMany({ email: TEST_EMAIL });
  console.log('Cleanup complete.');

  try {
    // 1. Test registration
    console.log('\n--- Test 1: First Registration Attempt ---');
    const regRes1 = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Flow',
        email: TEST_EMAIL,
        password: 'password123'
      })
    });
    const regData1 = await regRes1.json();
    console.log('Status:', regRes1.status);
    console.log('Response:', regData1);

    if (regRes1.status !== 200) {
      throw new Error('Registration failed');
    }

    // 2. Test registration cooldown (duplicate requests)
    console.log('\n--- Test 2: Duplicate Registration Cooldown ---');
    const regRes2 = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Flow',
        email: TEST_EMAIL,
        password: 'password123'
      })
    });
    const regData2 = await regRes2.json();
    console.log('Status:', regRes2.status);
    console.log('Response:', regData2);

    if (regRes2.status === 400 && regData2.message.includes('seconds')) {
      console.log('Success: Duplicate registration was blocked by cooldown.');
    } else {
      console.error('FAIL: Cooldown was not triggered!');
    }

    // 3. Test OTP verification incorrect attempts limit
    console.log('\n--- Test 3: OTP Verification Incorrect Attempts Limit ---');
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`\nSubmitting incorrect OTP (Attempt ${attempt}/3)...`);
      const verifyRes = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_EMAIL,
          otp: '000000', // incorrect OTP
          purpose: 'register'
        })
      });
      const verifyData = await verifyRes.json();
      console.log('Status:', verifyRes.status);
      console.log('Response:', verifyData);

      if (attempt === 3) {
        if (verifyRes.status === 400 && verifyData.message.includes('Too many incorrect attempts')) {
          console.log('Success: OTP document was successfully deleted after the 3rd attempt and correct error returned.');
        } else {
          console.error('FAIL: 3rd attempt did not return correct limit error!');
        }
      }
    }

    // Verify OTP document is deleted from database
    const otpDoc = await Otp.findOne({ email: TEST_EMAIL, purpose: 'register' });
    if (!otpDoc) {
      console.log('\nSuccess: Verified that OTP document is no longer in the database.');
    } else {
      console.error('\nFAIL: OTP document still exists in database!');
    }

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from DB.');
  }
}

run();
