# Render Deployment: Code Snippets & Examples

Ready-to-use code snippets for deploying your Express backend to Render.

---

## 1. Updated server/index.js (Production-Ready)

Copy-paste this entire file:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// ============================================
// IMPORT ROUTES
// ============================================
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/order.js';
import brandingIdentityRoutes from './routes/brandingIdentity.js';
import webProjectRoutes from './routes/webProject.js';
import animation3DRoutes from './routes/animation3D.js';
import uiuxProjectRoutes from './routes/uiuxProject.js';
import employeeRoutes from './routes/employee.js';
import projectRoutes from './routes/project.js';
import userRoutes from './routes/user.js';
import revenueRoutes from './routes/revenue.js';
import uploadRoutes from './routes/upload.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dnsRoutes from './routes/dns.js';
import chatbotRoutes from './routes/chatbot.js';
import otpRoutes from './routes/otp.js';
import configRoutes from './routes/config.js';

// ============================================
// SETUP
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rk-website';

console.log(`🚀 Starting server in ${NODE_ENV} mode...`);

// ============================================
// CORS CONFIGURATION
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(url => url && url.trim() !== '');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked: ${origin}`);
      if (NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS policy'));
      } else {
        // Allow in development with warning
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 3600,
};

app.use(cors(corsOptions));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDatabase, 5000);
  }
};

connectDatabase();

// ============================================
// STATIC FILES
// ============================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

// Health check (Render uses this to determine if service is alive)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    message: 'API is running',
    environment: NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================
const apiRoutes = [
  { path: '/api/auth', routes: authRoutes },
  { path: '/api/portfolio', routes: portfolioRoutes },
  { path: '/api/contact', routes: contactRoutes },
  { path: '/api/orders', routes: orderRoutes },
  { path: '/api/branding', routes: brandingIdentityRoutes },
  { path: '/api/web-projects', routes: webProjectRoutes },
  { path: '/api/3d-animation', routes: animation3DRoutes },
  { path: '/api/uiux-projects', routes: uiuxProjectRoutes },
  { path: '/api/employees', routes: employeeRoutes },
  { path: '/api/projects', routes: projectRoutes },
  { path: '/api/users', routes: userRoutes },
  { path: '/api/revenue', routes: revenueRoutes },
  { path: '/api/upload', routes: uploadRoutes },
  { path: '/api/applications', routes: applicationRoutes },
  { path: '/api/dns', routes: dnsRoutes },
  { path: '/api/chatbot', routes: chatbotRoutes },
  { path: '/api/otp', routes: otpRoutes },
  { path: '/api/config', routes: configRoutes },
];

apiRoutes.forEach(({ path: routePath, routes }) => {
  app.use(routePath, routes);
  console.log(`✓ Route registered: ${routePath}`);
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} does not exist`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║          🚀 API SERVER STARTED          ║
╠════════════════════════════════════════╣
║  Port:       ${PORT}                        ║
║  Environment: ${NODE_ENV.padEnd(26)}   ║
║  Status:     Live ✅                   ║
║  URL:        http://0.0.0.0:${PORT}     ║
║  Health:     /health                   ║
║  Public:     https://<service>.onrender.com ║
╚════════════════════════════════════════╝
  `);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('🛑 HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('🛑 MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('📌 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('🛑 HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
```

---

## 2. Updated package.json

```json
{
  "name": "rk-website-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "Express.js backend API for RK Website",
  "main": "server/index.js",
  "author": "Your Name",
  "license": "MIT",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "build": "echo 'Build complete - no build needed for Node.js'",
    "lint": "eslint .",
    "test": "echo 'Tests not implemented yet'",
    "server": "node server/index.js",
    "server:dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "axios": "^1.6.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.0.0"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

---

## 3. .env.example

```
# ===== NODE ENVIRONMENT =====
NODE_ENV=production

# ===== SERVER =====
PORT=5000

# ===== DATABASE =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# ===== AUTHENTICATION =====
JWT_SECRET=your_long_random_secret_key_32_chars_minimum
JWT_EXPIRE=7d

# ===== FRONTEND URLs =====
CLIENT_URL=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app

# ===== EMAIL (if using) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ===== THIRD-PARTY SERVICES =====
STRIPE_KEY=sk_live_...
OPENAI_API_KEY=sk-...
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

---

## 4. Advanced CORS Configuration

For complex CORS needs:

```javascript
// In server/index.js, replace cors section with:

const corsConfig = {
  // Allow specific origins in production
  allowedOrigins: [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'https://your-main-domain.com',
    'https://www.your-main-domain.com',
    // Development
    'http://localhost:3000',
    'http://localhost:5173',
  ].filter(url => url && url.trim()),

  // Methods allowed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],

  // Headers allowed
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],

  // Credentials (cookies, auth headers)
  credentials: true,

  // How long to cache preflight requests (1 hour)
  maxAge: 3600,

  // HTTP status code for successful CORS requests
  successStatus: 200,
};

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (corsConfig.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS block: ${origin}`);
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('CORS not allowed'));
      } else {
        callback(null, true);
      }
    }
  },
  credentials: corsConfig.credentials,
  methods: corsConfig.methods,
  allowedHeaders: corsConfig.allowedHeaders,
  maxAge: corsConfig.maxAge,
}));
```

---

## 5. Database Connection with Retry Logic

```javascript
// More robust MongoDB connection:

const connectDB = async (retries = 5) => {
  try {
    console.log(`🔄 Connecting to MongoDB (attempt ${6 - retries}/5)...`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB connected successfully');
    
    // Monitor connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });

  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    
    if (retries > 0) {
      console.log(`⏳ Retrying in 5 seconds... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Max retries reached. Shutting down.');
      process.exit(1);
    }
  }
};
```

---

## 6. Request/Response Logger Middleware

```javascript
// Advanced logging middleware:

app.use((req, res, next) => {
  const start = Date.now();
  
  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';

    console.log(
      `${statusEmoji} [${status}] ${req.method} ${req.path} - ${duration}ms`
    );

    // Send original response
    originalSend.call(this, data);
  };

  next();
});
```

---

## 7. Frontend API Client Setup

```typescript
// src/lib/api.ts

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 8. Generate JWT Secret

```bash
# Run this command once locally:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a3f8e9d2c1b4f6e9a2c7d8e1f9b3a6c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7

# Copy this and paste into Render environment variables
```

---

## 9. Test Deployment Script

```bash
#!/bin/bash
# Save as: test-deployment.sh
# Run with: bash test-deployment.sh

SERVICE_URL="https://your-service.onrender.com"

echo "🧪 Testing Render Deployment..."
echo "================================"

# Test 1: Health endpoint
echo ""
echo "1. Testing health endpoint..."
curl -s "$SERVICE_URL/health" | jq . || echo "❌ Failed"

# Test 2: API status
echo ""
echo "2. Testing API status..."
curl -s "$SERVICE_URL/api/status" | jq . || echo "❌ Failed"

# Test 3: Check CORS headers
echo ""
echo "3. Checking CORS headers..."
curl -s -I "$SERVICE_URL/health" | grep -i "access-control-allow" || echo "⚠️  No CORS headers"

# Test 4: Test with auth header
echo ""
echo "4. Testing with Authorization header..."
curl -s -H "Authorization: Bearer test-token" \
  "$SERVICE_URL/api/status" | jq . || echo "❌ Failed"

echo ""
echo "✅ Basic tests complete!"
```

---

## 10. Monitoring Dashboard Setup

```javascript
// Optional: Add a /admin/metrics endpoint

app.get('/admin/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
    },
    cors: {
      allowedOrigins: allowedOrigins,
    },
  });
});
```

---

## 11. Error Handling Utility

```javascript
// utils/errorHandler.js

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export const handleAsyncErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Usage in routes:
// router.post('/login', handleAsyncErrors(async (req, res) => {
//   throw new AppError('Invalid credentials', 401);
// }));
```

---

## 12. Environment Validation

```javascript
// validateEnv.js - Run at startup

const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL',
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ All environment variables validated');
};

// In server/index.js:
// import { validateEnv } from './utils/validateEnv.js';
// validateEnv();
```

---

## 13. Quick Deployment Checklist Commands

```bash
# Run these locally before deploying:

# 1. Check Node version
node --version

# 2. Install dependencies
npm install

# 3. Test locally
npm run dev
# Stop with Ctrl+C after verifying it starts

# 4. Check for errors
npm run lint

# 5. Verify git is ready
git status

# 6. Push to GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main

# 7. Verify it's pushed
git log --oneline -1
```

---

## 14. Post-Deployment Verification

```bash
#!/bin/bash
# Save as: verify-deployment.sh

SERVICE_NAME="your-service"
SERVICE_URL="https://${SERVICE_NAME}.onrender.com"

echo "✅ Verifying $SERVICE_NAME deployment..."

# Check if service is up
if curl -s -f "$SERVICE_URL/health" > /dev/null; then
  echo "✅ Service is up and running"
else
  echo "❌ Service is down or unreachable"
  exit 1
fi

# Check API status
if curl -s -f "$SERVICE_URL/api/status" > /dev/null; then
  echo "✅ API is responding"
else
  echo "❌ API is not responding"
  exit 1
fi

echo "🎉 Deployment verified successfully!"
```

---

**Copy-paste ready! Use these snippets for your deployment. 🚀**
