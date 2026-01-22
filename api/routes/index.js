/**
 * Root Endpoint
 * GET /api
 * 
 * API Documentation and routes
 */

export default async function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Welcome to RK Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /api': 'API documentation (this endpoint)',
      'GET /api/health': 'Health check - database status',
      'GET /api/users': 'Get all users',
      'POST /api/users/create': 'Create new user',
      'GET /api/orders': 'Get all orders (with filtering)',
      'POST /api/orders/create': 'Create new order',
    },
    documentation: {
      baseUrl: 'http://localhost:3001 (dev) | https://your-domain.com (production)',
      authentication: 'Currently no auth required',
      cors: 'Enabled for localhost:3000, localhost:5173, and production domains',
      database: 'MongoDB with Mongoose ODM',
    },
    exampleRequests: {
      createUser: {
        method: 'POST',
        url: '/api/users/create',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Inc',
        },
      },
      createOrder: {
        method: 'POST',
        url: '/api/orders/create',
        body: {
          userId: 'user_id_from_database',
          productName: 'Website Design',
          quantity: 1,
          price: 5000,
          notes: 'Custom design',
        },
      },
    },
  });
}
