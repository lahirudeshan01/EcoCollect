const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRouter = require('./features'); // your main feature routes
const paymentRoutes = require('./routes/paymentRoutes'); // your payments API routes

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'EcoCollect API' });
});

// Mount feature routers
app.use('/api', apiRouter);

// Mount payments route separately
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
