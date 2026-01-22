/**
 * GET /api/users
 * Get all users from MongoDB
 * 
 * Usage:
 * curl http://localhost:3001/api/users
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       ...
 *     }
 *   ]
 * }
 */

import { connectDB } from '../lib/mongodb.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Get all users
    const users = await User.find().select('-__v');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch users',
    });
  }
}
