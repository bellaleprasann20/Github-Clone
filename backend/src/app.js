import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repoRoutes from './routes/repoRoutes.js';
import commitRoutes from './routes/commitRoutes.js';

// Import middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import logger from './utils/logger.js';

// Load env vars
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3173',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL injection prevention - Express 5 compatible
app.use((req, res, next) => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('$')) {
          delete req.body[key];
        } else if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          req.body[key] = sanitizeObject(req.body[key]);
        }
      });
    }
    
    // Validate query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (key.startsWith('$')) {
          return res.status(400).json({ message: 'Invalid query parameter' });
        }
      }
    }
    
    // Validate params
    if (req.params && typeof req.params === 'object') {
      for (const key in req.params) {
        if (key.startsWith('$')) {
          return res.status(400).json({ message: 'Invalid request parameter' });
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Recursive sanitization for nested objects
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (key.startsWith('$')) {
      continue;
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
}

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'GitHub Clone API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'GitHub Clone API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      repos: '/api/repos',
      commits: '/api/commits'
    }
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/commits', commitRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;