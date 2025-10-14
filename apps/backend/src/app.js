const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRouter = require('./features');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'EcoCollect API' }));

// Mount feature routers
app.use('/api', apiRouter);

module.exports = app;
