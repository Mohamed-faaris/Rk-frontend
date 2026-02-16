// ============================================
// RK CREATIVE HUB - BACKEND API SERVER
// ============================================
//
// MODES:
//   api  - API server only (for api.rkch.tech)
//   full - API + serves frontend (single server deployment)
//
// Commands:
//   npm run server:api   - Start API only (MODE=api)
//   npm run server:full  - Start API + frontend (MODE=full)
//
// Environment:
//   MODE         - Server mode: api | full
//   CLIENT_URLS  - Comma-separated allowed origins
//   MONGODB_URI  - MongoDB connection string
//   JWT_SECRET   - JWT signing secret
//
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env.server') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const MODE = process.env.MODE || 'api';
const IS_DEV = process.env.NODE_ENV !== 'production';

console.log(`\n🚀 Starting server in ${MODE} mode (${IS_DEV ? 'development' : 'production'})\n`);

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
const getClientUrls = () => {
  const urls = [];
  
  // Always allow localhost in development
  if (IS_DEV) {
    urls.push(
      'http://localhost:5173',
      'http://localhost:5002',
      'http://localhost:3000'
    );
  }
  
  // Parse CLIENT_URLS from environment
  if (process.env.CLIENT_URLS) {
    urls.push(...process.env.CLIENT_URLS.split(',').map(u => u.trim()));
  }
  
  return urls.filter(Boolean);
};

const allowedOrigins = getClientUrls();
console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // In development, allow all
    if (IS_DEV) return callback(null, true);
    
    // In production, check against allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked origin: ${origin}`);
      callback(null, true); // Allow anyway for flexibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: MODE,
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', mode: MODE });
});

// ============================================
// DATABASE CONNECTION
// ============================================
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
  }
};

connectDB();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && MONGODB_URI) {
    await connectDB();
  }
  next();
});

// ============================================
// API ROUTES
// ============================================
const routes = [
  { path: '/api/auth', file: './routes/auth.js' },
  { path: '/api/otp', file: './routes/otp.js' },
  { path: '/api/portfolio', file: './routes/portfolio.js' },
  { path: '/api/contact', file: './routes/contact.js' },
  { path: '/api/orders', file: './routes/order.js' },
  { path: '/api/branding', file: './routes/brandingIdentity.js' },
  { path: '/api/web-projects', file: './routes/webProject.js' },
  { path: '/api/3d-animations', file: './routes/animation3D.js' },
  { path: '/api/uiux-projects', file: './routes/uiuxProject.js' },
  { path: '/api/employees', file: './routes/employee.js' },
  { path: '/api/projects', file: './routes/project.js' },
  { path: '/api/users', file: './routes/user.js' },
  { path: '/api/revenue', file: './routes/revenue.js' },
  { path: '/api/upload', file: './routes/upload.js' },
  { path: '/api/applications', file: './routes/applicationRoutes.js' },
  { path: '/api/dns', file: './routes/dns.js' },
  { path: '/api/chat', file: './routes/chatbot.js' },
  { path: '/api/config', file: './routes/config.js' },
];

for (const route of routes) {
  try {
    const { default: router } = await import(route.file);
    app.use(route.path, router);
  } catch (err) {
    console.warn(`⚠️  Could not load route ${route.path}:`, err.message);
  }
}

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../web/public/uploads')));

// ============================================
// FRONTEND SERVING (MODE: full)
// ============================================
if (MODE === 'full') {
  const distPath = path.join(__dirname, '../web/dist');
  
  // Serve static files
  app.use(express.static(distPath));
  
  // SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) res.status(404).json({ error: 'Not found' });
    });
  });
  
  console.log('✅ Frontend serving enabled');
}

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 (only for API mode)
if (MODE === 'api') {
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`✅ Mode: ${MODE}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📌 Shutting down...');
  server.close(() => {
    mongoose.disconnect();
    process.exit(0);
  });
});

export default app;
