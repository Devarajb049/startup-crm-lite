import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Lead from '../models/Lead.js';

dotenv.config({ path: path.resolve('x:/Codeon/Project/startup-crm-lite/backend/.env') });

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(async () => {
    const userId = new mongoose.Types.ObjectId('6a49161e4baf66f4f1bb703d');
    
    // Simulate req.query = { limit: '1000' }
    const query = { limit: '1000' };
    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { owner: userId };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipNum = (pageNum - 1) * limitNum;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    console.log('Query Filter:', filter);
    console.log('Pagination:', { pageNum, limitNum, skipNum });
    console.log('Sort:', sort);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skipNum)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    console.log(`\nLeads Found: ${leads.length}`);
    console.log(`Total Leads Count: ${total}`);
    leads.forEach((l, idx) => {
      console.log(`${idx + 1}. ID: ${l._id}, Name: ${l.name}, Status: ${l.status}`);
    });

    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });
