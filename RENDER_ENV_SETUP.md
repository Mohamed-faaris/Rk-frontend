# RENDER DEPLOYMENT ENVIRONMENT CONFIGURATION GUIDE

## 📋 Quick Overview

This guide shows you how to:
1. Set environment variables in Render Dashboard
2. Use secrets safely (MONGODB_URI, API keys)
3. How your Node.js code reads these values
4. Test that everything is working

---

## 🔑 Environment Variables vs Secrets

### Environment Variables (Public)
- Visible in code, git, logs
- Use for: `NODE_ENV`, `PORT`, `LOG_LEVEL`, `CORS_ORIGIN`
- Can be committed to git (in example files)
- Example: `NODE_ENV=production`

### Secrets (Private)
- **Hidden from logs and code**
- Use for: `MONGODB_URI`, `JWT_SECRET`, API keys (Stripe, SendGrid, etc.)
- **NEVER commit to git**
- Set only in Render Dashboard
- Example: `MONGODB_URI=mongodb+srv://...`

---

## 🚀 Step 1: Create Render Service

### A. Create Service on Render.com

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Select your Git repository (GitHub, GitLab, etc.)
4. Configure:
   - **Name**: `rk-website-api` (or your project name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for testing) or `Standard` (production)

### B. Select Render Region
- Choose: **Oregon** (recommended for fastest US access)
- Or **Frankfurt** (for EU users)

---

## 🌍 Step 2: Add Environment Variables in Render Dashboard

### A. Environment Variables (Non-Secret)

1. In your Render service dashboard, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add these variables **one by one**:

| Variable | Value | Note |
|----------|-------|------|
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `10000` | Render uses this port |
| `LOG_LEVEL` | `info` | Logging level (debug/info/warn/error) |
| `CORS_ORIGIN` | `*` | Allow all origins (or specify domain) |
| `API_TIMEOUT` | `30000` | 30 seconds timeout |
| `DB_CONNECTION_POOL_SIZE` | `10` | Connection pool for MongoDB |

**Visual Example:**
```
Variable Name: NODE_ENV
Value: production
[Add Environment Variable]

Variable Name: PORT
Value: 10000
[Add Environment Variable]
```

### B. Secret Variables (Sensitive Data)

1. In same **"Environment"** tab, scroll to **"Secret Files"** or **"Encrypted Environment Variables"**
2. Click **"Add Secret"** or **"Add Environment Variable"** (Render will encrypt it)
3. Add these **DO NOT share these values**:

#### 🔒 MongoDB Connection String

```
Variable Name: MONGODB_URI
Value: mongodb+srv://username:password@your-cluster.mongodb.net/rk_database?retryWrites=true&w=majority
```

**How to get this:**
- Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) (MongoDB Atlas)
- Create free cluster or connect existing one
- Click "Connect" → "Drivers" → "Node.js"
- Copy connection string: `mongodb+srv://...`
- Replace `<username>` with your DB user
- Replace `<password>` with your DB password
- Replace `<dbname>` with `rk_database`

#### 🔒 JWT Secret (for authentication)

```
Variable Name: JWT_SECRET
Value: your-super-secret-key-min-32-characters-long-12345678
```

**Generate a strong secret:**
```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 🔒 API Keys (if needed)

```
Variable Name: SENDGRID_API_KEY
Value: SG.your-actual-key-here

Variable Name: STRIPE_API_KEY
Value: sk_live_your-actual-key-here
```

---

## 📖 Step 3: How Your Code Reads These Variables

Your Node.js code uses `process.env` to access environment variables set in Render:

### Example 1: Reading MongoDB URI

**File: `api/lib/mongodb.js`**
```javascript
const mongodb = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
// Render automatically sets this from the Environment/Secrets section

async function connectDB() {
  const client = new mongodb.MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}
```

### Example 2: Reading Environment Config

**File: `api/routes/health.js`**
```javascript
const nodeEnv = process.env.NODE_ENV;  // = "production" from Render
const port = process.env.PORT;         // = "10000" from Render
const logLevel = process.env.LOG_LEVEL; // = "info" from Render

module.exports = async (req, res) => {
  res.json({
    status: 'ok',
    environment: nodeEnv,
    port: port,
    logLevel: logLevel,
    timestamp: new Date()
  });
};
```

### Example 3: Using Secrets in Code

**File: `api/routes/auth.js` (example)**
```javascript
const jwtSecret = process.env.JWT_SECRET;
// Automatically loaded from Render's encrypted secrets

function authenticateToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}
```

---

## ✅ Step 4: Deploy and Test

### A. Deploy Your Backend

1. Go to your Render service dashboard
2. You should see **"Deploying..."** at the top
3. Wait for the message: **"Build successful"** ✅
4. Your service URL will appear: `https://rk-website-api-xxxxx.onrender.com`

### B. Test API Endpoints

Once deployed, test with curl or Postman:

```bash
# Test health endpoint
curl https://rk-website-api-xxxxx.onrender.com/api/health

# Expected response:
# {
#   "status": "ok",
#   "database": "connected",
#   "environment": "production",
#   "timestamp": "2026-01-22T..."
# }
```

### C. Check Logs

1. In Render dashboard, go to **"Logs"** tab
2. You should see logs like:
```
[info] MongoDB connected successfully
[info] Server running on port 10000
[info] CORS enabled for all origins
```

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'dotenv'"

**Solution:** You don't need dotenv on Render. Render automatically sets environment variables.

**Your code should use:**
```javascript
const mongoUri = process.env.MONGODB_URI; // ✅ Works on Render
// NOT: require('dotenv').config(); ❌ Not needed
```

### Problem: "MONGODB_URI is undefined"

**Solution:** Check Render dashboard:
1. Go to **"Environment"** tab
2. Verify `MONGODB_URI` is there
3. Restart the service: Click **"Restart Latest Deployment"**

### Problem: "Connection timeout to MongoDB"

**Solution:** 
1. Check MongoDB connection string format:
   - Should start with: `mongodb+srv://`
   - Should include username and password
   - Should include database name

2. If using MongoDB Atlas, add Render IP to whitelist:
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - **"Network Access"** → **"Add IP Address"**
   - Enter: `0.0.0.0/0` (allow all IPs, or Render's static IP if available)

### Problem: "CORS error from frontend"

**Solution:** Check `CORS_ORIGIN` environment variable:
```javascript
// In Render dashboard, set:
CORS_ORIGIN=https://yourdomain.com
// Or for testing:
CORS_ORIGIN=*
```

---

## 📋 Environment Variables Checklist

**Before deploying to production:**

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = Set in Render secrets (not in .env file)
- [ ] `JWT_SECRET` = Set in Render secrets (generated randomly)
- [ ] `LOG_LEVEL` = `info` (not `debug` in production)
- [ ] `CORS_ORIGIN` = Correct domain (not `*`)
- [ ] API keys set in Render secrets (Stripe, SendGrid, etc.)
- [ ] Database backups enabled
- [ ] Logging configured
- [ ] Error monitoring setup (optional: Sentry, etc.)

---

## 🔗 Frontend Integration

Your React/Vite frontend should use the Render API URL:

**File: `src/lib/api.js`**
```javascript
const API_URL = process.env.VITE_API_URL || 'https://rk-website-api-xxxxx.onrender.com/api';

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}
```

**For Vite, create `.env.production`:**
```env
VITE_API_URL=https://rk-website-api-xxxxx.onrender.com/api
```

---

## 📝 Common Environment Configurations

### Development (Local)
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rk_database
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
```

### Staging (Render)
```env
NODE_ENV=staging
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/rk_database
LOG_LEVEL=info
CORS_ORIGIN=https://staging.yourdomain.com
```

### Production (Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@production-cluster.mongodb.net/rk_database
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
```

---

## 🎯 Next Steps

1. ✅ Add all environment variables to Render Dashboard
2. ✅ Deploy your backend service
3. ✅ Test endpoints with curl/Postman
4. ✅ Connect your React frontend to the API URL
5. ✅ Monitor logs for errors
6. ✅ Set up error monitoring (Sentry, DataDog, etc.)

---

## 📞 Need Help?

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.mongodb.com/atlas/
- **Node.js Docs**: https://nodejs.org/docs/
- **Express Docs**: https://expressjs.com/

