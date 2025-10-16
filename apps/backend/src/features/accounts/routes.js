const { Router } = require('express');
const { getMyAccount, schedulePickup } = require('./controller');
const { requireRole } = require('../auth/service');
const asyncHandler = require('../../utils/asyncHandler');

const router = Router();

router.get('/me', requireRole(['resident','user','admin']), asyncHandler(getMyAccount));
router.post('/pickups', requireRole(['resident','user','admin']), asyncHandler(schedulePickup));

module.exports = router;
