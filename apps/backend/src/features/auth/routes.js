const { Router } = require('express');
const { login, seedAdmin, seedResident, register } = require('./controller');

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/seed-admin', seedAdmin);
// Convenience GET endpoint to seed admin from the browser
router.get('/seed-admin', seedAdmin);
// Seed a resident test user
router.post('/seed-resident', seedResident);
router.get('/seed-resident', seedResident);

module.exports = router;
