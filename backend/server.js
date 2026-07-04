import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import configurations, routes, and custom middlewares
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Resolve filename and directory name for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resiliently loads configuration variables from a `.env` file.
 * Checks current working directory, script directory, and parent directory,
 * which ensures that configuration is successfully loaded whether the server
 * is run from the backend subdirectory or the workspace root.
 */
const loadEnvironmentVariables = () => {
  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env')
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`Environment config loaded successfully from: ${envPath}`);
      return;
    }
  }
  // Standard dotenv config fallback if no custom path exists
  dotenv.config();
  console.log('Default dotenv loader executed.');
};

// Initialize configuration variables
loadEnvironmentVariables();

// Establish connection to MongoDB Atlas database
connectDB();

// Initialize the Express framework instance
const app = express();

/* ==========================================
   GLOBAL SECURITY & DIAGNOSTIC MIDDLEWARES
   ========================================== */

// Use Helmet middleware to secure Express apps by setting various HTTP headers
app.use(helmet());

// Use Morgan logger middleware to trace HTTP requests in dev environment
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing (CORS) for communication with the frontend client
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser: parses incoming requests with JSON payloads (with a 10kb safety size limit)
app.use(express.json({ limit: '10kb' }));

// URL-encoded body parser: parses incoming request bodies from HTML forms
app.use(express.urlencoded({ extended: true }));

/* ==========================================
   API ENDPOINTS & BUSINESS LOGIC ROUTING
   ========================================== */

// Base health check API endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// Mount modular sub-routers
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/* ==========================================
   GLOBAL CENTRALIZED ERROR HANDLING LAYER
   ========================================== */

// Centralized error handling middleware (MUST be registered last)
app.use(errorHandler);

/* ==========================================
   SERVER INITIALIZATION & STARTUP
   ========================================== */

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${MODE} mode`);
});

// Handle unhandled Promise rejections safely to prevent server crashes
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  // Gracefully close server listener and exit Node process
  server.close(() => process.exit(1));
});
