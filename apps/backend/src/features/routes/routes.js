const { Router } = require('express');
const {
  getAllRoutes,
  createRoute,
  updateRouteStatus,
  deleteRoute,
  getRouteById,
  getLatestRoute,
} = require('./controller');

const router = Router();

// GET /api/routes - Get all routes
router.get('/', getAllRoutes);

// GET /api/routes/latest - Get the latest route
router.get('/latest', getLatestRoute);

// POST /api/routes - Create a new route
router.post('/', createRoute);

// GET /api/routes/:id - Get route by ID
router.get('/:id', getRouteById);

// PUT /api/routes/:id - Update route status
router.put('/:id', updateRouteStatus);

// DELETE /api/routes/:id - Delete a route
router.delete('/:id', deleteRoute);

module.exports = router;