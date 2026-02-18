// Vercel serverless adapter for Express
// This file imports the Express app from /server and handles all API requests

import { createServer } from 'http';
import { parse } from 'url';

let app = null;

export default async function handler(req, res) {
  if (!app) {
    // Import the Express app (without starting the HTTP server)
    const module = await import('../server/index.js');
    app = module.default;
  }
  
  // Forward the request to Express
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('[API Error]', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
        reject(err);
      } else {
        if (!res.headersSent) {
          res.status(404).json({ error: 'Not found' });
        }
        resolve();
      }
    });
  });
}