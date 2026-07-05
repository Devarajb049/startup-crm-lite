import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Seeds the default admin account if the database does not contain any user entries.
 */
const seedAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Seeding default admin user...');
      await User.create({
        name: 'B Devaraj',
        email: 'bdevaraj@gmail.com',
        password: 'Deva@2006',
        role: 'admin',
        isActive: true,
      });
      console.log('Default admin user seeded successfully: bdevaraj@gmail.com / Deva@2006');
    }
  } catch (error) {
    console.error('Failed to seed default admin user:', error.message);
  }
};

/**
 * Connects to MongoDB Atlas using the URI specified in process.env.MONGODB_URI.
 * Configures connection options and implements a fallback mechanism for legacy parameters
 * if they are deprecated or unsupported by the current Mongoose/MongoDB driver.
 */
export const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    let conn;
    try {
      // Connect to MongoDB Atlas with options: { useNewUrlParser: true, useUnifiedTopology: true }
      conn = await mongoose.connect(dbURI, {
        dbName: 'startup_crm_lite',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (optionError) {
      // If driver throws for unsupported options, fall back to connecting without them
      const errorMsg = optionError.message.toLowerCase();
      if (errorMsg.includes('usenewurlparser') || errorMsg.includes('useunifiedtopology')) {
        console.warn(
          'Warning: useNewUrlParser and useUnifiedTopology options are deprecated/unsupported in this Mongoose version. Connecting without them...'
        );
        conn = await mongoose.connect(dbURI, {
          dbName: 'startup_crm_lite',
        });
      } else {
        throw optionError;
      }
    }

    // On success: log connection host name
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

    // Seed admin if DB is empty
    await seedAdmin();
  } catch (error) {
    // On error: log details and terminate application with failure code 1
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
