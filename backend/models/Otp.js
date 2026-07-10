import mongoose from 'mongoose';

/**
 * Mongoose schema definition for OTP (One-Time Password) documents.
 * Stores verification states for registration and forgot password workflows.
 */
const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    otpExpires: {
      type: Date,
      required: [true, 'OTP expiry is required'],
    },
    attempts: {
      type: Number,
      default: 0,
    },
    purpose: {
      type: String,
      enum: {
        values: ['register', 'forgot'],
        message: '{VALUE} is not a valid OTP purpose. Allowed values: register, forgot',
      },
      required: [true, 'Purpose is required'],
    },
    registrationData: {
      name: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    lastResendTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for easy lookups by email and purpose
OtpSchema.index({ email: 1, purpose: 1 }, { unique: true });

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;
