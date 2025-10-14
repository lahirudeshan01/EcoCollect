const { Router } = require('express');
const { listUsers, createUser } = require('./controller');
const { requireRole } = require('../auth/service');

const router = Router();

router.get('/', requireRole('admin'), listUsers);
router.post('/', requireRole('admin'), createUser);

module.exports = router;
