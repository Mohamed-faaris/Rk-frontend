/**
 * GET /api/orders
 * Get all orders from MongoDB
 * 
 * Query parameters:
 * - userId: Filter by user ID
 * - status: Filter by order status
 * 
 * Usage:
 * curl http://localhost:3001/api/orders
 * curl http://localhost:3001/api/orders?status=delivered
 */

import { connectDB } from '../lib/mongodb.js';
import Order from '../models/Order.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Build filter from query parameters
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get orders
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders',
    });
  }
}
