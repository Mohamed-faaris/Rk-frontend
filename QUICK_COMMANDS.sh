#!/bin/bash
# 🚀 Quick Commands Reference - Copy & Paste Ready!

# ============================================
# 1. LOCAL DEVELOPMENT SETUP
# ============================================

# Install backend dependencies
cd api && npm install && cd ..

# Start MongoDB Compass (or MongoDB service)
# Download from: https://www.mongodb.com/products/compass
# Or start MongoDB locally:
# Windows: mongod
# Mac/Linux: brew services start mongodb-community

# Start backend (Terminal 1)
cd api && npm run dev

# Start frontend (Terminal 2)
npm run dev

# Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api


# ============================================
# 2. TESTING API ENDPOINTS
# ============================================

# Health check
curl http://localhost:3001/api/health

# Get all users
curl http://localhost:3001/api/users

# Create user
curl -X POST http://localhost:3001/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc"
  }'

# Get all orders
curl http://localhost:3001/api/orders

# Get pending orders
curl http://localhost:3001/api/orders?status=pending

# Create order (replace USER_ID with actual ID)
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "productName": "Website Design",
    "quantity": 1,
    "price": 5000,
    "notes": "Custom design needed"
  }'

# Run automated tests
node test-api.js


# ============================================
# 3. GIT & GITHUB
# ============================================

# Check git status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Add Vercel backend setup with MongoDB"

# Push to GitHub
git push origin main

# Check remote
git remote -v


# ============================================
# 4. VERCEL DEPLOYMENT
# ============================================

# Install Vercel CLI (optional)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (automatic via GitHub)
# OR manual deploy:
vercel --prod

# View deployment logs
vercel logs

# Open Vercel dashboard
# https://vercel.com/dashboard


# ============================================
# 5. MONGODB ATLAS (Cloud)
# ============================================

# Get MongoDB Atlas connection string
# 1. Go to: https://www.mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Create database user
# 4. Whitelist IP (0.0.0.0/0)
# 5. Copy connection string
# Format: mongodb+srv://user:password@cluster.mongodb.net/database

# Test connection locally
# Update .env.local with connection string
# Then: npm run dev (in api folder)


# ============================================
# 6. ENVIRONMENT VARIABLES
# ============================================

# Create .env.local (local development)
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/rk_database
NODE_ENV=development
VITE_API_URL=http://localhost:3001
EOF

# Create .env.example (template - commit to GitHub)
cat > .env.example << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rk_database?retryWrites=true&w=majority
NODE_ENV=development
VITE_API_URL=http://localhost:3001
EOF

# For Vercel - Set via dashboard:
# 1. Go to Vercel Dashboard
# 2. Settings → Environment Variables
# 3. Add MONGODB_URI with your Atlas connection string
# 4. Add NODE_ENV=production
# 5. Save (automatic redeployment)


# ============================================
# 7. FRONTEND INTEGRATION
# ============================================

# Import API functions
# import { fetchUsers, createUser, fetchOrders, createOrder } from '@/lib/api';

# Import components
# import UserManagement from '@/components/UserManagement';
# import OrderManagement from '@/components/OrderManagement';

# Use in React
# <UserManagement />
# <OrderManagement />


# ============================================
# 8. DATABASE OPERATIONS
# ============================================

# Connect to MongoDB Atlas (using MongoDB Compass)
# URI: mongodb+srv://user:password@cluster.mongodb.net/rk_database

# Create indexes (in MongoDB shell or via Compass)
# db.users.createIndex({ email: 1 });
# db.orders.createIndex({ userId: 1 });

# Backup MongoDB data
# mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/rk_database"

# Restore MongoDB data
# mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/rk_database" --archive=backup.archive


# ============================================
# 9. DEBUGGING
# ============================================

# Check if port is in use (Windows)
netstat -ano | findstr :3001

# Kill process on port 3001 (Windows)
taskkill /PID <PID> /F

# Check if port is in use (Mac/Linux)
lsof -i :3001

# Kill process on port 3001 (Mac/Linux)
kill -9 <PID>

# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install


# ============================================
# 10. MONITORING & LOGS
# ============================================

# View backend logs (while running)
# Terminal shows real-time logs

# View Vercel deployment logs
# Vercel Dashboard → Deployments → Select deployment → View logs

# View MongoDB Atlas logs
# Atlas Dashboard → Collections → Deployment Logs

# Monitor Vercel performance
# Vercel Dashboard → Analytics

# Check API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/users

# Performance test (repeat requests)
for i in {1..100}; do curl -s http://localhost:3001/api/health | jq '.success'; done


# ============================================
# 11. PRODUCTION COMMANDS
# ============================================

# Build frontend for production
npm run build

# Preview production build
npm run preview

# Deploy frontend
# Automatically via Vercel + GitHub

# Check production API
curl https://your-project.vercel.app/api/health

# View production logs
vercel logs --prod


# ============================================
# 12. HELPFUL ALIASES (Add to .bashrc or .zshrc)
# ============================================

# alias api-start="cd api && npm run dev"
# alias api-test="curl http://localhost:3001/api/health"
# alias app-start="npm run dev"
# alias db-connect="mongo mongodb+srv://..."
# alias deploy="git add . && git commit -m 'Deploy' && git push"


# ============================================
# 13. PROJECT FILE SIZES
# ============================================

# Check backend size
du -sh api/

# Check node_modules size
du -sh api/node_modules/

# Check overall project size
du -sh .

# List largest files
find . -type f -size +10M


# ============================================
# 14. QUICK VERIFICATION
# ============================================

echo "✅ Checking setup..."

# Check Node.js
echo "Node version: $(node --version)"

# Check npm
echo "npm version: $(npm --version)"

# Check if api folder exists
test -d api && echo "✅ api/ folder exists" || echo "❌ api/ folder missing"

# Check if .env.local exists
test -f .env.local && echo "✅ .env.local exists" || echo "❌ .env.local missing"

# Check if package.json exists in api
test -f api/package.json && echo "✅ api/package.json exists" || echo "❌ api/package.json missing"

# Check if node_modules exists
test -d api/node_modules && echo "✅ Dependencies installed" || echo "❌ Dependencies not installed"

echo "✅ Setup verification complete!"


# ============================================
# 15. USEFUL LINKS
# ============================================

# Vercel Dashboard: https://vercel.com/dashboard
# MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# MongoDB Compass: https://www.mongodb.com/products/compass
# Postman: https://www.postman.com/
# GitHub: https://github.com/
# Node.js: https://nodejs.org/
# Express Docs: https://expressjs.com/
# Mongoose Docs: https://mongoosejs.com/
