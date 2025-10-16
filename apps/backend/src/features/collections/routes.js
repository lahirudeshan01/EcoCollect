const { Router } = require('express');
const { scan, seedBin } = require('./controller');

const router = Router();

// POST /api/collections/scan
router.post('/scan', scan);

// GET /api/collections/seed-bin/:id?  -> creates or updates a test bin for development
router.get('/seed-bin/:id?', seedBin);

module.exports = router;
