#!/usr/bin/env node

/**
 * Quick Testing Script for Backend API
 * 
 * This script tests all API endpoints
 * 
 * Usage:
 * node test-api.js
 * 
 * The script will:
 * 1. Test health check
 * 2. Create a user
 * 3. Fetch all users
 * 4. Create an order
 * 5. Fetch all orders
 */

const API_URL = 'http://localhost:3001';

const log = {
  info: (msg) => console.log(`\n📝 ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  section: (msg) => console.log(`\n${'='.repeat(50)}\n🧪 ${msg}\n${'='.repeat(50)}`),
};

async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const method = options.method || 'GET';

  log.info(`${method} ${endpoint}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    log.error(error.message);
    return null;
  }
}

async function runTests() {
  log.section('Backend API Testing');

  try {
    // Test 1: Health Check
    log.section('Test 1: Health Check');
    const health = await apiCall('/api/health');
    if (!health) throw new Error('Health check failed');

    // Test 2: API Documentation
    log.section('Test 2: API Documentation');
    const docs = await apiCall('/api');
    if (!docs) throw new Error('Documentation endpoint failed');

    // Test 3: Create User
    log.section('Test 3: Create User');
    const userData = {
      name: 'Test User ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      phone: '+1234567890',
      company: 'Test Company',
    };
    const userResponse = await apiCall('/api/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (!userResponse) throw new Error('User creation failed');
    const userId = userResponse.data._id;

    // Test 4: Fetch All Users
    log.section('Test 4: Fetch All Users');
    const users = await apiCall('/api/users');
    if (!users) throw new Error('Fetch users failed');
    log.success(`Found ${users.count} users`);

    // Test 5: Create Order
    log.section('Test 5: Create Order');
    const orderData = {
      userId: userId,
      productName: 'Test Product',
      quantity: 2,
      price: 1000,
      notes: 'This is a test order',
    };
    const orderResponse = await apiCall('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    if (!orderResponse) throw new Error('Order creation failed');

    // Test 6: Fetch All Orders
    log.section('Test 6: Fetch All Orders');
    const orders = await apiCall('/api/orders');
    if (!orders) throw new Error('Fetch orders failed');
    log.success(`Found ${orders.count} orders`);

    // Test 7: Filter Orders by Status
    log.section('Test 7: Filter Orders by Status');
    const filteredOrders = await apiCall('/api/orders?status=pending');
    if (!filteredOrders) throw new Error('Filter orders failed');
    log.success(`Found ${filteredOrders.count} pending orders`);

    // Summary
    log.section('✨ All Tests Completed Successfully! ✨');
    console.log(`
    📊 Test Summary:
    ✅ Health Check: Passed
    ✅ API Documentation: Passed
    ✅ Create User: Passed
    ✅ Fetch Users: Passed
    ✅ Create Order: Passed
    ✅ Fetch Orders: Passed
    ✅ Filter Orders: Passed
    
    🎉 Your backend API is working perfectly!
    `);
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
runTests();
