const { Router } = require('express');
const { listUsers, createUser, getWasteHistory } = require('./controller');
const { requireRole } = require('../auth/service');

const router = Router();


// Waste history for logged-in resident (role 'user')
router.get('/history', requireRole('user'), getWasteHistory);

router.get('/', requireRole('admin'), listUsers);
router.post('/', requireRole('admin'), createUser);

module.exports = router;
