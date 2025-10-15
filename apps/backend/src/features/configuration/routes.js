const { Router } = require('express');
const { getConfig, updateConfig } = require('./controller');
const { protect, adminOnly } = require('../../middleware/auth.middleware');

const router = Router();

router.get('/', protect, adminOnly, getConfig);
router.put('/', protect, adminOnly, updateConfig);

module.exports = router;
