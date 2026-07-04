import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI specified in process.env.MONGODB_URI.
 * In Mongoose v6+, legacy options such as useNewUrlParser and useUnifiedTopology 
 * are enabled by default and are no longer supported as configuration options.
 * Therefore, we connect directly without these deprecated parameters.
 */
export const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    // Establish mongoose connection
    const conn = await mongoose.connect(dbURI);

    // On success: log connection host name
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    // On error: log details and terminate application with failure code 1
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
