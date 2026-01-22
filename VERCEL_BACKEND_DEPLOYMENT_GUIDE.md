# 🚀 Complete Guide: Deploy Node.js + Express Backend on Vercel with MongoDB

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Setup Instructions](#setup-instructions)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [MongoDB Setup](#mongodb-setup)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Testing Backend](#testing-backend)
9. [Frontend Integration](#frontend-integration)
10. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
your-project/
├── api/                          # 🔧 Serverless backend functions
│   ├── package.json             # Backend dependencies
│   ├── lib/
│   │   └── mongodb.js           # MongoDB connection logic
│   ├── middleware/
│   │   └── cors.js              # CORS configuration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Order.js             # Order schema
│   └── routes/
│       ├── index.js             # GET /api (docs)
│       ├── health.js            # GET /api/health
│       ├── users.js             # GET /api/users
│       ├── users-create.js      # POST /api/users/create
│       ├── orders.js            # GET /api/orders
│       └── orders-create.js     # POST /api/orders/create
├── src/                          # React/Vite frontend
├── .env.local                    # Local environment variables
├── .env.example                  # Template for environment variables
├── vercel.json                   # Vercel configuration
└── package.json                  # Root package.json
```

---

## 🛠️ Setup Instructions

### Step 1: Install Dependencies (Backend)

```bash
# Navigate to api folder
cd api

# Install backend dependencies
npm install

# Back to root
cd ..
```

**What gets installed:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment variables
- `body-parser`: Parse request bodies

### Step 2: Setup MongoDB Locally

**Option A: Using MongoDB Compass (Recommended for Beginners)**

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Install and open it
3. Click "Create" → Create a new database
4. Name: `rk_database`
5. Create collection: `users` and `orders`
6. Connection string: `mongodb://localhost:27017/rk_database`

**Option B: Using MongoDB Atlas (Cloud)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account and sign in
3. Create a new project
4. Create a cluster (select free tier)
5. Add database user (username + password)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/rk_database?retryWrites=true&w=majority`

### Step 3: Configure Environment Variables

Update `.env.local`:

```env
# For local MongoDB Compass
MONGODB_URI=mongodb://localhost:27017/rk_database

# For MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/rk_database?retryWrites=true&w=majority

NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

---

## 🏃 Local Development

### Start MongoDB

**If using MongoDB Compass:**
- Open MongoDB Compass
- It auto-connects to localhost

**If using MongoDB Atlas:**
- No action needed (it's cloud-hosted)

### Start Backend Server

```bash
# From root directory
cd api
npm run dev

# You should see:
# 🔄 Connecting to MongoDB...
# ✅ Connected to MongoDB successfully
# Server running on http://localhost:3001
```

### Test Local Backend

Open browser and visit:
```
http://localhost:3001/api
```

You should see API documentation.

---

## 📤 Vercel Deployment

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add Vercel serverless backend setup"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. Configure project:
   - **Framework**: Node.js
   - **Root Directory**: `.` (root)
   - Click "Deploy"

**Wait for deployment (usually 2-3 minutes)**

### Step 3: Add Environment Variables in Vercel

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add two variables:

**Variable 1: MONGODB_URI**
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/rk_database?retryWrites=true&w=majority
Environments: Production, Preview, Development
```

**Variable 2: NODE_ENV**
```
Key: NODE_ENV
Value: production
Environments: Production, Preview
```

4. Click "Save"
5. Go to "Deployments" → Click on latest deployment
6. Wait for automatic redeployment (~30 seconds)

### Step 4: Verify Deployment

1. Vercel gives you a domain: `https://your-project.vercel.app`
2. Test it:
```
https://your-project.vercel.app/api
https://your-project.vercel.app/api/health
```

---

## 🗄️ MongoDB Setup (Detailed)

### Using MongoDB Compass (Local)

**Create Database:**
1. Open MongoDB Compass
2. Click "+" → "Create Database"
3. Database name: `rk_database`
4. Collection name: `users`
5. Click "Create Database"
6. Repeat with `orders` collection

**Connection String:**
```
mongodb://localhost:27017/rk_database
```

**Add to .env.local:**
```env
MONGODB_URI=mongodb://localhost:27017/rk_database
```

### Using MongoDB Atlas (Cloud - Recommended for Production)

**Step 1: Create Account**
- Visit: https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email

**Step 2: Create Organization & Project**
- Create organization (skip if default)
- Create new project

**Step 3: Create Cluster**
- Click "Create" → "Build a Database"
- Select "Free" tier
- Choose region nearest to you
- Click "Create Cluster"

**Step 4: Add Database User**
- Go to "Database Access"
- Click "Add New Database User"
- Username: `rk_user`
- Password: `Strong_Password_123!`
- Built-in roles: Atlas admin
- Click "Create User"

**Step 5: Add Network Access**
- Go to "Network Access"
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

**Step 6: Get Connection String**
- Go to "Databases"
- Click "Connect" on your cluster
- Select "Drivers"
- Copy connection string

**Replace placeholders:**
```
mongodb+srv://rk_user:Strong_Password_123!@cluster0.abc123.mongodb.net/rk_database?retryWrites=true&w=majority
```

**Add to Vercel Environment Variables**

---

## 🔐 Environment Variables

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Environment mode | `production`, `development` |
| `VITE_API_URL` | Frontend API URL | `http://localhost:3001` |

### Setting Variables

**Local Development (.env.local):**
```env
MONGODB_URI=mongodb://localhost:27017/rk_database
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

**Production (Vercel Dashboard):**
- Settings → Environment Variables
- Add MONGODB_URI (full MongoDB Atlas connection string)
- Add NODE_ENV = production

**Accessing in Code:**
```javascript
const mongoUri = process.env.MONGODB_URI;
const env = process.env.NODE_ENV;
```

---

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "database": {
    "status": "Connected",
    "uri": "✅ Configured"
  }
}
```

### 2. Get All Users
```
GET /api/users
```
**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Acme Inc",
      "status": "active",
      "isAdmin": false,
      "createdAt": "2024-01-22T10:00:00.000Z",
      "updatedAt": "2024-01-22T10:00:00.000Z"
    }
  ]
}
```

### 3. Create User
```
POST /api/users/create
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+9876543210",
  "company": "Tech Corp"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    ...
  }
}
```

### 4. Get All Orders
```
GET /api/orders
GET /api/orders?status=delivered
GET /api/orders?userId=507f1f77bcf86cd799439011
```
**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "orderNumber": "ORD-1705929600000",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "productName": "Website Design",
      "quantity": 1,
      "price": 5000,
      "totalAmount": 5000,
      "status": "pending",
      "paymentStatus": "unpaid",
      "notes": "Custom design needed"
    }
  ]
}
```

### 5. Create Order
```
POST /api/orders/create
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "productName": "Mobile App",
  "quantity": 1,
  "price": 15000,
  "notes": "iOS and Android app"
}
```

---

## 🧪 Testing Backend

### Using cURL (Terminal)

**Test Health:**
```bash
curl http://localhost:3001/api/health
```

**Get All Users:**
```bash
curl http://localhost:3001/api/users
```

**Create User:**
```bash
curl -X POST http://localhost:3001/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc"
  }'
```

**Get Orders:**
```bash
curl http://localhost:3001/api/orders
```

**Create Order:**
```bash
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID_HERE",
    "productName": "Website Design",
    "quantity": 1,
    "price": 5000,
    "notes": "Custom design"
  }'
```

### Using Postman (GUI)

1. Download: https://www.postman.com/downloads/
2. Create new request
3. Method: GET/POST
4. URL: `http://localhost:3001/api/users`
5. For POST requests:
   - Go to "Body"
   - Select "raw"
   - Select "JSON"
   - Paste JSON data
6. Click "Send"

### Using Browser

Simple GET requests work directly in browser:
```
http://localhost:3001/api
http://localhost:3001/api/health
http://localhost:3001/api/users
```

---

## 🎨 Frontend Integration (React/Vite)

### Step 1: Create API Client

Create [src/lib/api.js](src/lib/api.js):

```javascript
// Determine API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Fetch all users
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

// Create new user
export async function createUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Fetch all orders
export async function fetchOrders(filters = {}) {
  try {
    let url = `${API_URL}/api/orders`;
    
    // Add query parameters
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

// Create new order
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}
```

### Step 2: Use in React Component

Create [src/components/UserList.jsx](src/components/UserList.jsx):

```jsx
import { useState, useEffect } from 'react';
import { fetchUsers, createUser } from '../lib/api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createUser(formData);
      setFormData({ name: '', email: '', phone: '', company: '' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Create User Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 bg-gray-100 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="px-3 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="px-3 py-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      {/* Status Messages */}
      {loading && <p className="text-blue-600">Loading users...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.company}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && (
        <p className="text-gray-500">No users found</p>
      )}
    </div>
  );
}
```

### Step 3: Add API URL to .env

Update .env.local in root:
```env
VITE_API_URL=http://localhost:3001
```

For production (in Vercel):
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Problem: "MONGODB_URI is not defined"

**Solution:**
1. Make sure `.env.local` exists in root folder
2. Add: `MONGODB_URI=mongodb://localhost:27017/rk_database`
3. Restart backend: `npm run dev`

### Problem: "Cannot POST /api/users/create"

**Solution:**
1. Check request headers: `Content-Type: application/json`
2. Check request body is valid JSON
3. Use cURL to test: `curl -X POST http://localhost:3001/api/health`

### Problem: "MongooseError: Cannot connect to MongoDB"

**Solution:**
1. Make sure MongoDB Compass is running (if using local)
2. Or check MongoDB Atlas connection string
3. Try: `mongodb://localhost:27017/rk_database`

### Problem: "CORS error in frontend"

**Solution:**
1. Check CORS origins in [api/middleware/cors.js](api/middleware/cors.js)
2. Add your frontend URL to `allowedOrigins`
3. Restart backend

### Problem: Vercel deployment fails

**Solution:**
1. Check Vercel logs: Dashboard → Deployments → Click failed deployment
2. Common issue: Missing `MONGODB_URI` environment variable
3. Add it: Settings → Environment Variables → Add MONGODB_URI

### Problem: "Backend works locally but not after Vercel deployment"

**Solution:**
1. Vercel → Settings → Environment Variables
2. Add `MONGODB_URI` (use MongoDB Atlas connection string for cloud)
3. Redeploy project manually

---

## 📚 File Reference

### Backend Files Structure

```
api/
├── package.json           # Dependency list
├── lib/
│   └── mongodb.js        # Connection management
├── middleware/
│   └── cors.js           # CORS setup
├── models/
│   ├── User.js           # User schema
│   └── Order.js          # Order schema
└── routes/
    ├── index.js          # API docs
    ├── health.js         # Health check
    ├── users.js          # GET /api/users
    ├── users-create.js   # POST /api/users/create
    ├── orders.js         # GET /api/orders
    └── orders-create.js  # POST /api/orders/create
```

### Configuration Files

- **vercel.json**: Serverless routing config
- **.env.local**: Local development variables
- **.env.example**: Variable template

---

## ✅ Deployment Checklist

- [ ] Created `/api` folder structure
- [ ] Installed backend dependencies: `npm install --prefix ./api`
- [ ] Configured MongoDB (Compass or Atlas)
- [ ] Added `MONGODB_URI` to `.env.local`
- [ ] Tested backend locally: `npm run dev`
- [ ] Pushed code to GitHub
- [ ] Connected GitHub repo to Vercel
- [ ] Added `MONGODB_URI` to Vercel Environment Variables
- [ ] Verified deployment: `https://your-project.vercel.app/api`
- [ ] Tested API endpoints
- [ ] Created React components for frontend
- [ ] Added `VITE_API_URL` to frontend `.env`
- [ ] Tested frontend-backend communication

---

## 🎓 Quick Reference Commands

```bash
# Backend development
cd api
npm install
npm run dev

# Frontend development
npm run dev

# Test API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/users

# Deploy to Vercel
git add .
git commit -m "Deploy message"
git push origin main
```

---

**Questions?** Check the troubleshooting section or review specific file comments.

Good luck with your deployment! 🚀
