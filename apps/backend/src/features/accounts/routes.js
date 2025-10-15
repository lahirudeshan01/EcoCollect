const { Router } = require('express');
const { getMyAccount, schedulePickup } = require('./controller');
const { requireRole } = require('../auth/service');

const router = Router();

router.get('/me', requireRole(['resident','user','admin']), getMyAccount);
router.post('/pickups', requireRole(['resident','user','admin']), schedulePickup);

module.exports = router;
