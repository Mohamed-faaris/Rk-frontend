# 🚀 RENDER ENVIRONMENT VARIABLES - QUICK REFERENCE

## The Simplest Way to Set Up Environment Variables for Render

---

## ⚡ 3-Step Quick Start

### Step 1: Create Render Service
```bash
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select your GitHub repo
4. Set Build: npm install
5. Set Start: npm start
6. Click "Create"
```

### Step 2: Add Environment Variables (5 minutes)
```
Go to Service → Environment tab
Add these ONE BY ONE:

NODE_ENV = production
PORT = 10000
LOG_LEVEL = info
CORS_ORIGIN = *
API_TIMEOUT = 30000
```

### Step 3: Add Secrets (3 minutes)
```
Same Environment tab, find Secrets section
Add these (these are hidden/encrypted):

MONGODB_URI = [your connection string]
JWT_SECRET = [generated secret key]
```

**Done!** ✅ Your backend is live.

---

## 📋 Environment Variables Checklist

### Regular Variables (SET IN ENVIRONMENT TAB)
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `10000`
- ✅ `LOG_LEVEL` = `info`
- ✅ `CORS_ORIGIN` = `https://yourdomain.com` or `*`
- ✅ `API_TIMEOUT` = `30000`
- ✅ `DB_CONNECTION_POOL_SIZE` = `10`

### Secret Variables (SET IN SECRETS TAB)
- ✅ `MONGODB_URI` = `mongodb+srv://user:pass@cluster.mongodb.net/db`
- ✅ `JWT_SECRET` = `[generated-32-char-key]`
- ✅ `SENDGRID_API_KEY` = `SG.xxxxx` (optional)
- ✅ `STRIPE_API_KEY` = `sk_live_xxxxx` (optional)

---

## 🔑 Difference: Environment vs Secrets

| Variable Type | Where to Set | Visible in Logs | In Code |
|---|---|---|---|
| **Environment** | Environment tab | ✅ Yes | `process.env.PORT` |
| **Secret** | Secrets tab | ❌ No (hidden) | `process.env.MONGODB_URI` |

**RULE:** Use **Secrets** for anything with a password or API key!

---

## 💻 How Code Reads Variables

**Your code reads these automatically:**

```javascript
// Works on Render!
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT;

// NO dotenv needed on Render
// (dotenv is only for local development)
```

---

## 🔧 Getting MongoDB Connection String

1. Go to https://cloud.mongodb.com
2. Click "Connect" → "Drivers" → "Node.js"
3. Copy the string (looks like):
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true
   ```
4. Replace:
   - `username` with your MongoDB user
   - `password` with your MongoDB password
5. Add `/dbname` at the end:
   ```
   mongodb+srv://user:pass@cluster0.mongodb.net/rk_database
   ```
6. Paste in Render Secrets as `MONGODB_URI`

---

## 🔒 Generate JWT Secret

**Run this command once:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

Copy this → Paste in Render as `JWT_SECRET`

---

## ✅ Verify Everything Works

### Test 1: Health Endpoint
```bash
curl https://your-render-service.onrender.com/api/health
```

**Should return:**
```json
{
  "status": "healthy",
  "environment": "production",
  "port": "10000"
}
```

### Test 2: Check Logs
1. Render Dashboard → Logs tab
2. Should see:
   ```
   ✓ MongoDB connected successfully
   ✓ Server running on port 10000
   ```

### Test 3: Frontend Connection
```javascript
// In your React frontend:
const API_URL = 'https://your-render-service.onrender.com/api';

fetch(`${API_URL}/users`)
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG - Committing secrets to git
```javascript
// Never do this!
const MONGODB_URI = "mongodb+srv://user:password@...";
```

### ✅ RIGHT - Use environment variables
```javascript
// Do this instead
const MONGODB_URI = process.env.MONGODB_URI;
```

---

### ❌ WRONG - Using regular env vars for secrets
```
Environment Variables tab:
MONGODB_URI = mongodb+srv://... ← VISIBLE IN LOGS!
```

### ✅ RIGHT - Use secrets for sensitive data
```
Secrets tab:
MONGODB_URI = mongodb+srv://... ← HIDDEN!
```

---

### ❌ WRONG - Using dotenv on Render
```javascript
// Don't use this on Render!
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI;
```

### ✅ RIGHT - Just use process.env
```javascript
// Render sets these automatically
const mongoUri = process.env.MONGODB_URI;
```

---

## 📞 Troubleshooting Quick Fixes

### Problem: "Cannot connect to MongoDB"
**Fix:** 
1. Copy MongoDB URI correctly (check for spaces)
2. In MongoDB Atlas → Network Access → Add `0.0.0.0/0`
3. Restart Render service

### Problem: "JWT is undefined"
**Fix:**
1. Go to Render → Environment tab
2. Find JWT_SECRET in Secrets section
3. If missing, add it
4. Restart service

### Problem: "CORS error"
**Fix:**
1. Set `CORS_ORIGIN = https://yourdomain.com` (or `*` for testing)
2. Restart service

### Problem: "Build failed"
**Fix:**
1. Check logs for error message
2. Ensure `api/package.json` exists
3. Restart build

---

## 📊 Environment-Specific Settings

### Development (Local Machine)
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rk_database
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
```

### Production (Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/rk_database
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
```

---

## 🎯 Step-by-Step Render Dashboard

```
1. Dashboard Home
   ↓
2. Click "New +" → "Web Service"
   ↓
3. Select GitHub repo
   ↓
4. Set Build Command: npm install
   ↓
5. Set Start Command: npm start
   ↓
6. Click "Create Web Service"
   ↓
7. Wait for deployment → Click "Environment" tab
   ↓
8. Add environment variables (PORT, NODE_ENV, etc.)
   ↓
9. Add secrets (MONGODB_URI, JWT_SECRET)
   ↓
10. Click "Restart Latest Deployment"
   ↓
11. Check "Logs" tab → Wait for "Live" status
   ↓
12. Service URL shows at top: https://service-xxxxx.onrender.com
```

---

## 📁 Related Documentation

- **Main Guide:** [RENDER_ENV_SETUP.md](./RENDER_ENV_SETUP.md)
- **Code Examples:** [RENDER_ENV_EXAMPLES.js](./RENDER_ENV_EXAMPLES.js)
- **Full Deployment:** [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
- **Config Details:** [RENDER_ENV_CONFIG.md](./RENDER_ENV_CONFIG.md)

---

## ✨ You're Ready!

Your environment variables are now configured on Render. Your backend:
- ✅ Connects to MongoDB
- ✅ Reads secrets securely
- ✅ Uses environment-specific config
- ✅ Is production-ready

**Next:** Connect your frontend and you're done! 🎉

