const { Router } = require('express');
const { login, seedAdmin, register, session, logout } = require('./controller');
const asyncHandler = require('../../utils/asyncHandler');
const { protect } = require('./service');

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));
router.post('/seed-admin', asyncHandler(seedAdmin));
// Convenience GET endpoint to seed admin from the browser
router.get('/seed-admin', asyncHandler(seedAdmin));
router.get('/session', protect, asyncHandler(session));
router.post('/logout', protect, asyncHandler(logout));

module.exports = router;
