import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resilient loader for environment variables.
 * Tries loading from current working directory, backend folder, or project root folder.
 */
const loadEnv = () => {
  const pathsToTry = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '.env'), // backend/.env when relative to config/database.js
    path.resolve(__dirname, '..', '..', '.env'), // startup-crm-lite/.env when relative to config/database.js
  ];

  for (const envPath of pathsToTry) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return;
    }
  }
  // Default fallback
  dotenv.config();
};

// Initialize environment variables
loadEnv();

/**
 * Connects to MongoDB Atlas via Mongoose.
 * Logs success message with host on successful connection,
 * or logs error and exits process with failure code (1).
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // Establish mongoose connection
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
