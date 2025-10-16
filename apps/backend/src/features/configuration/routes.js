const { Router } = require('express');
const { getConfig, updateConfig } = require('./controller');
const { protect, adminOnly } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');

const router = Router();

router.get('/', protect, adminOnly, asyncHandler(getConfig));
router.put('/', protect, adminOnly, asyncHandler(updateConfig));

module.exports = router;
