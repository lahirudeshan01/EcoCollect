const Route = require('./model');

/**
 * Calculate estimated time for a route based on distance and number of collection points
 * @param {string} distanceStr - Distance string (e.g., "10.5 km")
 * @param {number} numPoints - Number of collection points
 * @returns {object} - { timeString: "1h 25m", minutes: 85 }
 */
const calculateEstimatedTime = (distanceStr, numPoints = 0) => {
  // Extract numeric value from distance string
  const distanceKm = parseFloat(distanceStr.replace(/[^\d.]/g, ''));
  
  if (isNaN(distanceKm)) {
    return { timeString: 'N/A', minutes: 0 };
  }

  // Average speed in urban areas: 20-25 km/h (considering traffic, stops)
  const averageSpeedKmh = 22;
  
  // Time spent at each collection point (in minutes)
  const timePerStopMinutes = 3;
  
  // Calculate driving time
  const drivingTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  
  // Calculate collection time
  const collectionTimeMinutes = numPoints * timePerStopMinutes;
  
  // Total estimated time
  const totalMinutes = Math.round(drivingTimeMinutes + collectionTimeMinutes);
  
  // Format time string
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let timeString;
  if (hours > 0) {
    timeString = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else {
    timeString = `${minutes}m`;
  }
  
  return {
    timeString,
    minutes: totalMinutes
  };
};

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    console.log(`Retrieved ${routes.length} routes from database`);
    
    // Calculate time for routes that don't have it
    let updated = false;
    for (const route of routes) {
      if (!route.estimatedTime && route.distance) {
        const numPoints = route.points ? route.points.length : 0;
        const timeEstimate = calculateEstimatedTime(route.distance, numPoints);
        route.estimatedTime = timeEstimate.timeString;
        route.estimatedTimeMinutes = timeEstimate.minutes;
        await route.save();
        updated = true;
        console.log(`Updated time for route ${route.routeId}: ${timeEstimate.timeString}`);
      }
    }
    
    if (updated) {
      console.log('Some routes were updated with calculated times');
    }
    
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch routes',
      details: error.message 
    });
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

    // Validate required fields
    if (!routeId || !truck || !municipalCouncil || !distance) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['routeId', 'truck', 'municipalCouncil', 'distance']
      });
    }

    // Check if route with same ID already exists
    const existingRoute = await Route.findOne({ routeId });
    if (existingRoute) {
      console.log(`Duplicate route ID detected: ${routeId}`);
      return res.status(409).json({ 
        error: 'Route ID already exists',
        message: `A route with ID "${routeId}" already exists in the database. Please use a different route ID.`,
        conflictingRouteId: routeId
      });
    }

    // Calculate estimated time based on distance and number of points
    const numPoints = points ? points.length : 0;
    const timeEstimate = calculateEstimatedTime(distance, numPoints);

    const newRoute = new Route({
      routeId,
      truck,
      municipalCouncil,
      distance,
      estimatedTime: timeEstimate.timeString,
      estimatedTimeMinutes: timeEstimate.minutes,
      status: status || 'Optimized',
      points: points || [],
      route: route || [],
      roadRoute: roadRoute || [],
      dispatched: false
    });

    const savedRoute = await newRoute.save();
    console.log('Route saved successfully:', savedRoute._id);
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating route:', error);
    console.error('Error details:', error.message);
    
    // Handle duplicate key error from MongoDB
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return res.status(409).json({ 
        error: 'Route ID already exists',
        message: 'This route ID is already in use. The system will generate a new unique ID.',
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create route',
      details: error.message 
    });
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

    // Calculate time if it's missing
    if (!route.estimatedTime && route.distance) {
      const numPoints = route.points ? route.points.length : 0;
      const timeEstimate = calculateEstimatedTime(route.distance, numPoints);
      route.estimatedTime = timeEstimate.timeString;
      route.estimatedTimeMinutes = timeEstimate.minutes;
      await route.save();
      console.log(`Updated time for route ${route.routeId}: ${timeEstimate.timeString}`);
    }

    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

// Get the latest route
const getLatestRoute = async (req, res) => {
  try {
    const route = await Route.findOne().sort({ createdAt: -1 });

    if (!route) {
      return res.status(404).json({ error: 'No routes found' });
    }

    // Calculate time if it's missing
    if (!route.estimatedTime && route.distance) {
      const numPoints = route.points ? route.points.length : 0;
      const timeEstimate = calculateEstimatedTime(route.distance, numPoints);
      route.estimatedTime = timeEstimate.timeString;
      route.estimatedTimeMinutes = timeEstimate.minutes;
      await route.save();
      console.log(`Updated time for route ${route.routeId}: ${timeEstimate.timeString}`);
    }

    res.json(route);
  } catch (error) {
    console.error('Error fetching latest route:', error);
    res.status(500).json({ error: 'Failed to fetch latest route' });
  }
};

module.exports = {
  getAllRoutes,
  createRoute,
  updateRouteStatus,
  deleteRoute,
  getRouteById,
  getLatestRoute
};