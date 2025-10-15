const { Router } = require('express');
const { submitCollection } = require('./controller');
const { requireRole } = require('../auth/service');

const router = Router();

router.post('/', requireRole(['staff','admin']), submitCollection);

module.exports = router;
