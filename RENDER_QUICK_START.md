# 🎯 RENDER ENVIRONMENT SETUP - START HERE (5 MINUTES)

## What You Need to Do - Right Now

### ✅ Step 1: Deploy to Render (2 minutes)

```
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Build Command: npm install
5. Start Command: npm start
6. Click "Create Web Service"
```

**Wait for:**
- Service dashboard appears
- Status shows "Deploying..."

---

### ✅ Step 2: Add Environment Variables (2 minutes)

**Go to:** Service Dashboard → **"Environment"** tab

**Add each one by clicking "Add Environment Variable":**

```
Name: NODE_ENV
Value: production
[Add]

Name: PORT
Value: 10000
[Add]

Name: LOG_LEVEL
Value: info
[Add]

Name: CORS_ORIGIN
Value: *
[Add]

Name: API_TIMEOUT
Value: 30000
[Add]

Name: DB_CONNECTION_POOL_SIZE
Value: 10
[Add]
```

---

### ✅ Step 3: Add Secrets (1 minute)

**Same Tab → Find "Secrets" section**

**Add MongoDB Connection String:**

```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/rk_database
[Add]
```

**Get this from:**
1. Go to https://cloud.mongodb.com
2. Click "Connect" → "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `username`, `password`, database name
5. Paste in Render

**Add JWT Secret:**

```
Name: JWT_SECRET
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
[Add]
```

**Generate with:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### ✅ Step 4: Restart & Test (30 seconds)

```
1. Click "Restart Latest Deployment" (top right)
2. Watch logs for "Live" status
3. Test: curl https://your-service.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production"
}
```

---

## 🎉 Done! Your backend is live on Render!

---

## 📚 Need More Details?

| Question | Read This |
|----------|-----------|
| Step-by-step with screenshots | [RENDER_ENV_SETUP.md](./RENDER_ENV_SETUP.md) |
| Quick reference card | [RENDER_ENV_QUICK_REFERENCE.md](./RENDER_ENV_QUICK_REFERENCE.md) |
| Code examples | [RENDER_ENV_EXAMPLES.js](./RENDER_ENV_EXAMPLES.js) |
| Troubleshooting | [RENDER_ENV_CONFIG.md](./RENDER_ENV_CONFIG.md) |
| Environment template | [.env.render.example](./.env.render.example) |
| Complete overview | [RENDER_ENV_SUMMARY.md](./RENDER_ENV_SUMMARY.md) |

---

## 🔑 Key Differences

### Environment Variables (Visible in logs)
- Node.js environment (`NODE_ENV`)
- Server port (`PORT`)
- Logging level (`LOG_LEVEL`)
- CORS settings (`CORS_ORIGIN`)

### Secrets (Hidden from logs)
- MongoDB connection (`MONGODB_URI`)
- Authentication token (`JWT_SECRET`)
- API keys (SendGrid, Stripe, etc.)

---

## 💻 How Your Code Reads These

Your Node.js code automatically reads these:

```javascript
const mongoUri = process.env.MONGODB_URI;      // From Secrets
const port = process.env.PORT;                 // From Environment
const jwtSecret = process.env.JWT_SECRET;      // From Secrets
const nodeEnv = process.env.NODE_ENV;          // From Environment

// NO dotenv needed on Render!
// Render automatically sets all these
```

---

## ✨ Complete Checklist

- [ ] Render service created
- [ ] Environment variables added (6 variables)
- [ ] MongoDB URI set in Secrets
- [ ] JWT Secret set in Secrets
- [ ] Service restarted
- [ ] Health endpoint responds
- [ ] Logs show "Live" status
- [ ] Database connection confirmed

---

**You're done!** 🚀 Your backend is running on Render with all environment variables configured!

Next: Connect your frontend to `https://your-service.onrender.com/api`
