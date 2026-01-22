# Render Deployment: Quick Start (TL;DR)

**Fast track to deploying your Express backend. ~15 minutes.**

---

## 📚 Full Documentation Created

These comprehensive guides have been created for you:

1. **[RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)** - Complete guide (9 sections)
2. **[RENDER_DEPLOYMENT_WALKTHROUGH.md](RENDER_DEPLOYMENT_WALKTHROUGH.md)** - Step-by-step with screenshots
3. **[RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)** - Pre/post deployment checklist
4. **[RENDER_FRONTEND_INTEGRATION.md](RENDER_FRONTEND_INTEGRATION.md)** - Frontend API setup
5. **[RENDER_CODE_SNIPPETS.md](RENDER_CODE_SNIPPETS.md)** - Ready-to-use code

---

## ⚡ 5-Minute Quick Start

### 1. Prepare (2 min)
```bash
# Test locally
npm run dev
# Ctrl+C to stop

# Ensure .env.example exists
# Commit to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main
```

### 2. Deploy on Render (2 min)
- Go to https://render.com/dashboard
- Click "New +" → "Web Service"
- Connect GitHub repository
- Fill in form:
  ```
  Build Command: npm install
  Start Command: npm start
  ```
- Click "Create Web Service"
- Wait for "Live" status ✅

### 3. Configure Environment (1 min)
In Render Dashboard → Environment:
```
NODE_ENV = production
MONGODB_URI = your_connection_string
JWT_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CLIENT_URL = https://your-frontend.vercel.app
```

---

## ✅ Test It Works

```bash
# Get your public URL from Render (top right of service page)
# Example: https://rk-website-api.onrender.com

# Test health endpoint
curl https://your-service.onrender.com/health
# Should see: {"status":"OK",...}

# Test API
curl https://your-service.onrender.com/api/status
# Should see: {"message":"API is running",...}
```

---

## 🔗 Connect Frontend

### Update Frontend (.env.production):
```
VITE_API_URL=https://your-service.onrender.com
```

### Update API Client (src/lib/api.ts):
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Redeploy Frontend:
```bash
git add .
git commit -m "Update backend URL"
git push origin main
# Vercel auto-deploys
```

---

## 🎯 Success Checklist

- ✅ Backend deployed and showing "Live"
- ✅ Health endpoint returns OK
- ✅ Environment variables set
- ✅ Frontend has new backend URL
- ✅ Frontend redeploy complete
- ✅ No CORS errors in browser console
- ✅ API calls work (check Network tab in DevTools)

---

## ❌ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Deploy failed | Check logs: Dashboard → Logs |
| CORS error | Add frontend URL to SERVER `allowedOrigins` |
| DB won't connect | Add Render IP to MongoDB whitelist |
| 504 error | Free tier sleeps. Upgrade or hit /health |
| Module not found | Ensure in package.json + run `npm install` locally |

---

## 🚀 Common Links

- **Render Dashboard:** https://dashboard.render.com
- **Public URL:** `https://your-service.onrender.com`
- **Health check:** `https://your-service.onrender.com/health`
- **Your API:** `https://your-service.onrender.com/api/...`

---

## 📖 Need Details?

See full guides:
- **Installation issues?** → [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)
- **Step-by-step?** → [RENDER_DEPLOYMENT_WALKTHROUGH.md](RENDER_DEPLOYMENT_WALKTHROUGH.md)
- **Pre-checklist?** → [RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)
- **Frontend setup?** → [RENDER_FRONTEND_INTEGRATION.md](RENDER_FRONTEND_INTEGRATION.md)
- **Code examples?** → [RENDER_CODE_SNIPPETS.md](RENDER_CODE_SNIPPETS.md)

---

**Your backend is production-ready! 🎉**

Next step: Deploy → Test → Connect frontend → Done!
