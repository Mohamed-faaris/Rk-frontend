/**
 * CORS Configuration for Vercel Serverless
 * Allows frontend to communicate with backend
 */

import cors from 'cors';

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',           // Local React/Vite frontend
  'http://localhost:5173',           // Vite dev server
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://your-domain.com',         // Replace with your production domain
  'https://www.your-domain.com',
  'https://rk-website.vercel.app',   // Your Vercel deployment URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,                  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
