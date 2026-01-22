# Complete Guide: Deploy Express Backend to Render

This guide provides step-by-step instructions for deploying your Express.js backend API to Render. Written for beginners with production-ready setup.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Backend](#step-1-prepare-your-backend)
3. [Step 2: Update package.json](#step-2-update-packagejson)
4. [Step 3: Configure Server Code](#step-3-configure-server-code)
5. [Step 4: Create .env.example](#step-4-create-envexample)
6. [Step 5: Deploy on Render](#step-5-deploy-on-render)
7. [Step 6: Set Environment Variables](#step-6-set-environment-variables)
8. [Step 7: Configure CORS](#step-7-configure-cors)
9. [Step 8: Connect Frontend to Backend](#step-8-connect-frontend-to-backend)
10. [Step 9: Test Your Deployment](#step-9-test-your-deployment)
11. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

✓ Render account (free tier: https://render.com)
✓ GitHub account with your code pushed
✓ Node.js installed locally (v16+)
✓ MongoDB or MySQL database (if needed)

---

## Step 1: Prepare Your Backend

### Current Folder Structure
Your backend structure is already good:
```
server/
  ├── index.js (main server file)
  ├── controllers/ (route handlers)
  ├── models/ (database schemas)
  ├── routes/ (API endpoints)
  ├── middleware/ (auth, upload, etc.)
  ├── utils/ (helper functions)
  └── uploads/ (user uploads)
```

### Why This Structure Works on Render
- **Clear entry point**: `server/index.js` is easy to identify
- **Separation of concerns**: Controllers, models, routes organized properly
- **Middleware support**: CORS, authentication already implemented
- **Scalable**: Can handle production load

---

## Step 2: Update package.json

Your current `package.json` has a `server` script, which is good. **Update it to this**:

```json
{
  "name": "rk-website-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "Express backend API for RK Website",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "server": "node server/index.js",
    "build": "echo 'Build step - if needed'",
    "lint": "eslint .",
    "test": "echo 'No tests yet'"
  },
  "keywords": ["express", "api", "render"],
  "author": "Your Name",
  "license": "MIT",
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

**Key Changes:**
- `"start"` script points to `server/index.js` (Render uses this)
- `"build"` script (even if empty) required by Render
- `"engines"` specifies Node version for consistency
- `"main"` points to entry file

---

## Step 3: Configure Server Code

### Optimal server/index.js for Render

Your `server/index.js` is almost perfect! Here's what to ensure:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Import your routes
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rk-website';

// ============================================
// CORS Configuration (CRITICAL FOR RENDER)
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,           // Your deployed frontend URL
  process.env.FRONTEND_URL,         // Alternative env var
].filter(url => url && url.trim()); // Remove undefined/empty

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      // In production, don't allow. In dev, allow with warning.
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // Allow in dev
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600, // Cache preflight for 1 hour
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// Database Connection
// ============================================
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// ============================================
// Static Files
// ============================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ============================================
// Request Logger
// ============================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/branding', brandingIdentityRoutes);
app.use('/api/web-projects', webProjectRoutes);
app.use('/api/3d-animation', animation3DRoutes);
app.use('/api/uiux-projects', uiuxProjectRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dns', dnsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/config', configRoutes);

// ============================================
// Health Check Endpoint (Important for Render)
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// API Status Endpoint
// ============================================
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// 404 Fallback
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method 
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Server Running on Port ${PORT}        ║
║  📍 http://localhost:${PORT}           ║
║  ✓ CORS enabled                        ║
║  ✓ MongoDB connected                   ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

export default app;
```

### Key Points for Render Deployment:
1. **`app.listen('0.0.0.0')`** - Listens on all network interfaces (required for Render)
2. **`PORT` from env** - Render sets PORT automatically
3. **`/health` endpoint** - Render uses this to check if app is alive
4. **Error handling** - Proper error middleware for debugging
5. **Graceful shutdown** - Handles SIGTERM from Render

---

## Step 4: Create .env.example

Create a file named `.env.example` in your root directory. This shows what env vars are needed:

```
# NODE ENVIRONMENT
NODE_ENV=production

# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
# OR for MySQL:
# DATABASE_URL=mysql://user:password@host:port/dbname

# JWT Secret (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_long_random_secret_key_here

# Frontend URLs (add all deployed frontend URLs)
CLIENT_URL=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app

# Email Service (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Third-party APIs (if using)
STRIPE_KEY=sk_live_...
OPENAI_KEY=sk-...
```

---

## Step 5: Deploy on Render

### 5.1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### 5.2: Create New Service on Render

1. **Go to https://dashboard.render.com**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
   - Click "Connect Repository"
   - Select your GitHub repo
   - Click "Connect"

4. **Fill in Service Details**
   ```
   Name: rk-website-api (or any name)
   Environment: Node
   Region: Singapore (or closest to your users)
   Branch: main
   Build Command: npm install
   Start Command: npm start
   ```

5. **Select Plan**
   - Free: Good for testing, limited resources
   - Paid ($7+/month): Recommended for production

6. **Click "Create Web Service"**

### 5.3: Wait for Deployment
- Render will automatically:
  - Pull your code from GitHub
  - Run `npm install`
  - Run `npm start`
  - Deploy your API
- Takes 2-5 minutes usually
- You'll get a public URL: `https://rk-website-api.onrender.com`

---

## Step 6: Set Environment Variables

### In Render Dashboard:

1. **Go to your service** (after deployment)
2. **Click "Environment"** in the left sidebar
3. **Click "Add Environment Variable"**
4. **Add these variables:**

| Variable | Value | Example |
|----------|-------|---------|
| NODE_ENV | production | production |
| MONGODB_URI | Your MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/dbname |
| JWT_SECRET | Generate a random secret | Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| CLIENT_URL | Your deployed frontend URL | https://your-frontend.vercel.app |

### How to Generate JWT_SECRET:
Run this command locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example: `a3f8e9d2c1b4f6e9a2c7d8e1f9b3a6c2`

Copy and paste this into Render.

### After Adding Variables:
- Click "Save"
- Render auto-restarts your service with new env vars
- Takes ~30 seconds

---

## Step 7: Configure CORS

Your current CORS configuration needs updating for production. Update this in `server/index.js`:

```javascript
// PRODUCTION CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'http://localhost:5173',           // Vite dev server
  'https://your-frontend.vercel.app', // Your deployed frontend (REPLACE THIS)
  process.env.CLIENT_URL,             // From env variables
  process.env.FRONTEND_URL,           // Alternative env var
].filter(url => url && url.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('CORS not allowed'));
      } else {
        callback(null, true); // Allow all in dev
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### After Deploying Frontend:
1. Get your frontend URL from Vercel (e.g., `https://rk-website.vercel.app`)
2. Add to Render env variables as `CLIENT_URL`
3. Render automatically restarts with new CORS settings

---

## Step 8: Connect Frontend to Backend

### 8.1: Update Frontend Environment Variables

In your frontend root directory, create `.env.production`:

```
VITE_API_URL=https://rk-website-api.onrender.com
```

And `.env.development` (if not exists):

```
VITE_API_URL=http://localhost:5000
```

### 8.2: Update API Calls in Frontend

In your React components, use:

```typescript
// src/lib/api.ts or similar
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // Important for CORS
});

// Usage in components
export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};
```

### 8.3: Update Vercel Environment Variables

1. **Go to https://vercel.com/dashboard**
2. **Select your frontend project**
3. **Settings → Environment Variables**
4. **Add:**
   ```
   VITE_API_URL=https://rk-website-api.onrender.com
   ```
5. **Redeploy your frontend:**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

## Step 9: Test Your Deployment

### 9.1: Test Health Endpoint
```bash
# Should return OK
curl https://rk-website-api.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-21T10:30:45.123Z",
  "uptime": 123.456
}
```

### 9.2: Test API Status
```bash
curl https://rk-website-api.onrender.com/api/status
```

Expected response:
```json
{
  "message": "API is running",
  "environment": "production"
}
```

### 9.3: Test with Postman
1. **Open Postman**
2. **Create new request**
3. **Method:** POST
4. **URL:** `https://rk-website-api.onrender.com/api/auth/login`
5. **Headers:**
   ```
   Content-Type: application/json
   ```
6. **Body (raw JSON):**
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
7. **Click Send** - Should work!

### 9.4: Test from Frontend
- Open your deployed frontend
- Try login, create order, upload file, etc.
- Open browser Developer Tools (F12) → Network tab
- Check API calls go to `https://rk-website-api.onrender.com`
- No CORS errors should appear

---

## Common Issues & Solutions

### ❌ Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend URL not in allowed origins

**Fix:**
```javascript
// In server/index.js
const allowedOrigins = [
  'https://your-actual-frontend.vercel.app', // Add your REAL frontend URL
  process.env.CLIENT_URL,
];
```

Then:
1. Commit and push changes
2. Render auto-deploys
3. Refresh frontend and retry

---

### ❌ Issue 2: "Error R14 Slug size too large"

**Cause:** Too many dependencies, upload folder too large

**Fix:**
1. Create `.gitignore`:
   ```
   node_modules/
   public/uploads/*
   .env
   ```

2. Remove heavy packages:
   ```bash
   npm uninstall unused-package
   ```

3. Optimize node_modules:
   ```bash
   npm prune --production
   ```

---

### ❌ Issue 3: "Cannot find module 'dotenv'"

**Cause:** Dependencies not installed

**Fix:**
1. Ensure all dependencies in `package.json`:
   ```json
   "dependencies": {
     "express": "^4.18.2",
     "cors": "^2.8.5",
     "dotenv": "^16.0.3",
     "mongoose": "^7.0.0"
   }
   ```

2. Commit and push:
   ```bash
   git add package.json
   git commit -m "Update dependencies"
   git push origin main
   ```

---

### ❌ Issue 4: "MongoDB connection timeout"

**Cause:** Database not accessible from Render IP

**Fix:**
1. **For MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

2. **Test connection locally first:**
   ```bash
   npm run dev
   ```

3. **Verify MONGODB_URI in Render:**
   - Go to Render Dashboard
   - Environment Variables
   - Check MONGODB_URI is correct
   - Make sure `retryWrites=true&w=majority` in URL

---

### ❌ Issue 5: "Service failed to start" or "H10 error"

**Cause:** App crashes on startup

**Fix:**
1. **Check logs:**
   - Go to Render Dashboard
   - Click your service
   - Scroll down to "Logs"
   - Look for error messages

2. **Common startup errors:**
   - Missing env variables → Add to Render dashboard
   - Port already in use → Check `PORT` env var is set
   - Database not connected → Verify connection string

3. **Restart service:**
   - Go to Render Dashboard
   - Service settings
   - Click "Manual Redeploy"

---

### ❌ Issue 6: "POST request returns 405 Method Not Allowed"

**Cause:** Route not defined or middleware issue

**Fix:**
```javascript
// Ensure route is registered
app.use('/api/auth', authRoutes);

// Check route file has the method:
// In server/routes/auth.js:
router.post('/login', (req, res) => {
  // Handle login
});
```

---

### ❌ Issue 7: "Timeout when uploading files"

**Cause:** Default size limit too small

**Fix:**
```javascript
// In server/index.js
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Also set Render timeout higher:
// Render Dashboard → Settings → HTTP Request Timeout
// Set to 30 seconds (maximum)
```

---

### ❌ Issue 8: "Cannot read uploads from /uploads"

**Cause:** Path issue on Render

**Fix:**
```javascript
// In server/index.js - Ensure correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Test endpoint:
app.get('/uploads/:filename', (req, res) => {
  const filepath = path.join(__dirname, '..', 'public', 'uploads', req.params.filename);
  res.download(filepath);
});
```

---

## Monitoring & Logs

### View Real-time Logs
1. **Go to Render Dashboard**
2. **Click your service**
3. **Scroll to "Logs" section**
4. **See all errors and info messages**

### View Metrics
1. **Click your service**
2. **Scroll to "Metrics"**
3. **See CPU, Memory, Network usage**

### Set Up Notifications
1. **Click your service**
2. **Settings → Notifications**
3. **Enable deployment and error notifications**

---

## Production Checklist

Before going live:

- [ ] Environment variables added to Render (MONGODB_URI, JWT_SECRET, CLIENT_URL)
- [ ] CORS configured with frontend URL
- [ ] Health endpoint tested (/health)
- [ ] Database connection tested
- [ ] File uploads working
- [ ] Authentication working
- [ ] Frontend connected to backend API
- [ ] No hardcoded URLs in code
- [ ] Error handling implemented
- [ ] Logs being monitored

---

## Quick Reference

### Render Public URL
```
https://rk-website-api.onrender.com
```

### Common Endpoints
```
GET  /health                    - Health check
GET  /api/status               - API status
POST /api/auth/login           - User login
POST /api/auth/register        - User registration
```

### Environment Variables Template
```
NODE_ENV=production
MONGODB_URI=your_database_url
JWT_SECRET=random_secret_key
CLIENT_URL=https://your-frontend.vercel.app
```

### Deployment Flow
```
1. Code changes in local
2. Git push to GitHub
3. Render auto-deploys
4. New URL: https://rk-website-api.onrender.com
5. Accessible worldwide 🌍
```

---

## Need Help?

**Render Docs:** https://render.com/docs
**Express Docs:** https://expressjs.com
**CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Your Backend is Ready for Production! 🚀**

Next: Deploy to Render → Get public URL → Update frontend → Test → Monitor logs
