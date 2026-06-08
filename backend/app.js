const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

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
const testimonialRoutes = require('./routes/testimonialRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const leadRoutes = require('./routes/leadRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const seoRoutes = require('./routes/seoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

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
  'https://gyanaranjandas.me',
  'https://www.gyanaranjandas.me',
  'http://localhost:5173',
  'http://localhost:5174',
];
// Also include CLIENT_URL if set and not already listed
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
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
  max: 5000,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// --- Body Parsers ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CSRF Protection Removed ---
// Cookie-based CSRF (like csurf) does not work in cross-origin SPA setups
// because modern browsers block third-party cookies.
// Security against CSRF is already handled by our strict CORS policy above.

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
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/quotations', quotationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// --- Error Handler (must be last) ---
app.use(errorHandler);

module.exports = app;
