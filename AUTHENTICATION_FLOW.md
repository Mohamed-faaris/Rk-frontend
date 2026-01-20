# Authentication Flow Implementation Guide

## Overview

This guide explains the complete authentication flow implemented in your RajKayal website, including:
- Login/Register Modal
- Chatbot with authentication checks
- Session-based authentication
- Protected features

---

## Components Created/Modified

### 1. **LoginRegisterModal.tsx** (New)
**Location:** `src/components/LoginRegisterModal.tsx`

**Features:**
- Auto-shows 5 seconds after page load (only if not authenticated)
- Clean, modern popup modal with gradient design
- Login and Register buttons
- Close (X) button and "Continue Browsing" option
- Mobile responsive
- Smooth animation on appear/disappear

**How it works:**
```typescript
// Auto-trigger after 5 seconds
useEffect(() => {
  if (isAuthenticated) return; // Don't show if logged in
  
  const timer = setTimeout(() => {
    setIsVisible(true); // Shows modal
  }, 5000);
}, [isAuthenticated]);
```

**Integration in App:**
```tsx
// In App.tsx, add BEFORE ChatBot
<LoginRegisterModal />
<ChatBot />
```

---

### 2. **ChatBot_AuthEnabled.tsx** (New - Enhanced Version)
**Location:** `src/components/ChatBot_AuthEnabled.tsx`

**Key Features for Authentication:**

#### For Unauthenticated Users:
```typescript
if (isOpen && !isAuthenticated && !unauthenticatedMessagesSent && messages.length === 0) {
  // Show welcome message
  const welcomeMsg = {
    text: 'Hi 👋 Welcome!',
    sender: 'bot'
  };
  
  // Then show sign-in prompt
  const loginMsg = {
    text: 'Please sign in first to continue chatting.',
    sender: 'bot'
  };
}
```

- First message: "Hi 👋 Welcome!"
- Second message: "Please sign in first to continue chatting."
- Input box is DISABLED with placeholder: "Please sign in to chat"
- Sign In button appears below messages
- Chatbot icon shows a login badge indicator

#### For Authenticated Users:
```typescript
if (isAuthenticated) {
  // Input box is ENABLED
  // User can send messages
  // Receives responses from chatbot service
  // Quick question buttons available
}
```

---

## Authentication Logic Flow

### 1. **Initial Page Load**
```
User visits website
    ↓
AuthContext checks localStorage for token
    ↓
isAuthenticated = true/false
    ↓
LoginRegisterModal checks isAuthenticated
    ↓
If NOT authenticated → Show modal after 5 seconds
If authenticated → Don't show modal
```

### 2. **Chatbot Behavior**
```
User clicks chatbot icon
    ↓
Is user authenticated? (Check useAuth context)
    ↓
NO: Show "Hi 👋" → "Please sign in"
    Input DISABLED
    Show "Sign In to Chat" button
    ↓
YES: Show previous chat / enable input
    User can send messages freely
```

### 3. **Sending Messages (Protected)**
```typescript
const handleSendMessage = useCallback(async () => {
  // AUTHENTICATION CHECK
  if (!isAuthenticated) {
    return; // Don't allow sending
  }
  
  // Send message to API with token
  const response = await chatbotService.sendMessage(
    inputValue, 
    sessionId
  );
}, [isAuthenticated]);
```

---

## Backend Session Management

### Required Backend Routes

Your backend (in `server/routes/`) should have these endpoints:

#### 1. **POST /api/auth/login**
```javascript
// server/routes/auth.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate JWT or Session Token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store in DB if session-based
  // Or just return token if JWT
  
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token: token
  });
});
```

#### 2. **POST /api/auth/register**
```javascript
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Check if user exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword
  });
  
  await user.save();
  
  // Return token
  const token = jwt.sign(
    { userId: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    user: { id: user._id, name, email },
    token
  });
});
```

#### 3. **GET /api/auth/verify** (Optional)
```javascript
// Verify if token is still valid
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});
```

#### 4. **POST /api/chatbot/send** (Protected)
```javascript
router.post('/send', authenticateToken, async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user.userId; // From auth middleware
  
  // This route is ONLY accessible if token is valid
  // Invalid/missing token → 401 Unauthorized
  
  // Process message
  const response = await generateChatbotResponse(message);
  
  res.json({ 
    success: true,
    response: response 
  });
});
```

### Authentication Middleware

Create `server/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
```

---

## Frontend Authentication Context

Your `AuthContext.tsx` already handles:
- User state management
- Token storage in localStorage
- Authentication status check
- Login/Logout methods

```typescript
// In any component:
const { isAuthenticated, user, login, logout } = useAuth();

// Check if user is logged in
if (isAuthenticated) {
  console.log('User:', user.name);
}
```

---

## How to Switch from Old ChatBot to New ChatBot

### Option 1: Replace Existing ChatBot
```tsx
// In App.tsx
// BEFORE:
import ChatBot from "./components/ChatBot";

// AFTER:
import ChatBot from "./components/ChatBot_AuthEnabled";
```

### Option 2: Keep Both (Recommended during testing)
Rename old ChatBot:
```
src/components/ChatBot.tsx → src/components/ChatBot_Old.tsx
src/components/ChatBot_AuthEnabled.tsx → src/components/ChatBot.tsx
```

---

## Testing the Flow

### Test 1: Auto-Modal on Fresh Visit
1. Open browser DevTools → Application → Clear all data
2. Visit website
3. Wait 5 seconds
4. Modal should appear with "Login to continue"

### Test 2: Chatbot Without Login
1. Don't login, just close the modal
2. Click chatbot icon
3. See: "Hi 👋 Welcome!" and "Please sign in first..."
4. Input box should be disabled
5. Click "Sign In to Chat" → Goes to login page

### Test 3: Chatbot With Login
1. Login successfully
2. Visit homepage again
3. Click chatbot icon
4. Chat input should be ENABLED
5. Send a test message
6. Should work normally

---

## Session vs JWT Comparison

### JWT (Recommended for your setup)
- ✅ Stateless (no server-side storage needed)
- ✅ Scales well
- ✅ Works great with React
- ❌ Token can't be revoked immediately
- **Token stored in:** `localStorage`

### Session-based
- ✅ Can revoke anytime
- ✅ More secure (token stored in server)
- ❌ Needs server storage
- ❌ Doesn't scale as well
- **Token stored in:** Server database + HttpOnly Cookie

**For your project, JWT is recommended** since you're already using it in your auth service.

---

## Security Best Practices

### 1. HTTPS Only
```javascript
// In backend .env
NODE_ENV=production
// This ensures cookies are HttpOnly and Secure
```

### 2. Token Expiration
```javascript
// Always set expiration
jwt.sign(payload, secret, { expiresIn: '7d' });
```

### 3. Refresh Tokens (Optional)
```javascript
// Issue both access and refresh tokens
const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
```

### 4. Protect API Routes
```javascript
// All sensitive routes should check token
router.post('/sensitive-action', authenticateToken, handler);
```

---

## File Structure

```
src/
├── components/
│   ├── LoginRegisterModal.tsx        ← New: Auto-popup modal
│   ├── ChatBot.tsx                   ← Existing
│   ├── ChatBot_AuthEnabled.tsx       ← New: Auth-aware chatbot
│   └── ...
├── context/
│   └── AuthContext.tsx               ← Existing (already handles auth)
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ...
└── App.tsx                           ← Updated: Added LoginRegisterModal

server/
├── routes/
│   ├── auth.js                       ← Login/Register endpoints
│   ├── chatbot.js                    ← Protected chatbot endpoint
│   └── ...
├── middleware/
│   └── auth.js                       ← Token verification middleware
└── ...
```

---

## Checklist for Deployment

- [ ] Update backend with auth routes (if not already done)
- [ ] Add authentication middleware to protect routes
- [ ] Set JWT_SECRET in environment variables
- [ ] Replace ChatBot import with ChatBot_AuthEnabled (or rename)
- [ ] Test modal appears after 5 seconds on fresh visit
- [ ] Test chatbot input is disabled when not logged in
- [ ] Test chatbot works normally when logged in
- [ ] Test logout clears token from localStorage
- [ ] Test refresh page maintains login state
- [ ] Test mobile responsiveness
- [ ] Add HTTPS in production

---

## Environment Variables Needed

```
# .env or server/.env
JWT_SECRET=your_super_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

---

## Support Features

### Feature 1: Smooth Modal Animation
- Fade in/out backdrop
- Scale animation on modal
- ~300ms transition duration

### Feature 2: Responsive Design
- Works on mobile
- Modal centered and sized appropriately
- Touch-friendly buttons

### Feature 3: User Experience
- "Continue Browsing" option lets users explore without login
- Modal won't show if already logged in
- Notification badge on chatbot when unlocked
- Quick question buttons for easy interaction

---

## Common Issues & Fixes

### Issue: Modal appears multiple times
**Solution:** Check `isAuthenticated` state is properly set in AuthContext

### Issue: Chatbot input not disabled
**Solution:** Ensure `isAuthenticated` is passed correctly to ChatBot component

### Issue: Token not persisting after refresh
**Solution:** Check localStorage in DevTools → Make sure token is being saved

### Issue: API returns 401 (Unauthorized)
**Solution:** 
1. Check token is being sent in headers
2. Verify JWT_SECRET matches on backend
3. Check token expiration time

---

## Next Steps

1. **Backup current ChatBot.tsx**
   ```bash
   cp src/components/ChatBot.tsx src/components/ChatBot_Backup.tsx
   ```

2. **Replace with new version**
   ```bash
   mv src/components/ChatBot_AuthEnabled.tsx src/components/ChatBot.tsx
   ```

3. **Test locally**
   ```bash
   npm run dev:full
   ```

4. **Deploy to production**

---

## Questions?

Refer to your existing files:
- `src/context/AuthContext.tsx` - Auth state management
- `src/lib/authService.ts` - API calls
- `server/routes/auth.js` - Backend authentication
- `server/middleware/auth.js` - Token verification
