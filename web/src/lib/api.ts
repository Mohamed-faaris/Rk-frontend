import axios from 'axios';
import { env } from './env';

const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5002/api';
  }

  return env.VITE_API_URL;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const notifyUnauthorized = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
    const isOnLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    
    // Clear auth on 401 unauthorized errors
    if (error.response?.status === 401 && !isAuthRequest && !isOnLoginPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      notifyUnauthorized();
    }
    
    return Promise.reject(error);
  }
);

export { api as apiClient };
export { API_BASE_URL };
export default api;
