// Backend routes entry
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('API Home');
});

// Residents route
router.get('/residents', async (req, res) => {
  try {
    const db = req.app.locals.db; // Access the db from app.js
    const residents = await db.collection('Residents').find({}).toArray();
    res.json(residents);
  } catch (err) {
    res.status(500).send('Error fetching residents');
  }
});

module.exports = router;
