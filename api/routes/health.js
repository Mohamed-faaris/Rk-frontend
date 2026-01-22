/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Returns server and database status
 */

import { connectDB, getConnectionStatus } from '../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    // Try to connect to MongoDB
    await connectDB();

    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: getConnectionStatus(),
        uri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API is running but database is unavailable',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
