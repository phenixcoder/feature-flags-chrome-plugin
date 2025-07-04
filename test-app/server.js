#!/usr/bin/env node
/**
 * Simple HTTP server for testing the Feature Flags Chrome Extension
 * Usage: node server.js [port]
 * Default port: 8000
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

// Get __dirname equivalent in ES modules
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default port
const PORT = process.argv[2] || 8000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  const ext = path.parse(filePath).ext;
  const mimeType = mimeTypes[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body>
            <h1>404 - File Not Found</h1>
            <p>The requested file <code>${pathname}</code> was not found.</p>
            <p><a href="/">Go back to home</a></p>
          </body>
        </html>
      `);
      return;
    }
    
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('🚀 Feature Flags Test Server');
  console.log(`📡 Serving at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🔗 Open http://localhost:${PORT} in your browser`);
  console.log('⏹️  Press Ctrl+C to stop the server');
  console.log();
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server stopped');
  process.exit(0);
});
