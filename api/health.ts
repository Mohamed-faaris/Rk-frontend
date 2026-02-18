import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose, { connect } from 'mongoose';

let cachedConnection: boolean = false;

async function connectDB() {
  console.log('[HEALTH] connectDB() called, cachedConnection:', cachedConnection);
  
  if (cachedConnection) {
    console.log('[HEALTH] Returning cached mongoose, connection state:', mongoose.connection?.readyState);
    return mongoose;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  console.log('[HEALTH] MONGODB_URI exists:', !!MONGODB_URI);
  console.log('[HEALTH] MONGODB_URI length:', MONGODB_URI?.length);
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }
  
  console.log('[HEALTH] Attempting to connect to MongoDB...');
  try {
    await connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1,
    });
    console.log('[HEALTH] MongoDB connect() succeeded');
    console.log('[HEALTH] Connection state after connect:', mongoose.connection?.readyState);
  } catch (err: any) {
    console.log('[HEALTH] MongoDB connect() failed:', err.message);
    throw err;
  }
  
  cachedConnection = true;
  console.log('[HEALTH] Returning mongoose with connection state:', mongoose.connection?.readyState);
  return mongoose;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[HEALTH] Handler called at', new Date().toISOString());
  let dbStatus = 'disconnected';
  let dbError = null;
  
  try {
    const mongooseInstance = await connectDB();
    console.log('[HEALTH] connectDB() returned, checking connection...');
    console.log('[HEALTH] mongooseInstance exists:', !!mongooseInstance);
    console.log('[HEALTH] mongooseInstance.connection exists:', !!mongooseInstance?.connection);
    
    const readyState = mongooseInstance.connection?.readyState;
    console.log('[HEALTH] readyState:', readyState);
    dbStatus = readyState === 1 ? 'connected' : `disconnected (state: ${readyState})`;
  } catch (err: any) {
    console.log('[HEALTH] Error in handler:', err.message);
    dbStatus = 'error';
    dbError = err.message;
  }
  
  console.log('[HEALTH] Final status:', dbStatus);
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