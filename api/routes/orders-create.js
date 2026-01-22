/**
 * POST /api/orders/create
 * Create a new order in MongoDB
 * 
 * Request body:
 * {
 *   "userId": "user_id_here",
 *   "productName": "Website Design",
 *   "quantity": 1,
 *   "price": 5000,
 *   "notes": "Custom design needed"
 * }
 */

import { connectDB } from '../lib/mongodb.js';
import Order from '../models/Order.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId, productName, quantity, price, notes } = req.body;

    // Validate required fields
    if (!userId || !productName || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: 'userId, productName, quantity, and price are required',
      });
    }

    // Calculate total amount
    const totalAmount = quantity * price;

    // Create new order
    const newOrder = new Order({
      userId,
      productName,
      quantity,
      price,
      totalAmount,
      notes: notes || '',
    });

    // Save order to database
    await newOrder.save();

    // Populate user details
    await newOrder.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order',
    });
  }
}
