# 📚 Backend API Quick Reference

## Base URL
- **Local**: `http://localhost:3001`
- **Production**: `https://your-project.vercel.app`

---

## 🏥 Health & Documentation

### Health Check
```
GET /api/health
```
**Response**: Server and database status

### API Documentation
```
GET /api
```
**Response**: List of all endpoints and examples

---

## 👥 Users API

### Get All Users
```
GET /api/users
```
**Response**:
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
      "createdAt": "2024-01-22T10:00:00Z",
      "updatedAt": "2024-01-22T10:00:00Z"
    }
  ]
}
```

### Create User
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

**Required Fields**:
- `name` (string)
- `email` (string)

**Optional Fields**:
- `phone` (string)
- `company` (string)

**Response**:
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

---

## 📦 Orders API

### Get All Orders
```
GET /api/orders
```

### Get Orders with Filters
```
GET /api/orders?status=delivered
GET /api/orders?userId=507f1f77bcf86cd799439011
```

**Query Parameters**:
- `status`: pending | confirmed | shipped | delivered | cancelled
- `userId`: Filter by user ID
- `paymentStatus`: unpaid | paid | refunded

### Create Order
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

**Required Fields**:
- `userId` (string) - From users list
- `productName` (string)
- `quantity` (number)
- `price` (number)

**Optional Fields**:
- `notes` (string)

---

## 🧪 cURL Examples

### Get Users
```bash
curl http://localhost:3001/api/users
```

### Create User
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

### Get Orders
```bash
curl http://localhost:3001/api/orders
```

### Get Pending Orders
```bash
curl http://localhost:3001/api/orders?status=pending
```

### Create Order
```bash
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "productName": "Website Design",
    "quantity": 1,
    "price": 5000,
    "notes": "Custom design"
  }'
```

---

## ⚡ JavaScript/Fetch Examples

### Get Users
```javascript
const response = await fetch('http://localhost:3001/api/users');
const data = await response.json();
console.log(data.data); // Array of users
```

### Create User
```javascript
const response = await fetch('http://localhost:3001/api/users/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Inc'
  })
});
const data = await response.json();
console.log(data.data); // New user object
```

### Get Orders
```javascript
const response = await fetch('http://localhost:3001/api/orders');
const data = await response.json();
console.log(data.data); // Array of orders
```

### Create Order
```javascript
const response = await fetch('http://localhost:3001/api/orders/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user_id_here',
    productName: 'Website Design',
    quantity: 1,
    price: 5000,
    notes: 'Custom design'
  })
});
const data = await response.json();
console.log(data.data); // New order object
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, POST, PUT) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 500 | Server Error |

---

## 🔍 Common Errors

### "MONGODB_URI is not defined"
- Add `MONGODB_URI` to `.env.local`

### "User with this email already exists"
- Use a different email address

### "userId, productName, quantity, and price are required"
- Check all required fields are provided in request body

### "CORS error"
- Make sure backend is running
- Check `allowedOrigins` in api/middleware/cors.js

---

## 📱 Using in React

```javascript
import { fetchUsers, createUser, fetchOrders, createOrder } from '@/lib/api';
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

---

**For detailed guide, see [VERCEL_BACKEND_DEPLOYMENT_GUIDE.md](VERCEL_BACKEND_DEPLOYMENT_GUIDE.md)**
