# 🎯 Complete Node.js + Express Backend for Vercel Serverless

> **Production-ready backend with MongoDB, CORS, and JSON APIs - Deploy in 5 minutes!**

## ✨ What You Get

✅ **Vercel Serverless Backend** - No server management  
✅ **MongoDB Integration** - With Mongoose ODM  
✅ **CORS Enabled** - Secure frontend communication  
✅ **JSON APIs** - RESTful GET/POST endpoints  
✅ **Environment Variables** - Secure configuration  
✅ **Production Ready** - Error handling & logging  
✅ **React Components** - Ready-to-use frontend code  
✅ **Complete Documentation** - Step-by-step guides  

---

## 📁 Project Structure

```
RK website/
├── api/                                  # 🔧 Backend Serverless Functions
│   ├── package.json                     # Dependencies
│   ├── lib/
│   │   └── mongodb.js                   # Database connection
│   ├── middleware/
│   │   └── cors.js                      # CORS configuration
│   ├── models/
│   │   ├── User.js                      # User schema
│   │   └── Order.js                     # Order schema
│   └── routes/                          # API endpoints
│       ├── index.js                     # GET /api
│       ├── health.js                    # GET /api/health
│       ├── users.js                     # GET /api/users
│       ├── users-create.js              # POST /api/users/create
│       ├── orders.js                    # GET /api/orders
│       └── orders-create.js             # POST /api/orders/create
├── src/
│   ├── lib/
│   │   └── api.js                       # Frontend API client
│   ├── hooks/
│   │   └── useApi.js                    # React hook for API calls
│   └── components/
│       ├── UserManagement.jsx           # User CRUD component
│       └── OrderManagement.jsx          # Order CRUD component
├── .env.local                           # Local environment variables
├── .env.example                         # Environment template
├── vercel.json                          # Vercel configuration
├── VERCEL_BACKEND_DEPLOYMENT_GUIDE.md   # 📖 Complete guide
├── QUICK_BACKEND_START.md               # ⚡ 5-minute setup
├── API_REFERENCE.md                     # 📚 API reference
├── postman_collection.json              # 🧪 Postman testing
└── test-api.js                          # Test script
```

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Install Dependencies
```bash
cd api
npm install
cd ..
```

### 2️⃣ Setup MongoDB

**Local (MongoDB Compass)**
```
Download: https://www.mongodb.com/products/compass
Database: rk_database
Connection: mongodb://localhost:27017/rk_database
```

**Cloud (MongoDB Atlas)**
```
Website: https://www.mongodb.com/cloud/atlas
Connection: mongodb+srv://user:pass@cluster.mongodb.net/rk_database
```

### 3️⃣ Configure Environment
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/rk_database
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

### 4️⃣ Start Backend
```bash
cd api
npm run dev
```

### 5️⃣ Test It!
```bash
curl http://localhost:3001/api/health
```

---

## 📤 Deploy to Vercel (3 Steps)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel backend"
git push origin main
```

### Step 2: Deploy
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Click "Deploy"

### Step 3: Add MongoDB Connection
1. Vercel Dashboard → Settings → Environment Variables
2. Add `MONGODB_URI` with your MongoDB Atlas connection string
3. Vercel will auto-redeploy

**Done!** Your API is now live:
```
https://your-project.vercel.app/api
```

---

## 🧪 API Endpoints

### Health Check
```bash
GET /api/health
```

### Users
```bash
# Get all users
GET /api/users

# Create user
POST /api/users/create
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc"
}
```

### Orders
```bash
# Get all orders
GET /api/orders

# Get pending orders
GET /api/orders?status=pending

# Create order
POST /api/orders/create
{
  "userId": "user_id_here",
  "productName": "Website Design",
  "quantity": 1,
  "price": 5000,
  "notes": "Custom design"
}
```

---

## 🎨 Use in React/Vite

### Import API Client
```javascript
import { fetchUsers, createUser, fetchOrders, createOrder } from '@/lib/api';
```

### Use Components
```jsx
import UserManagement from '@/components/UserManagement';
import OrderManagement from '@/components/OrderManagement';

function App() {
  return (
    <div>
      <UserManagement />
      <OrderManagement />
    </div>
  );
}
```

### Manual API Calls
```javascript
// Fetch users
const { data: users } = await fetchUsers();
console.log(users);

// Create user
const { data: newUser } = await createUser({
  name: 'John Doe',
  email: 'john@example.com'
});

// Fetch orders
const { data: orders } = await fetchOrders({ status: 'pending' });

// Create order
const { data: newOrder } = await createOrder({
  userId: 'user_id',
  productName: 'Website',
  quantity: 1,
  price: 5000
});
```

---

## 🔐 Environment Variables

### What You Need

| Variable | Where to Use | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Backend (required) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Backend & Vercel | `production` or `development` |
| `VITE_API_URL` | Frontend | `https://your-project.vercel.app` |

### Local Development (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/rk_database
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

### Production (Vercel Dashboard)
```
Settings → Environment Variables
Add: MONGODB_URI = your MongoDB Atlas connection string
Add: NODE_ENV = production
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [VERCEL_BACKEND_DEPLOYMENT_GUIDE.md](VERCEL_BACKEND_DEPLOYMENT_GUIDE.md) | Complete detailed guide with screenshots |
| [QUICK_BACKEND_START.md](QUICK_BACKEND_START.md) | 5-minute setup instructions |
| [API_REFERENCE.md](API_REFERENCE.md) | API endpoints quick reference |
| [postman_collection.json](postman_collection.json) | Postman collection for testing |

---

## 🛠️ Available Scripts

### Backend
```bash
cd api

# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run all tests
node test-api.js

# Test specific endpoint
curl http://localhost:3001/api/users
```

---

## 📦 Backend Dependencies

```json
{
  "express": "^4.18.2",        // Web framework
  "mongoose": "^8.0.3",        // MongoDB ODM
  "cors": "^2.8.5",            // CORS support
  "dotenv": "^16.3.1",         // Environment variables
  "body-parser": "^1.20.2"     // Request parsing
}
```

---

## 🔗 API Connection Flow

```
React Frontend
     ↓
@/lib/api.js (client)
     ↓
HTTP Request to backend
     ↓
Vercel Serverless Function
     ↓
Express Handler
     ↓
Mongoose
     ↓
MongoDB
     ↓
Response → React → UI
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
netstat -an | grep 3001

# Check MongoDB connection
# Verify MONGODB_URI in .env.local
```

### CORS errors
```javascript
// Update allowed origins in api/middleware/cors.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-domain.com'
];
```

### MongoDB connection failed
```
1. Start MongoDB Compass
2. Verify connection string
3. Check username/password
4. Ensure IP is whitelisted (Atlas)
```

### Vercel deployment fails
```
1. Check Vercel logs
2. Verify MONGODB_URI is set
3. Ensure all files pushed to GitHub
4. Check Node.js version (20.x recommended)
```

---

## 📋 Deployment Checklist

- [ ] Created `/api` folder structure
- [ ] Installed backend dependencies
- [ ] Setup MongoDB (local or cloud)
- [ ] Added `MONGODB_URI` to `.env.local`
- [ ] Tested backend locally
- [ ] Pushed code to GitHub
- [ ] Connected repo to Vercel
- [ ] Added environment variables to Vercel
- [ ] Verified deployment works
- [ ] Tested all API endpoints
- [ ] Created React components
- [ ] Tested frontend-backend connection

---

## 💡 Pro Tips

1. **Caching**: MongoDB connections are cached in serverless (reused across invocations)
2. **Timeouts**: Vercel free tier: 60s max. Pro/Enterprise: 900s
3. **Memory**: Each function has 1024MB by default
4. **Costs**: Free tier includes 100GB bandwidth/month
5. **CORS**: Add your domain to `allowedOrigins` before production

---

## 🎓 Learning Resources

- [Express Docs](https://expressjs.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/)
- [Vercel Serverless](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

## 📞 Need Help?

1. Check [VERCEL_BACKEND_DEPLOYMENT_GUIDE.md](VERCEL_BACKEND_DEPLOYMENT_GUIDE.md)
2. Review [API_REFERENCE.md](API_REFERENCE.md)
3. Run test: `node test-api.js`
4. Use Postman: Import `postman_collection.json`

---

## ✅ What's Included

### Backend Files
- ✅ Express server setup
- ✅ MongoDB connection with caching
- ✅ Mongoose models (User, Order)
- ✅ RESTful API endpoints
- ✅ CORS middleware
- ✅ Error handling
- ✅ Environment variables
- ✅ Vercel configuration

### Frontend Files
- ✅ API client library
- ✅ React hooks for API calls
- ✅ User management component
- ✅ Order management component
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

### Documentation
- ✅ Complete deployment guide
- ✅ Quick start guide
- ✅ API reference
- ✅ Postman collection
- ✅ Test scripts
- ✅ Troubleshooting guide

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start with [QUICK_BACKEND_START.md](QUICK_BACKEND_START.md) for a 5-minute setup!

**Happy coding! 🚀**
