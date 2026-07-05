import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

// Load env variables using absolute path to ensure robustness
dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

const dbURI = process.env.MONGODB_URI;
console.log('Connecting to:', dbURI);

mongoose.connect(dbURI)
  .then(async () => {
    console.log('Connected to DB successfully.');
    
    const users = await User.find({});
    console.log('\n=== USERS ===');
    users.forEach(u => console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`));

    const leads = await Lead.find({});
    console.log(`\n=== LEADS (Total: ${leads.length}) ===`);
    leads.forEach((l, idx) => {
      console.log(`${idx + 1}. ID: ${l._id}, Name: ${l.name}, Owner: ${l.owner}, Status: ${l.status}, Company: ${l.company}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from DB.');
  })
  .catch(err => {
    console.error('Database connection / query error:', err);
    process.exit(1);
  });
