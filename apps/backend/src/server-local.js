require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'EcoCollect Backend API', version: '1.0.0' });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple auth endpoint
app.post('/api/authorities/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password });
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Simple hardcoded check
    if (username === 'admin' && password === 'password') {
      const token = 'simple-jwt-token-' + Date.now();
      res.json({ 
        token, 
        authority: { 
          id: 1,
          username: 'admin' 
        } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

// Start server
const server = http.createServer(app);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Backend API listening on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/authorities/login`);
  console.log('✅ Server started successfully (no database required)');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});