# Quick Start Guide - Authentication System

## What Was Created

A clean, modular authentication system that:
- ✅ Shows popup every 10 seconds (if not logged in)
- ✅ Protects restricted actions (Place Order, Book Service, etc.)
- ✅ Adds authentication checks to chatbot
- ✅ Uses YOUR existing login/register pages
- ✅ Doesn't change any UI design or colors
- ✅ Integrates seamlessly with existing code

## Files Created (in `src/lib/`)

| File | Purpose |
|------|---------|
| `authUtils.js` | Check if user logged in, get user info |
| `authPopup.js` | Shows popup modal every 10 seconds |
| `protectedActions.js` | Protects buttons/actions requiring login |
| `chatbotAuth.js` | Authentication checks for chatbot |

## Quick Start (3 Steps)

### Step 1: Initialize Popup on Home Page

**In your React App component:**
```javascript
import { startAuthPopupAutoShow } from '@/lib/authPopup';

useEffect(() => {
  startAuthPopupAutoShow();
}, []);
```

### Step 2: Protect Your Buttons

**Before:**
```html
<button onclick="placeOrder()">Place Order</button>
```

**After:**
```html
<button onclick="handlePlaceOrder()">Place Order</button>
```

```javascript
import { protectedAction } from '@/lib/protectedActions';

async function handlePlaceOrder() {
  await protectedAction(
    () => placeOrder(),
    'Please sign in first to place an order.'
  );
}
```

### Step 3: Update Chatbot

```javascript
import { isChatbotEnabled, getChatbotInputPlaceholder } from '@/lib/chatbotAuth';

// Disable input if not logged in
chatbotInput.disabled = !isChatbotEnabled();
chatbotInput.placeholder = getChatbotInputPlaceholder();

// Check before sending message
if (!shouldAllowChatMessage()) {
  showBotMessage('Please sign in first to continue chatting.');
  return;
}
```

## How It Works

```
User visits website
    ↓
Home page loads (no login required)
    ↓
After 10 seconds → Popup appears (if not logged in)
    ↓
User can:
  - Click "Sign In" → Goes to your login page
  - Click "Register" → Goes to your register page
  - Click "X" → Close and continue browsing
    ↓
If user clicks "Place Order" without login:
  - Popup shows immediately
  - Action is blocked
    ↓
When user logs in successfully:
  - Authentication is saved
  - Popup stops appearing
  - Buttons work normally
  - Chatbot input is enabled
```

## Key Functions

### Check if User is Logged In
```javascript
import { isUserLoggedIn } from '@/lib/authUtils';

if (isUserLoggedIn()) {
  console.log('User is logged in!');
}
```

### Show Popup on Demand
```javascript
import { showAuthPopup } from '@/lib/authPopup';

showAuthPopup(); // Show popup immediately
```

### Protect Any Action
```javascript
import { protectedAction } from '@/lib/protectedActions';

await protectedAction(
  () => myFunction(),
  'Custom message'
);
```

### Check Chatbot Status
```javascript
import { isChatbotEnabled, shouldAllowChatMessage } from '@/lib/chatbotAuth';

const isEnabled = isChatbotEnabled();
const canSendMessage = shouldAllowChatMessage();
```

## Where to Add Code

### 1. Home Page / Main App
```
Add: startAuthPopupAutoShow()
Location: useEffect() on page load
```

### 2. Protected Action Buttons
```
Replace: button onclick handlers
Add: protectedAction() wrapper
```

### 3. Chatbot Component
```
Add: isChatbotEnabled() check
Add: shouldAllowChatMessage() check
```

### 4. Login Page (Existing)
```
Add: setAuthentication(user, token) after login
```

### 5. Register Page (Existing)
```
Add: setAuthentication(user, token) after registration
```

## Testing

1. ✅ Open website - loads normally
2. ✅ Wait 10 seconds - popup appears
3. ✅ Click close (X) - popup closes
4. ✅ Wait 10 seconds - popup appears again
5. ✅ Click "Sign In" - goes to login page
6. ✅ Login - redirects to home
7. ✅ Popup doesn't appear (you're logged in)
8. ✅ Click protected button - works
9. ✅ Logout - popup appears again after 10 seconds
10. ✅ Chatbot input disabled when logged out
11. ✅ Chatbot input enabled when logged in

## Integration Options

### Option 1: React Component
```javascript
import { startAuthPopupAutoShow } from '@/lib/authPopup';

export function HomePage() {
  useEffect(() => {
    startAuthPopupAutoShow();
  }, []);
  
  return <div>...</div>;
}
```

### Option 2: Plain JavaScript
```html
<script type="module">
  import { startAuthPopupAutoShow } from './src/lib/authPopup.js';
  
  window.addEventListener('DOMContentLoaded', () => {
    startAuthPopupAutoShow();
  });
</script>
```

### Option 3: HTML onclick
```html
<button onclick="handlePlaceOrder()">Place Order</button>

<script type="module">
  import { protectedAction } from './src/lib/protectedActions.js';
  
  window.handlePlaceOrder = async () => {
    await protectedAction(() => {
      // Your action here
    });
  };
</script>
```

## Customize Popup Timing

**Change auto-show interval from 10 seconds to something else:**

In `src/lib/authPopup.js`, line ~19:
```javascript
this.AUTO_SHOW_INTERVAL = 10000; // milliseconds
// 5000 = 5 seconds
// 15000 = 15 seconds
// 20000 = 20 seconds
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Popup not appearing | Make sure `startAuthPopupAutoShow()` is called |
| Popup still showing after login | Make sure login saves token to localStorage |
| Button action not blocked | Make sure `protectedAction()` wraps the click handler |
| Chatbot input not disabled | Make sure you're using `isChatbotEnabled()` correctly |

## Next Steps

1. ✅ Read `INTEGRATION_GUIDE.md` for detailed examples
2. ✅ Copy the 3 steps from "Quick Start" above
3. ✅ Test locally
4. ✅ Deploy

## Documentation

Full integration guide with examples:
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Support

All code is well-commented. Check:
- `src/lib/authUtils.js` - Utility functions
- `src/lib/authPopup.js` - Popup implementation
- `src/lib/protectedActions.js` - Protected actions
- `src/lib/chatbotAuth.js` - Chatbot auth

---

**That's it! Start with the 3 quick start steps above.** 🚀
