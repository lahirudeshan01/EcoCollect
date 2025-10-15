const { Router } = require('express');
const { listRoutes, createRoute, optimizeRoutes } = require('./controller');
const { requireRole } = require('../auth/service');

const router = Router();

router.get('/', requireRole(['manager','admin']), listRoutes);
router.post('/', requireRole(['manager','admin']), createRoute);
router.post('/optimize', requireRole(['manager','admin']), optimizeRoutes);

module.exports = router;
