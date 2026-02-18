// Vercel serverless adapter for Express
// This file imports the Express app from /server and handles all API requests

let app = null;

export default async function handler(req, res) {
  if (!app) {
    // Import the Express app (without starting the HTTP server)
    const module = await import('../server/index.js');
    app = module.default;
  }
  
  // Fix URL: Vercel strips /api prefix, but Express routes are mounted at /api/*
  // So we need to add /api back to the URL
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
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