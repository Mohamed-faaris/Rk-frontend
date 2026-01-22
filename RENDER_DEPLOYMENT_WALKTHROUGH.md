# Step-by-Step Render Deployment Walkthrough

This is a complete walkthrough to deploy your Express backend to Render in ~15 minutes.

---

## 🎯 What You'll Have After This

```
Before:                          After:
localhost:5000 (local only)  →   https://rk-website-api.onrender.com (worldwide)
  ↓                              ↓
Cannot access from anywhere   Accessible from anywhere
  ↓                              ↓
Frontend can't connect        Frontend connects successfully
```

---

## ⏱️ Time Required
- **Preparation:** 5 minutes
- **Deployment:** 3 minutes
- **Configuration:** 2 minutes
- **Testing:** 5 minutes
- **Total:** ~15 minutes

---

## 📋 Prerequisites Checklist

Before starting, verify you have:

```bash
# Check Node.js is installed
node --version
# Should show v16 or higher (e.g., v18.12.0)

# Check npm is installed
npm --version
# Should show version (e.g., 8.19.2)

# Check git is installed and configured
git config user.name
git config user.email
# Should return your name and email

# Check code is pushed to GitHub
git remote -v
# Should show: origin https://github.com/YOUR_USERNAME/YOUR_REPO
```

If any of these fail, install/configure them first.

---

## 🚀 Deployment Steps

### Step 1: Verify Backend Code is Ready (2 min)

**In your terminal:**

```bash
# Navigate to your project
cd "c:\Users\sivas\Documents\GitHub\Website-work\RK website\RK website"

# Test if backend starts locally
npm run dev

# Should see:
# ✓ Server Running on Port 5000
# ✓ CORS enabled
# ✓ MongoDB connected

# Stop server (Ctrl+C)
```

If it doesn't start:
- Fix any errors shown
- Check MongoDB is running locally
- Verify environment variables in .env

### Step 2: Create .env.example (1 min)

**Create file: `.env.example`**

```bash
# Make sure this file exists in your project root
# Copy from RENDER_DEPLOYMENT_GUIDE.md section "Step 4"

# Content should look like:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
CLIENT_URL=http://localhost:5173
```

**Why?** This shows Render (and other developers) what env vars are needed.

### Step 3: Update package.json (1 min)

**Ensure package.json has these scripts:**

```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "build": "echo 'Build complete'"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

**Test it:**
```bash
npm start
# Should start without errors
# Stop with Ctrl+C
```

### Step 4: Commit Changes to GitHub (2 min)

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Prepare backend for Render deployment"

# Push to GitHub
git push origin main

# Verify it's pushed
git log --oneline -1
# Should show your new commit
```

---

## 🌍 Deploy on Render (3 min)

### Step 5a: Go to Render and Connect GitHub

1. **Open https://render.com** in browser
2. **Sign up or log in**
   - Recommended: Sign up with GitHub account
3. **Click "Dashboard"** (top right)

### Step 5b: Create New Service

1. **Click "New +"** button (top left)
2. **Select "Web Service"**
3. **See GitHub integration prompt**
   - If you don't see your repo, click "Install GitHub App"
   - Grant permissions
4. **Select your repository**
5. **Click "Connect"**

### Step 5c: Configure Service

Fill in the form:

| Field | Value | Example |
|-------|-------|---------|
| Name | Any name | `rk-website-api` |
| Environment | Node | (select from dropdown) |
| Region | Closest to you | Singapore / Mumbai / etc |
| Branch | main | (already filled) |
| Build Command | `npm install` | (exact text) |
| Start Command | `npm start` | (exact text) |
| Plan | Free or Paid | Free is fine for testing |

**Screenshot-style visual:**
```
┌─────────────────────────────────────┐
│ Service Name: rk-website-api        │
│ Environment: Node ▼                 │
│ Region: Singapore ▼                 │
│ Branch: main                        │
│ Build Command: npm install          │
│ Start Command: npm start            │
│ Plan: Free ($0/mo) ◎ Paid           │
│ [CREATE WEB SERVICE] button         │
└─────────────────────────────────────┘
```

### Step 5d: Click "Create Web Service"

- Render starts deploying
- You see "Building..." status
- Takes 2-3 minutes
- Shows "Live" when complete ✅

---

## 🔧 Configure Environment Variables (2 min)

### Step 6: Add Environment Variables in Render

While deployment is running (or after it finishes):

1. **In Render Dashboard**
2. **Click your service** (rk-website-api)
3. **Look for "Environment"** in left sidebar
4. **Click "Environment"**
5. **Click "Add Environment Variable"**

**Add these variables one by one:**

```
Variable: NODE_ENV
Value: production
→ Click "Save"

Variable: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
→ Click "Save"

Variable: JWT_SECRET
Value: (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
→ Click "Save"

Variable: CLIENT_URL
Value: https://your-frontend.vercel.app (UPDATE LATER after frontend deploy)
→ Click "Save"
```

### How to Generate JWT_SECRET

Run this command locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You'll get something like:
```
a3f8e9d2c1b4f6e9a2c7d8e1f9b3a6c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7
```

Copy it and paste into Render.

**After saving each variable:** Render auto-restarts your service (takes ~30 seconds).

---

## ✅ Verify Deployment (5 min)

### Step 7: Test Health Endpoint

1. **Get your public URL from Render**
   - In Render Dashboard → Click your service
   - Top right shows: `https://rk-website-api.onrender.com`
   - (Actual name depends on your service name)

2. **Test it:**

**Option A: Browser**
```
Go to: https://your-service.onrender.com/health

Should see:
{
  "status": "OK",
  "timestamp": "2024-01-21T10:30:45.123Z",
  "uptime": 123.456
}
```

**Option B: Terminal**
```bash
curl https://your-service.onrender.com/health
```

### Step 8: Test API Endpoint

```bash
# Should return API status
curl https://your-service.onrender.com/api/status

# Should see:
# {"message":"API is running","environment":"production"}
```

### Step 9: Check Logs

1. **In Render Dashboard**
2. **Click your service**
3. **Scroll down to "Logs"**
4. **Should see:**
   ```
   ✓ Server Running on Port 5000
   ✓ CORS enabled
   ✓ MongoDB connected
   ```

If you see errors, fix them (see Common Issues section).

---

## 🔗 Connect Frontend to Backend (3 min)

### Step 10: Update Frontend Environment Variables

**In your frontend project:**

1. **Create/Edit `.env.production`**
   ```
   VITE_API_URL=https://your-service.onrender.com
   ```

2. **Create/Edit `.env.development`**
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Step 11: Update API Client Code

**In `src/lib/api.ts` (or similar):**

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

### Step 12: Redeploy Frontend

```bash
# In frontend directory
cd path/to/frontend

# Commit changes
git add .
git commit -m "Update backend API URL for production"
git push origin main

# Vercel auto-deploys (2-3 minutes)
```

---

## 🧪 End-to-End Test (5 min)

### Step 13: Test Complete Flow

1. **Open your deployed frontend in browser**
   - Example: `https://your-frontend.vercel.app`

2. **Open Developer Tools (F12)**
   - Press F12
   - Go to "Network" tab

3. **Try an API operation:**
   - Click login button
   - Fill in credentials
   - Click submit

4. **In Network tab, you should see:**
   - Request to `https://your-service.onrender.com/api/auth/login`
   - Status: 200 (or 401 if wrong password)
   - No CORS errors in console

5. **Check Console for errors:**
   - No red errors
   - If errors, see Common Issues

---

## 🎉 Success Indicators

You're done when you see ✅ all of these:

- ✅ Render dashboard shows "Live" status
- ✅ `/health` endpoint returns OK
- ✅ `/api/status` endpoint returns success
- ✅ Logs show "MongoDB connected"
- ✅ Frontend loads without errors
- ✅ Frontend API calls work (Network tab shows 200)
- ✅ Authentication/login works
- ✅ File uploads work
- ✅ No CORS errors in console

---

## ❌ Common Issues During Deployment

### Issue 1: Service Shows "Deploy Failed"

**What to do:**
1. Click the service
2. Scroll to "Logs"
3. Look for red error text
4. Common errors:
   - `Cannot find module 'express'` → npm install didn't run
   - `PORT is not defined` → Missing env variable
   - `Cannot connect to MongoDB` → Wrong connection string

**Fix:**
```bash
# Update code and push
git add .
git commit -m "Fix deployment issue"
git push origin main

# Or redeploy in Render:
# Click service → Manual Deploy button
```

### Issue 2: "CORS: No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend URL not in allowed origins

**Fix:**
```javascript
// In server/index.js, add your frontend URL:
const allowedOrigins = [
  'https://your-actual-frontend.vercel.app',
  process.env.CLIENT_URL,
];
```

Then push and redeploy.

### Issue 3: "Cannot find /uploads or /api/orders"

**Cause:** Wrong route configured

**Fix:**
```javascript
// Check server/index.js has:
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(...));
```

### Issue 4: Frontend Gets 504 Error

**Cause:** Render service asleep (free tier sleeps after 15 min inactivity)

**Solution:**
- Upgrade to paid plan ($7/month) for always-on
- Or upgrade to Render's standard plan

**For now:**
- Click the `/health` endpoint to wake it up
- Wait 30 seconds
- Try again

---

## 📞 Getting Your Public URLs

### Backend URL
```
Found in: Render Dashboard → Service → Top right corner
Format: https://service-name.onrender.com
Example: https://rk-website-api.onrender.com
```

### Frontend URL
```
Found in: Vercel Dashboard → Project
Format: https://project-name.vercel.app
Example: https://rk-website.vercel.app
```

---

## 📊 Monitoring Your Deployment

### Check Status Anytime
1. **Go to https://dashboard.render.com**
2. **Click your service**
3. **See "Live" = ✅ Running**
4. **See "Deploying" = ⏳ Building**
5. **See "Failed" = ❌ Error**

### View Logs Anytime
1. **Dashboard → Service → Logs** (bottom)
2. **See all requests and errors**
3. **Scroll to see more history**

### Performance Metrics
1. **Dashboard → Service → Metrics**
2. **See CPU, Memory, Network**
3. **Alert if any goes too high**

---

## 🔄 Making Updates After Deployment

### Scenario: Fix a bug in backend

```bash
# 1. Make changes locally
# Edit server/index.js (example)

# 2. Test locally
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Fix bug in auth route"
git push origin main

# 4. Render auto-deploys (in ~1 minute)
# Check in Render dashboard

# 5. Test public URL
curl https://your-service.onrender.com/health
```

### Scenario: Update Environment Variable

```bash
# 1. Go to Render Dashboard
# 2. Click your service
# 3. Click Environment
# 4. Edit variable
# 5. Click Save
# 6. Service auto-restarts (30 seconds)
# 7. Test it works
```

---

## 💾 Backup and Recovery

### What Render Keeps
- Your code (from GitHub)
- Environment variables (encrypted)
- Logs (last 1000 lines)

### What Render Doesn't Keep
- Files uploaded to /uploads (use cloud storage like AWS S3)
- Database data (use MongoDB Atlas or similar)

### If Something Goes Wrong
1. **Check logs for error message**
2. **Look at recent git commits**
3. **Revert bad commit: `git revert <commit_id>`**
4. **Push: `git push origin main`**
5. **Render redeploys automatically**

---

## ✨ Next: Optimize for Production

After deployment is working:

1. **Add error tracking:**
   - Sentry (free tier available)
   - Better error reporting

2. **Add database backups:**
   - MongoDB Atlas backups
   - Daily automated backups

3. **Add monitoring/alerts:**
   - Render notifications
   - Email alerts if service fails

4. **Secure secrets:**
   - Rotate JWT_SECRET monthly
   - Use strong database passwords

5. **Add rate limiting:**
   - Prevent API abuse
   - Protect login endpoints

---

## 🎓 Learning Resources

**Render Documentation:**
- https://render.com/docs

**Express.js Guide:**
- https://expressjs.com

**CORS Explained:**
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

**MongoDB Atlas:**
- https://www.mongodb.com/cloud/atlas

---

## 📝 Checklist Summary

```bash
✅ Code ready and tested locally
✅ package.json has correct scripts
✅ .env.example created
✅ Changes committed to GitHub
✅ Render service created
✅ Environment variables set
✅ Health endpoint working
✅ Logs show no errors
✅ Frontend updated with new URL
✅ Frontend redeploy complete
✅ End-to-end test passed
✅ CORS working
✅ Database connected
✅ Monitoring enabled

🎉 DEPLOYMENT COMPLETE! 🎉
```

---

## 🚀 You're Ready!

Your Express backend is now:
- Deployed on Render
- Accessible worldwide
- Connected to your frontend
- Running in production
- Being monitored for errors

**Share your API URL:** `https://your-service.onrender.com`

---

**Need help? Check the troubleshooting guide or contact Render support.**

Good luck! 🎉
