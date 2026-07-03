import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please add contact name'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Please add company name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add contact email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    value: {
      type: Number,
      required: [true, 'Please add estimated deal value'],
      default: 0
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New'
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
      default: 'Other'
    },
    wonAt: {
      type: Date
    },
    lostAt: {
      type: Date
    },
    meetingAt: {
      type: Date
    },
    proposalAt: {
      type: Date
    },
    contactedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
