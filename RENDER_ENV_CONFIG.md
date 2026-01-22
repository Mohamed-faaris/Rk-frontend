# 🔐 RENDER ENVIRONMENT & SECRETS MANAGEMENT GUIDE

## Complete Guide to Setting Up Environment Variables, Secrets, and API Keys on Render

---

## 📚 What This Guide Covers

1. **Environment Variables** - Non-sensitive config (NODE_ENV, PORT, etc.)
2. **Secrets** - Sensitive data (MongoDB URI, API keys, JWT tokens)
3. **How Code Reads Them** - Using `process.env` in Node.js
4. **Render Dashboard Setup** - Step-by-step UI walkthrough
5. **Common Mistakes** - What NOT to do
6. **Testing & Verification** - Ensure everything works

---

## 🎯 Key Concept: Variables vs Secrets

### ❌ WRONG - Committing Secrets to Git

```javascript
// ❌ NEVER do this!
const MONGODB_URI = "mongodb+srv://user:password@cluster.mongodb.net/db";
module.exports = { MONGODB_URI };
```

**Why?** Anyone with git access sees your passwords and API keys!

### ✅ RIGHT - Using Environment Variables

```javascript
// ✅ This is correct
const MONGODB_URI = process.env.MONGODB_URI;
// Value comes from Render Dashboard, not git
module.exports = { MONGODB_URI };
```

---

## 📋 Environment Variables List

### Regular Variables (Can be Public)

These are safe to commit to `.env.example`:

```env
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
API_TIMEOUT=30000
DB_CONNECTION_POOL_SIZE=10
MAX_REQUESTS_PER_MINUTE=100
```

### Secret Variables (NEVER Commit)

These must be set only in Render Dashboard:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-must-be-32-chars-minimum
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_API_KEY=sk_live_your-actual-key-here
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_PASSWORD=your-secure-password
```

---

## 🚀 Step 1: Prepare Your Backend Code

### A. Check Your Code Uses `process.env`

**File: `api/lib/mongodb.js`**
```javascript
const mongodb = require('mongodb');

// ✅ Correct - reads from environment
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  const client = new mongodb.MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

module.exports = { connectDB };
```

### B. Create `.env.example` (Safe to Commit)

**File: `.env.example`**
```env
# Copy this to .env.render and fill in real values
# Values marked with [REQUIRED] must be set in Render Dashboard

# ============ APPLICATION CONFIG ============
NODE_ENV=production          # production | staging | development
PORT=10000                   # Render uses 10000
LOG_LEVEL=info              # debug | info | warn | error

# ============ DATABASE CONFIG ============
# [REQUIRED] - Set in Render Secrets (not git!)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db

# ============ SECURITY ============
# [REQUIRED] - Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=generate-and-set-in-render

# ============ API CONFIGURATION ============
CORS_ORIGIN=https://yourdomain.com  # Your frontend domain
API_TIMEOUT=30000

# ============ THIRD-PARTY APIS ============
# [REQUIRED] - Set in Render Secrets (not git!)
SENDGRID_API_KEY=SG.your-key-here
STRIPE_API_KEY=sk_live_your-key-here
```

**IMPORTANT:** Add to `.gitignore`:
```
.env
.env.local
.env.*.local
.env.render
```

---

## 🛠️ Step 2: Deploy to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Click **"Create"**

(Service will start deploying...)

---

## 🔑 Step 3: Add Environment Variables in Render Dashboard

### A. Regular Environment Variables

1. In Render Dashboard, click your service
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"** for each:

```
Variable Name: NODE_ENV
Value: production
[Add Environment Variable]

Variable Name: PORT
Value: 10000
[Add Environment Variable]

Variable Name: LOG_LEVEL
Value: info
[Add Environment Variable]

Variable Name: CORS_ORIGIN
Value: https://yourdomain.com
[Add Environment Variable]

Variable Name: API_TIMEOUT
Value: 30000
[Add Environment Variable]
```

**Visual Walkthrough:**

```
┌─────────────────────────────────────────────┐
│ RK Website API Service                      │
├─────────────────────────────────────────────┤
│ [Service] [Events] [Logs] [Settings]        │
│ [Environment] ← YOU ARE HERE                │
├─────────────────────────────────────────────┤
│ Environment Variables                       │
│                                             │
│ Name    │ Value                             │
│ ─────────────────────────────────           │
│ NODE_ENV     │ production    │ [Delete]    │
│ PORT         │ 10000         │ [Delete]    │
│ LOG_LEVEL    │ info          │ [Delete]    │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

### B. Secret Variables (MongoDB, API Keys)

1. In same **"Environment"** tab
2. Look for **"Secret Files"** or scroll down to secrets section
3. Click **"Add Secret"** for each sensitive variable:

#### 🔒 MongoDB Connection String

```
Name: MONGODB_URI
Value: mongodb+srv://rajkayal:SecurePassword123@cluster0.mongodb.net/rk_database?retryWrites=true&w=majority
```

**How to get this:**
- Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Go to **"Clusters"** → Click **"Connect"**
- Choose **"Drivers"** → **"Node.js"**
- Copy the connection string
- Replace `<username>` with your DB username
- Replace `<password>` with your DB password

#### 🔒 JWT Secret (for Authentication)

```
Name: JWT_SECRET
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

**Generate a secure secret:**
```bash
# In your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

Copy this output and paste in Render secret value.

#### 🔒 SendGrid API Key (Email Service)

```
Name: SENDGRID_API_KEY
Value: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get from [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys)

#### 🔒 Stripe API Key (Payments)

```
Name: STRIPE_API_KEY
Value: sk_live_your-actual-key-here
```

Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

---

## 💻 Step 4: How Your Code Reads These Values

### Simple Example

**Your Express Server:**
```javascript
const express = require('express');
const app = express();

const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

// MongoDB connection
const mongodb = require('mongodb');
const client = new mongodb.MongoClient(mongoUri);

// Express setup
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    env: process.env.NODE_ENV,
    port: port,
    mongodb: client.topology ? 'connected' : 'disconnected'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Log Level: ${process.env.LOG_LEVEL}`);
});
```

### Reading Secrets in Route Handlers

```javascript
// api/routes/auth.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  
  try {
    const token = jwt.sign(
      { userId: 123, email: 'user@example.com' },
      jwtSecret,  // ← Read from environment
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Sending Email with SendGrid

```javascript
// api/routes/send-email.js
const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  // Read API key from environment
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  try {
    await sgMail.send({
      to: 'user@example.com',
      from: 'noreply@yourdomain.com',
      subject: 'Welcome!',
      text: 'Welcome to RK Website'
    });
    
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## ✅ Step 5: Restart & Verify

### A. Restart Service

1. Render Dashboard → Your service
2. Click **"Restart Latest Deployment"** (top right)
3. Wait for logs to show **"Live"**

### B. Check Logs

1. Click **"Logs"** tab
2. Should see:
```
✓ npm install completed
✓ Starting application
✓ MongoDB connected successfully
✓ Server running on port 10000
✓ All environment variables loaded
```

### C. Test Health Endpoint

```bash
curl https://rk-website-api-xxxxx.onrender.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "env": "production",
  "port": "10000",
  "mongodb": "connected"
}
```

---

## 🐛 Troubleshooting

### ❌ Error: "MONGODB_URI is undefined"

**Cause:** Secret not set in Render

**Fix:**
1. Render Dashboard → **"Environment"** tab
2. Find `MONGODB_URI` in Secrets section
3. If missing, **"Add Secret"** and set it
4. Click **"Restart"**

---

### ❌ Error: "Cannot find module '@sendgrid/mail'"

**Cause:** Package not installed

**Fix:**
1. Add to `api/package.json`:
   ```json
   "dependencies": {
     "@sendgrid/mail": "^7.7.0"
   }
   ```
2. Push to GitHub
3. Render auto-deploys

---

### ❌ Error: "JWT is malformed"

**Cause:** JWT_SECRET not set or wrong value

**Fix:**
1. Generate new secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update `JWT_SECRET` in Render Secrets
3. Restart service

---

### ❌ Error: "Cannot connect to MongoDB"

**Cause:** Wrong connection string or IP not whitelisted

**Fix:**
1. Check MongoDB URI format:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/database
   ```
2. In MongoDB Atlas:
   - **Network Access** → **"Add IP Address"**
   - Enter `0.0.0.0/0` (or Render's static IP)
   - Click **"Confirm"**
3. Restart Render service

---

## 🔄 Updating Environment Variables

### When Code Needs New Variables

1. Add to `api/code.js`:
   ```javascript
   const newVariable = process.env.NEW_VARIABLE;
   ```

2. Add to `.env.example`:
   ```env
   NEW_VARIABLE=example-value
   ```

3. In Render Dashboard:
   - **Environment** tab
   - **"Add Environment Variable"**
   - Name: `NEW_VARIABLE`
   - Value: your-value
   - Click **"Restart"**

### Updating Existing Variables

1. Render Dashboard → **"Environment"** tab
2. Find variable → Click **"Edit"**
3. Change value → Click **"Save"**
4. Click **"Restart Latest Deployment"**

---

## 🎓 Environment Configurations for Different Stages

### Development (Local)

**`.env` file (not committed to git):**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rk_database
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret-key
SENDGRID_API_KEY=dev-key
```

**Run locally:**
```bash
npm run dev
```

### Staging (Render)

**Render Dashboard Environment Variables:**
```
NODE_ENV = staging
LOG_LEVEL = debug
CORS_ORIGIN = https://staging.yourdomain.com
API_TIMEOUT = 30000

[Secrets]
MONGODB_URI = mongodb+srv://staging-user:pass@staging-cluster.mongodb.net/rk_database
JWT_SECRET = staging-secret-key-xxxxx
```

### Production (Render)

**Render Dashboard Environment Variables:**
```
NODE_ENV = production
LOG_LEVEL = warn
CORS_ORIGIN = https://yourdomain.com
API_TIMEOUT = 60000

[Secrets]
MONGODB_URI = mongodb+srv://prod-user:pass@prod-cluster.mongodb.net/rk_database
JWT_SECRET = prod-secret-key-xxxxx
SENDGRID_API_KEY = SG.prod-key
STRIPE_API_KEY = sk_live_prod-key
```

---

## 📝 Complete Checklist

- [ ] Code uses `process.env` for all config
- [ ] `.gitignore` includes `.env*` files
- [ ] `.env.example` created with descriptions
- [ ] Render service created and deploying
- [ ] All regular env variables added to Render
- [ ] All secrets added to Render (not regular env vars)
- [ ] Service restarted after adding variables
- [ ] Logs show "Live" status
- [ ] `/api/health` endpoint responds
- [ ] MongoDB connection confirmed in logs
- [ ] Frontend can connect to API
- [ ] All tests passing

---

## 🎯 Quick Reference

| Task | Location | Steps |
|------|----------|-------|
| Add environment variable | Render → Environment | Click "Add Env Variable" |
| Add secret | Render → Environment | Click "Add Secret" |
| View logs | Render → Logs | Real-time output |
| Restart service | Render → Dashboard | Click "Restart" |
| Update variable | Render → Environment | Edit value → Save → Restart |
| Check status | Render → Dashboard | Green "Live" = OK |

---

## 📖 Related Files

- [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) - Full deployment walkthrough
- [.env.render.example](./.env.render.example) - Environment variables template
- [api/lib/mongodb.js](./api/lib/mongodb.js) - MongoDB connection code
- [api/routes/health.js](./api/routes/health.js) - Health check endpoint

---

## 🆘 Still Having Issues?

1. **Check Render Logs** → Most errors are visible there
2. **Verify Env Variables** → Make sure all required vars are set
3. **Restart Service** → Sometimes fixes connection issues
4. **Check MongoDB Access** → Ensure IP is whitelisted
5. **Contact Support** → Render support: [support.render.com](https://support.render.com)

---

**You're all set!** Your backend with environment variables and secrets is ready on Render. 🚀

