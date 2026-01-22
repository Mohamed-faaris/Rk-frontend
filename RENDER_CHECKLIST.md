# Render Deployment Checklist

## Pre-Deployment (Local Setup)

### Code Preparation
- [ ] `server/index.js` uses `app.listen('0.0.0.0', PORT)` (not localhost)
- [ ] All env variables used have defaults or are loaded from .env
- [ ] `package.json` has `"start": "node server/index.js"` script
- [ ] `package.json` has all dependencies listed (express, cors, dotenv, mongoose, etc.)
- [ ] `.gitignore` includes `node_modules/`, `.env`, `public/uploads/`
- [ ] `.env` file NOT committed to git
- [ ] `.env.example` file created with all required variables

### Testing Locally
```bash
# Test with production-like environment
NODE_ENV=production npm start

# Should see:
# ✓ Server Running on Port 5000
# ✓ MongoDB connected
# ✓ No errors
```

### Code to Commit
```bash
# Before deployment, ensure these are pushed to GitHub
git status  # See all changes
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

---

## Render Dashboard Setup

### Create Web Service
- [ ] Visit https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Verify you can see your repo

### Configure Service
- [ ] Service name: `rk-website-api`
- [ ] Environment: `Node`
- [ ] Region: Choose closest to users (or Singapore)
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: Free (for testing) or Paid ($7+/month for production)

### Add Environment Variables
In Render Dashboard → Environment section:

| Variable | Value | Status |
|----------|-------|--------|
| NODE_ENV | production | ✓ |
| MONGODB_URI | Your connection string | ✓ |
| JWT_SECRET | Generated 32-char secret | ✓ |
| CLIENT_URL | https://your-frontend.vercel.app | ✓ |

---

## Post-Deployment Verification

### Test Health Endpoint
```bash
curl https://your-service.onrender.com/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

### Test API Endpoint
```bash
curl https://your-service.onrender.com/api/status
# Should return: {"message":"API is running","environment":"production"}
```

### Verify Database Connection
- [ ] Check Render logs for "MongoDB connected"
- [ ] No connection errors
- [ ] Can query data from API

### Test CORS
- [ ] Open frontend in browser
- [ ] Open DevTools (F12) → Network
- [ ] Make API call
- [ ] No CORS errors in console
- [ ] Status 200/201/etc (not 0)

---

## Frontend Integration

### Update Frontend Environment
1. [ ] Create `.env.production` in frontend root:
   ```
   VITE_API_URL=https://your-service.onrender.com
   ```

2. [ ] Update API calls:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

3. [ ] Update Vercel env variables:
   - [ ] VITE_API_URL=https://your-service.onrender.com

4. [ ] Redeploy frontend:
   ```bash
   git add .
   git commit -m "Update backend API URL"
   git push
   ```

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Visit Render Dashboard
- [ ] Check "Status" is "Live"
- [ ] No errors in logs
- [ ] Memory usage reasonable (<200MB)

### Weekly Checks
- [ ] Test main API endpoints work
- [ ] Check frontend still connects
- [ ] Review error logs for patterns
- [ ] Verify backups if applicable

### Monthly Checks
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review database size
- [ ] Check Render bill if paid

---

## Common First-Deployment Issues

### ✓ Service stays "Deploying"
- Check build logs for errors
- Ensure package.json exists
- Ensure start command is correct

### ✓ "Cannot find module" error
- Add to package.json dependencies
- Run `npm install` locally to test
- Commit package-lock.json

### ✓ Database won't connect
- Verify MONGODB_URI in Render env vars
- Add Render IP to MongoDB whitelist (0.0.0.0/0)
- Test connection string locally first

### ✓ Frontend can't reach backend
- Check CORS configuration
- Verify frontend has correct API URL
- Check backend logs for CORS errors

### ✓ File uploads fail
- Increase upload size limit in server
- Check /uploads folder exists
- Verify disk space available

---

## Quick Command Reference

### View Render Logs
```bash
# Open in browser:
# https://dashboard.render.com → your-service → Logs
```

### Restart Service
```
Render Dashboard → your-service → Manual Redeploy
```

### View Environment Variables
```
Render Dashboard → your-service → Environment
```

### Get Public URL
```
Render Dashboard → your-service → top right: https://your-service.onrender.com
```

---

## Success Indicators

You're ready when:
✓ Backend deployed and running  
✓ Public URL accessible globally  
✓ Health endpoint returns 200 OK  
✓ Database connected and working  
✓ Frontend API calls work without CORS errors  
✓ File uploads work  
✓ Authentication works  
✓ Logs show no errors  

---

## Next Steps

1. Deploy backend following guide
2. Get public URL (shown in Render dashboard)
3. Update frontend with new backend URL
4. Deploy frontend
5. Test end-to-end
6. Monitor logs for issues
7. Enable notifications for alerts

---

**Status:** Ready for Deployment ✅
