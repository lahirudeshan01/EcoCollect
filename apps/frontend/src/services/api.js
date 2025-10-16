import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export default api;

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
  