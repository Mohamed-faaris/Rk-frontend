/**
 * RENDER ENVIRONMENT CONFIGURATION EXAMPLE
 * 
 * This file shows how your Node.js code reads environment variables
 * set in Render Dashboard and how to use them in your routes/controllers.
 * 
 * Copy these patterns into your own files!
 */

// ============================================================
// EXAMPLE 1: Basic Environment Variable Reading
// ============================================================

function getEnvironmentConfig() {
  // These values come from Render Dashboard Environment variables
  const config = {
    // Application Configuration
    nodeEnv: process.env.NODE_ENV,           // production | development | staging
    port: process.env.PORT || 10000,         // Render uses 10000
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Database Configuration
    mongodbUri: process.env.MONGODB_URI,     // Set in Render Secrets
    dbConnectionPoolSize: parseInt(process.env.DB_CONNECTION_POOL_SIZE) || 10,
    
    // API Configuration
    corsOrigin: process.env.CORS_ORIGIN || '*',
    apiTimeout: parseInt(process.env.API_TIMEOUT) || 30000,
    
    // Security
    jwtSecret: process.env.JWT_SECRET,       // Set in Render Secrets
    
    // Third-party Services
    sendgridApiKey: process.env.SENDGRID_API_KEY,  // Set in Render Secrets
    stripeApiKey: process.env.STRIPE_API_KEY,      // Set in Render Secrets
  };
  
  return config;
}

// Usage:
// const config = getEnvironmentConfig();
// console.log(`Running in ${config.nodeEnv} mode`);


// ============================================================
// EXAMPLE 2: MongoDB Connection Using Environment Variables
// ============================================================

const mongodb = require('mongodb');

async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;
  
  // Validate that the environment variable is set
  if (!mongodbUri) {
    throw new Error(
      'ERROR: MONGODB_URI environment variable is not set. ' +
      'Please add it to Render Dashboard under Environment → Secrets'
    );
  }
  
  try {
    const client = new mongodb.MongoClient(mongodbUri, {
      maxPoolSize: parseInt(process.env.DB_CONNECTION_POOL_SIZE) || 10,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    return client;
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

// Usage:
// const client = await connectToDatabase();
// const db = client.db('rk_database');


// ============================================================
// EXAMPLE 3: Express Server with Environment Configuration
// ============================================================

const express = require('express');

function createExpressServer() {
  const app = express();
  const port = process.env.PORT || 10000;
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const logLevel = process.env.LOG_LEVEL || 'info';
  
  // CORS Middleware
  const cors = require('cors');
  app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
  
  // Logging Middleware
  app.use((req, res, next) => {
    if (logLevel !== 'silent') {
      console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.path}`);
    }
    next();
  });
  
  // Health Check Route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      environment: process.env.NODE_ENV,
      port: port,
      corsOrigin: corsOrigin,
      timestamp: new Date().toISOString(),
    });
  });
  
  return app;
}

// Usage:
// const app = createExpressServer();
// app.listen(process.env.PORT || 10000);


// ============================================================
// EXAMPLE 4: Authentication with JWT Secret
// ============================================================

const jwt = require('jsonwebtoken');

function createAuthToken(userId, email) {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error(
      'ERROR: JWT_SECRET not set. ' +
      'Set in Render Dashboard → Environment → Secrets'
    );
  }
  
  return jwt.sign(
    { userId, email },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

function verifyAuthToken(token) {
  const jwtSecret = process.env.JWT_SECRET;
  
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

// Usage:
// const token = createAuthToken(123, 'user@example.com');
// const decoded = verifyAuthToken(token);


// ============================================================
// EXAMPLE 5: Email Service with SendGrid API Key
// ============================================================

const sgMail = require('@sendgrid/mail');

async function sendEmail(to, subject, html) {
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  
  if (!sendgridApiKey) {
    throw new Error(
      'ERROR: SENDGRID_API_KEY not set. ' +
      'Set in Render Dashboard → Environment → Secrets'
    );
  }
  
  sgMail.setApiKey(sendgridApiKey);
  
  try {
    await sgMail.send({
      to,
      from: 'noreply@rajkayal.com',
      subject,
      html,
    });
    
    console.log(`✓ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to send email:', error.message);
    throw error;
  }
}

// Usage:
// await sendEmail(
//   'user@example.com',
//   'Welcome to RK Website',
//   '<h1>Welcome!</h1><p>Thanks for signing up.</p>'
// );


// ============================================================
// EXAMPLE 6: Payment Processing with Stripe API Key
// ============================================================

const stripe = require('stripe');

function createStripeClient() {
  const stripeApiKey = process.env.STRIPE_API_KEY;
  
  if (!stripeApiKey) {
    throw new Error(
      'ERROR: STRIPE_API_KEY not set. ' +
      'Set in Render Dashboard → Environment → Secrets'
    );
  }
  
  return stripe(stripeApiKey);
}

async function processPayment(amount, currency = 'usd') {
  const stripeClient = createStripeClient();
  
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
    });
    
    console.log('✓ Payment intent created:', paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error('✗ Payment failed:', error.message);
    throw error;
  }
}

// Usage:
// const paymentIntent = await processPayment(99.99);


// ============================================================
// EXAMPLE 7: Environment Validation on Startup
// ============================================================

function validateRequiredEnvironmentVariables() {
  const required = [
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
  ];
  
  const optional = [
    'SENDGRID_API_KEY',
    'STRIPE_API_KEY',
  ];
  
  const missing = [];
  
  // Check required variables
  for (const variable of required) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nSet these in Render Dashboard → Environment');
    process.exit(1);
  }
  
  // Log optional variables
  console.log('✓ Required environment variables are set');
  
  const missingOptional = optional.filter(v => !process.env[v]);
  if (missingOptional.length > 0) {
    console.log('⚠ Optional variables not set:');
    missingOptional.forEach(v => console.log(`   - ${v}`));
  }
  
  // Log configuration
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  console.log(`✓ Port: ${process.env.PORT}`);
  console.log(`✓ Log Level: ${process.env.LOG_LEVEL}`);
  console.log(`✓ CORS Origin: ${process.env.CORS_ORIGIN}`);
}

// Usage (call at server startup):
// validateRequiredEnvironmentVariables();


// ============================================================
// EXAMPLE 8: Complete Server Startup with Environment Config
// ============================================================

async function startServer() {
  try {
    console.log('🚀 Starting RK Website API Server...\n');
    
    // 1. Validate environment variables
    validateRequiredEnvironmentVariables();
    console.log('');
    
    // 2. Connect to database
    const mongoClient = await connectToDatabase();
    console.log('');
    
    // 3. Create Express app
    const app = createExpressServer();
    console.log('✓ Express app created');
    
    // 4. Add API routes
    app.get('/api/users', async (req, res) => {
      const db = mongoClient.db('rk_database');
      const users = await db.collection('users').find({}).toArray();
      res.json({ success: true, data: users });
    });
    
    app.post('/api/users/create', async (req, res) => {
      const db = mongoClient.db('rk_database');
      const result = await db.collection('users').insertOne(req.body);
      res.json({ success: true, data: result });
    });
    
    // 5. Start server
    const port = process.env.PORT || 10000;
    app.listen(port, () => {
      console.log(`✓ Server running on http://localhost:${port}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ API URL: http://localhost:${port}/api`);
      console.log('\n🎉 Server is ready for requests!\n');
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}


// ============================================================
// EXAMPLE 9: Environment Variable Patterns to Use in Routes
// ============================================================

/**
 * Pattern 1: Simple Environment Variable
 */
function getSimpleConfig() {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    apiTimeout: parseInt(process.env.API_TIMEOUT),
  };
}

/**
 * Pattern 2: Environment Variable with Default
 */
function getConfigWithDefaults() {
  return {
    port: parseInt(process.env.PORT) || 10000,
    logLevel: process.env.LOG_LEVEL || 'info',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  };
}

/**
 * Pattern 3: Environment Variable with Validation
 */
function getValidatedConfig() {
  const required = {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
  };
  
  const invalid = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (invalid.length > 0) {
    throw new Error(`Missing required: ${invalid.join(', ')}`);
  }
  
  return required;
}

/**
 * Pattern 4: Environment Variable for Secrets
 */
function getSecrets() {
  return {
    mongo: process.env.MONGODB_URI,
    jwt: process.env.JWT_SECRET,
    sendgrid: process.env.SENDGRID_API_KEY,
    stripe: process.env.STRIPE_API_KEY,
  };
}


module.exports = {
  getEnvironmentConfig,
  connectToDatabase,
  createExpressServer,
  createAuthToken,
  verifyAuthToken,
  sendEmail,
  createStripeClient,
  processPayment,
  validateRequiredEnvironmentVariables,
  startServer,
};
