# Full-Stack Debugging Guide: Frontend Cannot Connect to Backend on Vercel

**Status**: Production Deployment Troubleshooting  
**Last Updated**: January 24, 2026  
**Difficulty**: Intermediate (Follow in order)

---

## 🔍 PART 1: BACKEND CHECKS (Vercel)

### 1.1 Verify Backend Deployment Status

**Step 1: Check Vercel Dashboard**
```
1. Go to: https://vercel.com/dashboard
2. Click: rk-backend project
3. Look at: Latest deployment status
   - ✅ GREEN = Working
   - ⚠️ YELLOW = Building
   - ❌ RED = Failed
```

**Step 2: View Deployment Logs**
```
1. In Vercel: Deployments tab → Latest deployment
2. Click: "View logs" button
3. Look for errors containing:
   - "ERROR"
   - "Cannot find module"
   - "Runtime error"
```

### 1.2 Test Backend API Directly (No Frontend)

**Step 1: Test in Browser**
```
1. Open your browser
2. Go to: https://rk-backend.vercel.app/

Expected response (JSON):
{
  "status": "ok",
  "message": "Server running"
}

If you see:
- ✅ JSON = Backend is working
- ❌ Error/blank = Backend has issues
```

**Step 2: Test Health Endpoint**
```
Browser URL: https://rk-backend.vercel.app/api/health

Expected:
{
  "status": "ok",
  "database": "connected"
}
```

**Step 3: Test API Call from Terminal**
```powershell
# Windows PowerShell
$response = Invoke-WebRequest -Uri "https://rk-backend.vercel.app/api/health"
Write-Host $response.Content

# Expected output: JSON with status
```

---

## 🏗️ PART 2: CORRECT BACKEND STRUCTURE FOR VERCEL

### 2.1 Required Files & Folders

```
RK-backend/
├── server/
│   ├── index.js          ← Main Express app
│   ├── routes/           ← API routes
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── ...
│   ├── controllers/      ← Business logic
│   ├── models/           ← MongoDB schemas
│   └── middleware/       ← CORS, auth, etc
├── api/
│   └── index.js          ← (Optional) Vercel wrapper
├── vercel.json           ← ⭐ Deployment config
├── package.json
├── .env.production       ← Never commit!
└── .env.example          ← Template only
```

### 2.2 server/index.js (Express Setup WITHOUT app.listen)

```javascript
// ✅ CORRECT: No app.listen() - Vercel handles this
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    'https://rk.vercel.app',        // Your frontend
    'http://localhost:5173',         // Local dev
    process.env.CLIENT_URL           // From .env
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
let mongoConnected = false;

async function connectDB() {
  if (mongoConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    mongoConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
  }
}

// ✅ Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API running on Vercel',
    uptime: process.uptime()
  });
});

app.get('/api/health', async (req, res) => {
  await connectDB();
  res.json({
    status: 'ok',
    database: mongoConnected ? 'connected' : 'connecting',
    timestamp: new Date().toISOString()
  });
});

// ✅ API Routes
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: err.message,
    status: 'error'
  });
});

// ✅ Export app (Vercel requirement)
export default app;
```

### 2.3 vercel.json (Correct Format for Vercel Functions)

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server/index.js"
    }
  ]
}
```

**⚠️ DO NOT USE:**
```json
// ❌ WRONG - Conflicts with Vercel's serverless functions
"functions": { ... }
"builds": [ ... ]
```

### 2.4 Environment Variables in Vercel Dashboard

**Go to**: Vercel Dashboard → rk-backend → Settings → Environment Variables

**Add these:**
```
MONGODB_URI = mongodb+srv://sivasuriya2k3_db_user:SivaMangodb2026@cluster0.rrnfe5j.mongodb.net/RK-WEBSITEDB
JWT_SECRET = rajkayal_creative_hub_secret_key_2025
NODE_ENV = production
CLIENT_URL = https://rk.vercel.app
PORT = 5002
```

**⚠️ NEVER commit .env to Git!**

---

## 🎨 PART 3: FRONTEND CHECKS

### 3.1 Find API URL Configuration in Frontend

**File locations to check:**

```
src/
├── lib/
│   ├── api.ts          ← Look here first!
│   ├── api.js          ← Or here
│   └── services/
├── context/
│   └── AuthContext.tsx ← Might have hardcoded URL
├── pages/
│   └── Login.tsx       ← Check API calls
└── .env.production     ← Environment variables
```

**Step 1: Check src/lib/api.ts**

```typescript
// ✅ CORRECT
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

console.log('API URL:', API_BASE_URL); // Debug: See which URL is used
```

**Step 2: Check if hardcoded URLs exist**

```powershell
# Search for hardcoded localhost
cd "c:\Users\sivas\Documents\GitHub\Website-work\RK website\RK website"
Select-String -Path "src/**/*.ts" -Pattern "localhost:5002|http://localhost" -Recurse

# If found, FIX THEM!
```

### 3.2 Environment Variables Setup

**File: .env.development (for local testing)**
```env
VITE_API_URL=http://localhost:5002
VITE_ENV=development
```

**File: .env.production (for Vercel deployment)**
```env
VITE_API_URL=https://rk-backend.vercel.app
VITE_ENV=production
NODE_ENV=production
```

**How Frontend Uses Environment Variables:**

```typescript
// In React/Vite code
const apiUrl = import.meta.env.VITE_API_URL;

// This reads from:
// - .env.production when deployed
// - .env.development when running locally
```

### 3.3 Correct API Calls in Components

**✅ CORRECT:**
```typescript
// src/pages/Login.tsx
import { apiClient } from '@/lib/api';

async function handleLogin(email: string, password: string) {
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password
    });
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    // error.message tells you why:
    // - "Network Error" = Backend unreachable
    // - "401" = Wrong credentials
    // - "CORS error" = Backend rejected request
  }
}
```

**❌ WRONG:**
```typescript
// ❌ Hardcoded URL
const response = await fetch('http://localhost:5002/api/auth/login');

// ❌ Missing /api prefix
const response = await fetch(`${API_URL}/auth/login`);

// ❌ Wrong format
const response = await axios('rk-backend.vercel.app/api/login');
```

### 3.4 Verify .env.production is Committed

```powershell
cd "c:\Users\sivas\Documents\GitHub\Website-work\RK website\RK website"

# Check if .env.production exists
Test-Path .env.production

# Check its content
Get-Content .env.production | Select-String "VITE_API_URL"

# Expected output:
# VITE_API_URL=https://rk-backend.vercel.app
```

---

## 🔄 PART 4: CORS CONFIGURATION

### 4.1 What is CORS?

CORS = Cross-Origin Resource Sharing

**Simple explanation:**
- Frontend on `https://rk.vercel.app` 
- Backend on `https://rk-backend.vercel.app`
- Different domains = CORS check needed
- Backend must **explicitly allow** frontend to call it

### 4.2 Correct CORS Setup in Backend

**In server/index.js:**

```javascript
import cors from 'cors';

const allowedOrigins = [
  'https://rk.vercel.app',        // ✅ Your production frontend
  'https://rk.vercel.app/',       // Also with trailing slash
  'http://localhost:5173',        // ✅ Local dev frontend
  'http://localhost:3000',        // ✅ If you use port 3000
  process.env.CLIENT_URL          // ✅ From environment
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,              // ✅ Allow cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### 4.3 How to Test if CORS is the Issue

**Open browser console (F12) and look for errors:**

```
❌ CORS Error:
Access to XMLHttpRequest at 'https://rk-backend.vercel.app/api/login' 
from origin 'https://rk.vercel.app' has been blocked by CORS policy

✅ If you see this, it's CORS
🔧 FIX: Add your frontend URL to allowedOrigins in backend
```

**Another test:**

```powershell
# Test CORS from PowerShell
$headers = @{
    'Origin' = 'https://rk.vercel.app'
}
$response = Invoke-WebRequest -Uri "https://rk-backend.vercel.app/api/health" -Headers $headers

# If response contains this header, CORS is working:
# access-control-allow-origin: https://rk.vercel.app
```

---

## 🗄️ PART 5: MONGODB CHECKS (Vercel Serverless)

### 5.1 Verify MongoDB Connection String

**In Vercel Dashboard → rk-backend → Settings → Environment Variables:**

```
MONGODB_URI = mongodb+srv://sivasuriya2k3_db_user:SivaMangodb2026@cluster0.rrnfe5j.mongodb.net/RK-WEBSITEDB
```

**✅ Correct format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME
```

**Test locally:**

```powershell
cd "c:\Users\sivas\Documents\GitHub\RK-backend"

# Create test file
@"
import mongoose from 'mongoose';

const uri = 'mongodb+srv://sivasuriya2k3_db_user:SivaMangodb2026@cluster0.rrnfe5j.mongodb.net/RK-WEBSITEDB';

async function test() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
"@ | Set-Content test-mongo.js

# Run test
node test-mongo.js
```

### 5.2 Common MongoDB Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Connection string wrong** | "Authentication failed" | Check username/password in MongoDB Atlas |
| **IP not whitelisted** | "Connection timeout" | Go to MongoDB Atlas → Network Access → Add Vercel IP (0.0.0.0/0) |
| **Database name wrong** | "Database not found" | Use `RK-WEBSITEDB` (case-sensitive) |
| **User permissions** | "User is not authorized" | Check user has readWrite role |
| **Serverless timeout** | Operations never complete | Add timeout: `serverSelectionTimeoutMS: 5000` |

### 5.3 Safe MongoDB Connection for Serverless

```javascript
// ✅ CORRECT: Reuse connection in serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw new Error('Database connection failed');
  }
}

// In your route handler
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5.4 Verify MongoDB Atlas Settings

**Go to**: https://cloud.mongodb.com

```
1. Click: Clusters → RK-WEBSITEDB database
2. Check: Network Access tab
   - IP: 0.0.0.0/0 (allow all - safe on Vercel)
   - Or: Add Vercel's IP range
3. Check: Database Access tab
   - User: sivasuriya2k3_db_user
   - Password: SivaMangodb2026
   - Roles: readWrite@RK-WEBSITEDB
```

---

## 📊 PART 6: VERCEL DIAGNOSTICS & LOGS

### 6.1 Read Vercel Build & Runtime Logs

**Step 1: Go to Vercel**
```
https://vercel.com/dashboard/rk-backend
```

**Step 2: Click Deployments tab**
```
Find the latest deployment (top one)
Click it to open details
```

**Step 3: View Build Logs**
```
Build section shows:
- Dependencies installed ✅
- Build process ✅
- Any errors ❌
```

**Step 4: View Runtime Logs**
```
Click: "Logs" or "Runtime Logs"
Shows errors when API is called:
- Connection errors
- MongoDB errors
- CORS issues
- Undefined variables
```

**Step 5: Real-time Monitoring**
```
Go to: Deployments → Latest → View Logs
New logs appear as requests come in
Use this when testing frontend
```

### 6.2 Common Vercel Runtime Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'express'` | Dependencies not installed | `npm install` in backend folder |
| `process.env.MONGODB_URI is undefined` | Missing env vars in Vercel | Add in Settings → Environment Variables |
| `CORS error` | Frontend origin not allowed | Update CORS in server/index.js |
| `502 Bad Gateway` | Backend crashed | Check logs for errors |
| `504 Gateway Timeout` | MongoDB connection too slow | Add timeout, optimize queries |
| `ReferenceError: req is not defined` | Code syntax error | Check server/index.js syntax |

### 6.3 Debug Production Issues

**If backend works locally but not on Vercel:**

```javascript
// Add detailed logging in server/index.js

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.get('origin'));
  console.log('Headers:', req.headers);
  next();
});

app.get('/api/debug', (req, res) => {
  res.json({
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    clientUrl: process.env.CLIENT_URL,
    uptime: process.uptime()
  });
});
```

**Then check:**
```
https://rk-backend.vercel.app/api/debug

See which environment vars are set/missing
```

---

## 🎯 PART 7: FRONTEND DEPLOYMENT & REDEPLOYMENT

### 7.1 After Changing Frontend API URL

**Step 1: Update .env.production**

```env
VITE_API_URL=https://rk-backend.vercel.app
NODE_ENV=production
```

**Step 2: Commit to Git**

```powershell
cd "c:\Users\sivas\Documents\GitHub\Website-work\RK website\RK website"

git add .env.production
git commit -m "fix: Update API URL to backend Vercel deployment"
git push origin main
```

**Step 3: Vercel Auto-Deploys**

```
Vercel auto-detects push to GitHub
Automatically rebuilds frontend
Takes 1-2 minutes
```

**Step 4: Verify Deployment**

```
https://vercel.com/dashboard/rk
Check: Deployments tab
Latest should have green checkmark
```

### 7.2 Manual Redeploy (if needed)

```
1. Vercel Dashboard → rk project
2. Latest deployment card
3. Click 3-dots menu
4. Select "Redeploy"
5. Wait for build to complete
```

### 7.3 Clear Browser Cache

```powershell
# Frontend might have old API URL cached
# In browser:
1. Open: https://rk.vercel.app
2. Press: F12 (Developer Tools)
3. Right-click refresh button: "Empty cache and hard refresh"
4. Close dev tools
5. Try login again
```

---

## ✅ PART 8: FINAL VERIFICATION CHECKLIST

### 8.1 Pre-Launch Checklist

**Backend Ready?**
```
☐ Backend deployed to Vercel (green checkmark in Deployments)
☐ Vercel environment variables set (MONGODB_URI, JWT_SECRET, etc.)
☐ MongoDB Atlas IP whitelist includes 0.0.0.0/0
☐ server/index.js has NO app.listen()
☐ CORS includes frontend URL
☐ vercel.json is correct (no functions/builds property)
```

**Frontend Ready?**
```
☐ .env.production has VITE_API_URL=https://rk-backend.vercel.app
☐ No hardcoded localhost URLs in code
☐ API calls use import.meta.env.VITE_API_URL
☐ Frontend built and pushed to GitHub
☐ Frontend deployed to Vercel (green checkmark)
```

**Connectivity Verified?**
```
☐ Can open backend URL in browser
☐ Backend returns JSON (not error)
☐ /api/health endpoint returns database status
☐ No CORS errors in browser console
☐ MongoDB connection shows in backend logs
```

### 8.2 Test End-to-End (After Everything)

**Test 1: Health Check**
```
Browser → https://rk-backend.vercel.app/api/health
Expected: { "status": "ok", "database": "connected" }
```

**Test 2: Frontend Loads**
```
Browser → https://rk.vercel.app
Expected: Page loads, no red errors in console
```

**Test 3: Try Login**
```
1. Go to login page
2. Enter credentials
3. Click Login
4. Check browser console (F12):
   - ❌ "Cannot connect to server" = API URL wrong
   - ❌ "CORS error" = Backend CORS wrong
   - ✅ Success or "Invalid credentials" = Working!
```

**Test 4: Check Vercel Logs**
```
Vercel Dashboard → rk-backend → Logs
While testing login, should see:
"POST /api/auth/login 200 OK"
```

### 8.3 Success Indicators

**You're successful when:**

```
✅ Frontend loads without errors
✅ Login button is clickable
✅ No "Cannot connect to server" message
✅ No CORS errors in browser console
✅ Vercel backend logs show requests being received
✅ MongoDB shows documents being queried
✅ Login succeeds or shows correct error (wrong password, etc.)
```

---

## 🚀 QUICK REFERENCE: DEPLOYMENT CHECKLIST

```
┌─────────────────────────────────────────────────────────┐
│ DEPLOYMENT FINAL CHECKLIST                              │
├─────────────────────────────────────────────────────────┤
│ BACKEND:                                                 │
│ ✅ vercel.json fixed (no functions, no builds)          │
│ ✅ server/index.js has export default app               │
│ ✅ CORS includes your frontend URL                       │
│ ✅ MONGODB_URI set in Vercel environment                │
│ ✅ JWT_SECRET set in Vercel environment                 │
│ ✅ MongoDB Atlas whitelists 0.0.0.0/0                   │
│                                                          │
│ FRONTEND:                                                │
│ ✅ .env.production has correct API URL                  │
│ ✅ No hardcoded localhost in code                       │
│ ✅ Committed and pushed to GitHub                       │
│ ✅ Vercel auto-deployed (green checkmark)               │
│                                                          │
│ TESTING:                                                │
│ ✅ Backend API works in browser                         │
│ ✅ Frontend loads without errors                        │
│ ✅ Login button works or shows server error             │
│ ✅ No CORS errors in browser console                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📞 TROUBLESHOOTING QUICK ANSWERS

**Q: "Cannot connect to server" message**
```
A: API URL is wrong in frontend
Fix: Check .env.production has correct Vercel backend URL
```

**Q: CORS error in console**
```
A: Backend doesn't allow your frontend origin
Fix: Add frontend URL to allowedOrigins in server/index.js
```

**Q: Backend works locally but not on Vercel**
```
A: Environment variables not set
Fix: Go to Vercel Settings → Environment Variables → Add them
```

**Q: MongoDB connection fails**
```
A: Connection string wrong or IP not whitelisted
Fix: 1) Check string in Vercel env vars
     2) Whitelist 0.0.0.0/0 in MongoDB Atlas
```

**Q: Vercel says "502 Bad Gateway"**
```
A: Backend crashed
Fix: Check Vercel logs for errors
```

**Q: Still not working?**
```
1. Check Vercel logs (Dashboard → Logs)
2. Test backend directly in browser
3. Verify environment variables in Vercel
4. Check MongoDB Atlas is accessible
5. Verify .env.production in frontend has correct URL
6. Clear browser cache and reload
```

---

## 📋 FILES TO CREATE/UPDATE

**Create these files:**

1. **RK-backend/.env**
```env
MONGODB_URI=mongodb+srv://sivasuriya2k3_db_user:SivaMangodb2026@cluster0.rrnfe5j.mongodb.net/RK-WEBSITEDB
JWT_SECRET=rajkayal_creative_hub_secret_key_2025
NODE_ENV=production
CLIENT_URL=https://rk.vercel.app
PORT=5002
```

2. **RK-website/.env.production**
```env
VITE_API_URL=https://rk-backend.vercel.app
NODE_ENV=production
```

3. **RK-backend/vercel.json** (Already fixed ✅)

**Verify these exist:**
- RK-backend/server/index.js (with CORS, export default app)
- RK-website/src/lib/api.ts (with import.meta.env.VITE_API_URL)

---

**END OF GUIDE**

Next steps: Follow this guide top-to-bottom and let me know which step shows the issue! 🎯
