require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const appRoutes = require('./app');          // your existing app.js
const paymentRoutes = require('./routes/paymentRoutes'); // Make sure this exists

// Create Express app
const app = express();

// Middleware
app.use(cors());           // enable CORS
app.use(express.json());   // parse JSON body
app.use(appRoutes);        // use existing routes from app.js if any

// API routes
app.use('/api/payments', paymentRoutes);

// Health check (optional)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'EcoCollect API' });
});

// Start server
(async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`✅ Backend API listening on http://localhost:${PORT}`);
    });

    // Handle port already in use
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try using another port.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
