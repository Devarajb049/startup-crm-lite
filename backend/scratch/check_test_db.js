import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

// Modify connection URI to point to the 'test' database instead of 'startup_crm_lite'
const dbURI = process.env.MONGODB_URI.replace('/startup_crm_lite', '/test');
console.log('Connecting to:', dbURI);

mongoose.connect(dbURI, { dbName: 'startup_crm_lite' })
  .then(async () => {
    console.log('Connected to DB successfully with dbName option override.');
    
    const users = await User.find({});
    console.log('\n=== USERS in test ===');
    users.forEach(u => console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`));

    const leads = await Lead.find({});
    console.log(`\n=== LEADS in test (Total: ${leads.length}) ===`);
    leads.forEach((l, idx) => {
      console.log(`${idx + 1}. ID: ${l._id}, Name: ${l.name}, Owner: ${l.owner}, Status: ${l.status}, Company: ${l.company}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected.');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
