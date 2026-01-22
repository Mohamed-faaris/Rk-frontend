# 🚀 Quick Start Guide - Vercel Backend Deployment

## 🎯 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
cd api
npm install
cd ..
```

### Step 2: Setup MongoDB (2 minutes)

**Option A: Local (MongoDB Compass)**
- Download: https://www.mongodb.com/products/compass
- Open and create database `rk_database`
- Connection: `mongodb://localhost:27017/rk_database`

**Option B: Cloud (MongoDB Atlas)**
- Create free account: https://www.mongodb.com/cloud/atlas
- Get connection string
- Replace placeholders with your credentials

### Step 3: Add Environment Variables (1 minute)

Create `.env.local` in root:
```env
MONGODB_URI=mongodb://localhost:27017/rk_database
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

### Step 4: Test Locally (1 minute)

**Terminal 1: Start Backend**
```bash
cd api
npm run dev
```

**Terminal 2: Test API**
```bash
# Test health
curl http://localhost:3001/api/health

# Test get users
curl http://localhost:3001/api/users
```

---

## 📤 Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel serverless backend"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Click "Deploy"

### Step 3: Add Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Save

### Step 4: Test Deployment
```
https://your-project.vercel.app/api/health
```

---

## 🎨 Use in Frontend

### Install
```bash
npm install
```

### Use API
```jsx
import { fetchUsers, createUser } from '@/lib/api';
import UserManagement from '@/components/UserManagement';

function App() {
  return <UserManagement />;
}
```

---

## 🧪 Test API Endpoints

### Using cURL
```bash
# Get all users
curl http://localhost:3001/api/users

# Create user
curl -X POST http://localhost:3001/api/users/create \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# Get all orders
curl http://localhost:3001/api/orders

# Create order
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"USER_ID_HERE",
    "productName":"Website",
    "quantity":1,
    "price":5000
  }'
```

### Using Node.js Test Script
```bash
node test-api.js
```

---

## 📁 File Structure
```
api/
├── package.json
├── lib/mongodb.js
├── models/User.js
├── models/Order.js
└── routes/
    ├── index.js
    ├── health.js
    ├── users.js
    ├── users-create.js
    ├── orders.js
    └── orders-create.js
```

---

## 🆘 Troubleshooting

**Problem: "Cannot connect to MongoDB"**
- Check MongoDB Compass is running
- Or verify MongoDB Atlas connection string
- Update MONGODB_URI in .env.local

**Problem: "CORS error"**
- Check backend is running
- Verify API_URL is correct in frontend
- Check CORS origins in api/middleware/cors.js

**Problem: "Vercel deployment fails"**
- Check Vercel logs
- Verify MONGODB_URI is set in Environment Variables
- Make sure all files are pushed to GitHub

---

## 📞 Need Help?

Check [VERCEL_BACKEND_DEPLOYMENT_GUIDE.md](VERCEL_BACKEND_DEPLOYMENT_GUIDE.md) for detailed instructions.

---

**You're ready! 🎉**
