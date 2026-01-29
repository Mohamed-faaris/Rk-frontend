// ============================================
// MINIMAL DIAGNOSTIC BOOT FILE
// ============================================
console.log('\n🔴 BOOT FILE STARTED');
console.log('RENDER PORT =', process.env.PORT);
console.log('NODE_ENV =', process.env.NODE_ENV);

import express from 'express';

const app = express();

// Minimal routes - NO complexity
app.get('/health', (req, res) => {
  console.log('📍 Health check hit');
  res.json({ status: 'OK', port: process.env.PORT });
});

// ============================================
// BIND TO PORT UNCONDITIONALLY
// ============================================
const PORT = process.env.PORT;

if (!PORT) {
  console.error('❌ PORT ENVIRONMENT VARIABLE NOT SET');
  process.exit(1);
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🟢 LISTENING ON ${PORT}`);
  console.log(`🟢 Binding address: 0.0.0.0`);
  console.log(`🟢 Ready to accept connections\n`);
});

server.on('error', (err) => {
  console.error('❌ SERVER BINDING ERROR:', err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('📌 SIGTERM received');
  server.close(() => process.exit(0));
});
