const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const apiRouter = require('./features');
const errorHandler = require('./middleware/errorHandler');

const app = express();
// Enable CORS with credentials so cookies work across ports in dev
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// CSRF protection: cookie-based secret; safe methods are ignored automatically
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } });
app.use(csrfProtection);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'EcoCollect API' }));

// Endpoint to fetch CSRF token for clients
app.get('/api/csrf-token', (req, res) => {
	res.json({ csrfToken: req.csrfToken() });
});

// (no debug endpoints in production)

// Mount feature routers
app.use('/api', apiRouter);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
