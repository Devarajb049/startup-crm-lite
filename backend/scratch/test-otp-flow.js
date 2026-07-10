import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Otp from '../models/Otp.js';
import User from '../models/User.js';

dotenv.config({ path: '.env' });

const testOtpFlow = async () => {
  console.log('Starting OTP Flow unit tests...');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB database.');

    const email = 'test_verify_user@auracrm.dev';
    const rawOtp = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(rawOtp, salt);
    const hashedPassword = await bcrypt.hash('mypassword123', salt);

    // Clean existing entries
    await Otp.deleteMany({ email });
    await User.deleteMany({ email });

    // 1. Create a dummy Otp document representing a pending registration
    const record = await Otp.create({
      email,
      otp: hashedOtp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      purpose: 'register',
      registrationData: {
        name: 'Test Verify User',
        password: hashedPassword,
      },
    });
    console.log('✓ Pending registration OTP created.');

    // 2. Test OTP verify match
    const isMatch = await bcrypt.compare(rawOtp, record.otp);
    if (!isMatch) {
      throw new Error('OTP verification compare failed!');
    }
    console.log('✓ OTP comparison successful.');

    // 3. Simulate correct OTP activation
    const user = await User.create({
      name: record.registrationData.name,
      email: record.email,
      password: record.registrationData.password,
    });
    console.log('✓ User account activated in DB:', user.email);

    // Verify pre-save hook skipped double hashing (starts with standard bcrypt prefix)
    const isPasswordCorrect = await user.comparePassword('mypassword123');
    if (!isPasswordCorrect) {
      throw new Error('Password double hashing check failed!');
    }
    console.log('✓ Password verified correctly (pre-save bypass confirmed).');

    // Clean up
    await Otp.deleteOne({ email });
    await User.deleteOne({ email });
    console.log('✓ Cleanup completed.');

    console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

testOtpFlow();
