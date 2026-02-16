// ============================================
// RK CREATIVE HUB - BACKEND API SERVER
// ============================================
// 
// Commands:
//   npm start        - Start production server
//   npm run dev:full  - Start dev server (frontend + backend)
// 
// Environment Variables Required:
//   MONGODB_URI      - MongoDB connection string
//   JWT_SECRET       - JWT signing secret
//   EMAIL_USER       - Email for sending OTPs
//   EMAIL_PASS       - Email app password
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

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5002',
  'https://rkch.tech',
  'https://www.rkch.tech',
  'https://preprod.rkch.tech',
  'https://rk-website-navy.vercel.app',
  'https://rk-website-mohamed-faaris-projects.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true); // Allow all origins
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Server running',
    timestamp: new Date(),
    env: process.env.NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
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

// Ensure DB connection for each request
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

// Load all routes
for (const route of routes) {
  try {
    const { default: router } = await import(route.file);
    app.use(route.path, router);
  } catch (err) {
    console.warn(`⚠️  Could not load route ${route.path}:`, err.message);
  }
}

// Static file uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ API Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err.message);
  }
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
