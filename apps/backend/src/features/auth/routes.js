const { Router } = require('express');
const { login, seedAdmin } = require('./controller');

const router = Router();

router.post('/login', login);
router.post('/seed-admin', seedAdmin);
// Convenience GET endpoint to seed admin from the browser
router.get('/seed-admin', seedAdmin);

module.exports = router;
