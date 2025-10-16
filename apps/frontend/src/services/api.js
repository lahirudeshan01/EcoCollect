import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export default api;

// Route API functions
export const routeAPI = {
  // Get all routes
  getAllRoutes: async () => {
    try {
      const response = await api.get('/routes');
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Create a new route
  createRoute: async (routeData) => {
    try {
      const response = await api.post('/routes', routeData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },

  // Update route status (for dispatch)
  updateRouteStatus: async (routeId, statusData) => {
    try {
      const response = await api.put(`/routes/${routeId}`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  },

  // Delete a route
  deleteRoute: async (routeId) => {
    try {
      const response = await api.delete(`/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  },

  // Get route by ID
  getRouteById: async (routeId) => {
    try {
      const response = await api.get(`/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  },

  // Get the latest route
  getLatestRoute: async () => {
    try {
      const response = await api.get('/routes/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest route:', error);
      throw error;
    }
  }
};

// Mock API functions
export const fetchDashboardData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalWaste: 12482,
          recyclingPercentage: 42,
          upcomingPickups: 3,
          recentActivity: [
            { date: '2025-10-15', description: 'Pickup completed for 15kg of waste.' },
            { date: '2025-10-10', description: 'Recycling reward of 50 points earned.' },
          ],
        });
      }, 500);
    });
  };
  
  export const requestPickup = async (formData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate success
        resolve({ success: true, data: { requiresPayment: false } });
  
        // Simulate suggestion
        // resolve({ success: false, suggestion: 'Tomorrow at 10 AM' });
  
        // Simulate failure
        // resolve({ success: false, message: 'Invalid address' });
      }, 1000);
    });
  };
  