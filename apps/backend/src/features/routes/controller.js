const Route = require('./model');

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

// Create a new route
const createRoute = async (req, res) => {
  try {
    const {
      routeId,
      truck,
      municipalCouncil,
      distance,
      status,
      points,
      route,
      roadRoute
    } = req.body;

    // Check if route with same ID already exists
    const existingRoute = await Route.findOne({ routeId });
    if (existingRoute) {
      return res.status(400).json({ error: 'Route with this ID already exists' });
    }

    const newRoute = new Route({
      routeId,
      truck,
      municipalCouncil,
      distance,
      status,
      points,
      route,
      roadRoute
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
};

// Update route status (for dispatch)
const updateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dispatched } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      { status, dispatched },
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(updatedRoute);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Failed to update route' });
  }
};

// Delete a route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully', route: deletedRoute });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
};

// Get route by ID
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

module.exports = {
  getAllRoutes,
  createRoute,
  updateRouteStatus,
  deleteRoute,
  getRouteById
};