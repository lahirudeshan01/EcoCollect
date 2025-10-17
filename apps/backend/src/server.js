require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db'); // MongoDB connection

// Import routers
const pickups = require('./routes/pickups');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'EcoCollect API' });
});

// Routes
app.use('/api/pickups', pickups);
app.use('/api/payments', paymentRoutes); // <-- Mount payment routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start server
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`✅ Backend API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
