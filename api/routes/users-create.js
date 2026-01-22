/**
 * POST /api/users/create
 * Create a new user in MongoDB
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "company": "Acme Inc"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "User created successfully",
 *   "data": { ... user object ... }
 * }
 */

import { connectDB } from '../lib/mongodb.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Get data from request body
    const { name, email, phone, company } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      phone: phone || '',
      company: company || '',
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user',
    });
  }
}
