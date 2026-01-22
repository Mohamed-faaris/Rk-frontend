# Frontend API Client for Render Backend

This file shows how to properly configure your React frontend to communicate with the deployed backend.

## File: src/lib/api.ts (or api.js)

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

// Get API base URL from environment variables
// In .env.production: VITE_API_URL=https://your-service.onrender.com
// In .env.development: VITE_API_URL=http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  withCredentials: true, // Important: Send cookies/auth with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if it exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ ${error.response.status} ${error.config?.url}`);
      console.error('Error data:', error.response.data);

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
      console.error('Possible reasons:');
      console.error('1. Backend not running');
      console.error('2. Wrong API URL');
      console.error('3. CORS not configured');
      console.error('4. Network issue');
    } else {
      // Error in request setup
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// Authentication APIs
// ============================================
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),

  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => apiClient.post('/api/auth/register', userData),

  logout: () => apiClient.post('/api/auth/logout'),

  verifyOTP: (email: string, otp: string) =>
    apiClient.post('/api/otp/verify', { email, otp }),

  sendOTP: (email: string) =>
    apiClient.post('/api/otp/send', { email }),
};

// ============================================
// Order APIs
// ============================================
export const orderAPI = {
  getAll: () => apiClient.get('/api/orders'),

  getById: (id: string) => apiClient.get(`/api/orders/${id}`),

  create: (orderData: any) =>
    apiClient.post('/api/orders', orderData),

  update: (id: string, orderData: any) =>
    apiClient.put(`/api/orders/${id}`, orderData),

  delete: (id: string) =>
    apiClient.delete(`/api/orders/${id}`),

  getMyOrders: () =>
    apiClient.get('/api/orders/my-orders'),
};

// ============================================
// Portfolio APIs
// ============================================
export const portfolioAPI = {
  getAll: () => apiClient.get('/api/portfolio'),

  getById: (id: string) => apiClient.get(`/api/portfolio/${id}`),

  create: (portfolioData: any) =>
    apiClient.post('/api/portfolio', portfolioData),

  update: (id: string, portfolioData: any) =>
    apiClient.put(`/api/portfolio/${id}`, portfolioData),

  delete: (id: string) =>
    apiClient.delete(`/api/portfolio/${id}`),
};

// ============================================
// Upload APIs
// ============================================
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    return apiClient.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============================================
// Contact APIs
// ============================================
export const contactAPI = {
  sendMessage: (messageData: {
    name: string;
    email: string;
    message: string;
  }) => apiClient.post('/api/contact', messageData),

  getAll: () => apiClient.get('/api/contact'),
};

// ============================================
// Utility Functions
// ============================================

/**
 * Check if backend is accessible
 * Useful for showing connection status
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('Backend health:', response.data);
    return true;
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};

/**
 * Check API status
 */
export const checkAPIStatus = async () => {
  try {
    const response = await apiClient.get('/api/status');
    console.log('API status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Could not get API status:', error);
    return null;
  }
};

/**
 * Set authentication token
 */
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Clear authentication
 */
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;
```

---

## Environment Configuration

### File: .env.development
```
VITE_API_URL=http://localhost:5000
```

### File: .env.production
```
VITE_API_URL=https://your-service.onrender.com
```

---

## Usage Examples in React Components

### Example 1: Login Component

```typescript
import { useState } from 'react';
import { authAPI, setAuthToken } from '@/lib/api';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      
      // Save token
      setAuthToken(response.data.token);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 2: Order List Component

```typescript
import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getMyOrders();
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ddd', padding: '10px' }}>
          <h3>Order #{order._id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: File Upload Component

```typescript
import { useState } from 'react';
import { uploadAPI } from '@/lib/api';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadFile(file);
      setUploadedUrl(response.data.url);
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <button type="submit" disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadedUrl && (
        <p>
          Uploaded: <a href={uploadedUrl} target="_blank">{uploadedUrl}</a>
        </p>
      )}
    </form>
  );
}
```

### Example 4: Check Backend Status

```typescript
import { useEffect, useState } from 'react';
import { checkBackendHealth } from '@/lib/api';

export function BackendStatus() {
  const [status, setStatus] = useState<'unknown' | 'online' | 'offline'>(
    'unknown'
  );

  useEffect(() => {
    const checkStatus = async () => {
      const isHealthy = await checkBackendHealth();
      setStatus(isHealthy ? 'online' : 'offline');
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const colors = {
    online: 'green',
    offline: 'red',
    unknown: 'gray',
  };

  return (
    <div style={{ color: colors[status] }}>
      Backend: {status.toUpperCase()}
    </div>
  );
}
```

---

## Vite Configuration

### File: vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Proxy API calls during development (optional)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path, // Keep /api prefix
      },
    },
  },
});
```

---

## Troubleshooting API Connection

### Issue: "CORS error when calling API"

**Solution:**
1. Check backend has CORS enabled in Render
2. Verify frontend URL is in allowed origins
3. Ensure `withCredentials: true` in apiClient
4. Check browser console for full error

### Issue: "API calls work locally but not in production"

**Solution:**
1. Verify VITE_API_URL in .env.production
2. Check Render environment variable is set
3. Rebuild and redeploy frontend
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Cannot find modules error"

**Solution:**
```bash
# Install dependencies
npm install

# Clear node_modules if needed
rm -rf node_modules
npm install
```

### Issue: "Timeout calling API"

**Solution:**
1. Increase axios timeout: `timeout: 60000`
2. Check if Render service is still alive
3. Verify database connection is working
4. Check Render logs for errors

---

## Testing API Connection

### Manual Test
```bash
# Test health endpoint
curl https://your-service.onrender.com/health

# Test API
curl https://your-service.onrender.com/api/status

# Test with auth token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-service.onrender.com/api/users/me
```

### Using Postman
1. Import collection from API documentation
2. Set variable: `{{BASE_URL}}=https://your-service.onrender.com`
3. Set variable: `{{TOKEN}}=your_auth_token`
4. Run requests

---

**Your frontend is now properly configured to communicate with the Render backend! 🚀**
