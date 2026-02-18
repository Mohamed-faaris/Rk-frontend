import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connect } from 'mongoose';

let cachedConnection: typeof import('mongoose') | null = null;

async function connectDB() {
  if (cachedConnection) return cachedConnection;
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }
  
  await connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 1,
  });
  
  cachedConnection = await import('mongoose');
  return cachedConnection;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let dbStatus = 'disconnected';
  let dbError = null;
  
  try {
    const mongoose = await connectDB();
    const readyState = mongoose.connection?.readyState;
    dbStatus = readyState === 1 ? 'connected' : `disconnected (state: ${readyState})`;
  } catch (err: any) {
    dbStatus = 'error';
    dbError = err.message;
  }
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RK Creative Hub API',
    database: {
      status: dbStatus,
      error: dbError,
    },
    environment: process.env.NODE_ENV || 'development',
  });
}