import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Import configurations and routes
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Import global error handler
import { errorHandler } from './middleware/errorHandler.js';

// Load environment configuration variables
dotenv.config();

/**
 * Validate that all required environment variables are present on startup.
 * Exits the process if any variable is missing.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`CRITICAL CONFIG ERROR: Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// Run environment validation
checkRequiredEnvVars();

// Initialize the Express framework instance
const app = express();

/* ==========================================
   GLOBAL SECURITY & DIAGNOSTIC MIDDLEWARES
   ========================================== */

// Use Helmet middleware to secure the application by setting various HTTP headers
app.use(helmet());

/**
 * Custom MongoDB Injection Protection Middleware.
 * Sanitizes req.body, req.query, and req.params in-place.
 * Deletes any object keys starting with '$' or containing '.' recursively.
 * Needed because standard express-mongo-sanitize replaces req.query, which throws 
 * a TypeError in Express 5.x since req.query has only a getter.
 */
const mongoSanitizeMiddleware = () => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };
  return (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
  };
};

app.use(mongoSanitizeMiddleware());

// Request logging improvement: Morgan logging format based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate Limiting Config
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication requests per window
  message: 'Too many auth attempts.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to routes
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Enable Cross-Origin Resource Sharing (CORS) with frontend client
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://aura-startup-crm-lite.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
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

let server;

// Connect to MongoDB Atlas first, then start the Express server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const MODE = process.env.NODE_ENV || 'development';

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
  });
});

/* ==========================================
   GRACEFUL SHUTDOWN HANDLERS
   ========================================== */

const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed cleanly.');
        console.log('Server shutting down gracefully');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection during shutdown:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
