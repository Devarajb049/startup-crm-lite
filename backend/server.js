import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import configurations and routes
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Import global error handler
import { errorHandler } from './middleware/errorHandler.js';

// Load environment configuration variables
dotenv.config();

// Initialize the Express framework instance
const app = express();

/* ==========================================
   GLOBAL SECURITY & DIAGNOSTIC MIDDLEWARES
   ========================================== */

// Use Helmet middleware to secure the application by setting various HTTP headers
app.use(helmet());

// Use Morgan logger middleware in development mode to trace incoming HTTP requests
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing (CORS) with frontend client
const allowedOrigins = [
  "https://aura-startup-crm-lite.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parser middleware: parses incoming request payloads in JSON (capped at 10kb to avoid payload attacks)
app.use(express.json({ limit: '10kb' }));

// Body parser middleware: parses URL-encoded data from standard HTML forms
app.use(express.urlencoded({ extended: true }));
// Root endpoint to confirm the backend service is live
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Startup CRM Backend is running',
  });
});

// Base Health Check endpoint to monitor server uptime and response speed
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// Register feature modules routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/* ==========================================
   GLOBAL CENTRALIZED ERROR HANDLING LAYER
   ========================================== */

// Register the custom global error handler middleware (must be registered last)
app.use(errorHandler);

/* ==========================================
   SERVER INITIALIZATION & STARTUP
   ========================================== */

// Connect to MongoDB Atlas first, then start the Express server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const MODE = process.env.NODE_ENV || 'development';

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
  });
});
