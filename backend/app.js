const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const configRoutes = require('./routes/configRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// --- Security Middleware ---
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,
}));
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://gyanaranjandas.me',
'https://www.gyanaranjandas.me',
  'http://localhost:5173',
  'http://localhost:5174',
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// --- Body Parsers ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CSRF Protection ---

// --- CSRF Protection (exclude /api/config/seed-admin) ---
app.use((req, res, next) => {
  // Exclude CSRF for:
  // - POST /api/config/seed-admin
  // - GET /api/auth/csrf-token
  // - All routes in test environment
  if (
    process.env.NODE_ENV === 'test' ||
    (req.method === 'POST' && req.originalUrl === '/api/config/seed-admin') ||
    (req.method === 'GET' && req.originalUrl === '/api/auth/csrf-token')
  ) {
    return next();
  }
  return csurf({
    cookie: {
      key: '_csrf',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })(req, res, next);
});

// --- Static files (for local uploads fallback) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route for platform/browser checks
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'portfolio-backend',
    message: 'API is running',
    health: '/api/health',
  });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// --- Error Handler (must be last) ---
app.use(errorHandler);

module.exports = app;
