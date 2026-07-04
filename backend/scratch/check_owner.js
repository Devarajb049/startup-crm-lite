import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const admin = await User.findOne({ email: 'bdevaraj@gmail.com' });
    if (!admin) {
      console.log('Admin user bdevaraj@gmail.com not found in DB!');
      await mongoose.disconnect();
      return;
    }

    console.log(`\n=== ADMIN USER DETAILS ===`);
    console.log(`ID: ${admin._id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);

    const leads = await Lead.find({});
    console.log(`\n=== LEADS IN DATABASE (${leads.length} found) ===`);
    leads.forEach((lead, idx) => {
      console.log(`${idx + 1}. Name: ${lead.name} | Company: ${lead.company} | Owner (Raw ID): ${lead.owner}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkData();
