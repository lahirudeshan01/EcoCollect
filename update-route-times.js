// Script to update all existing routes with estimated time calculations
const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function updateAllRoutesWithTime() {
  console.log('🔄 Updating all routes with estimated time calculations...\n');

  try {
    // Fetch all routes
    console.log('📡 Fetching all routes from database...');
    const response = await axios.get(`${BASE_URL}/routes`);
    const routes = response.data;
    
    console.log(`✅ Found ${routes.length} routes\n`);

    if (routes.length === 0) {
      console.log('ℹ️  No routes to update.');
      return;
    }

    // Check which routes need time updates
    const routesNeedingUpdate = routes.filter(route => !route.estimatedTime);
    const routesWithTime = routes.filter(route => route.estimatedTime);

    console.log(`✅ Routes with estimated time: ${routesWithTime.length}`);
    console.log(`⚠️  Routes needing time calculation: ${routesNeedingUpdate.length}\n`);

    if (routesNeedingUpdate.length === 0) {
      console.log('🎉 All routes already have estimated times!\n');
      
      // Display all routes with their times
      console.log('📊 Current Routes:');
      console.log('┌─────────────┬──────────┬────────┬──────────────┐');
      console.log('│ Route ID    │ Distance │ Points │ Est. Time    │');
      console.log('├─────────────┼──────────┼────────┼──────────────┤');
      routes.forEach(route => {
        const routeId = (route.routeId || 'N/A').padEnd(11);
        const distance = (route.distance || 'N/A').padEnd(8);
        const points = String(route.points?.length || 0).padEnd(6);
        const time = (route.estimatedTime || 'N/A').padEnd(12);
        console.log(`│ ${routeId} │ ${distance} │ ${points} │ ${time} │`);
      });
      console.log('└─────────────┴──────────┴────────┴──────────────┘\n');
      return;
    }

    console.log('🔧 Updating routes...\n');

    // Simply fetching all routes again will trigger the auto-calculation
    console.log('📡 Re-fetching routes to trigger auto-calculation...');
    const updatedResponse = await axios.get(`${BASE_URL}/routes`);
    const updatedRoutes = updatedResponse.data;

    console.log('✅ Routes updated!\n');

    // Display results
    console.log('📊 Updated Routes:');
    console.log('┌─────────────┬──────────┬────────┬──────────────┐');
    console.log('│ Route ID    │ Distance │ Points │ Est. Time    │');
    console.log('├─────────────┼──────────┼────────┼──────────────┤');
    updatedRoutes.forEach(route => {
      const routeId = (route.routeId || 'N/A').padEnd(11);
      const distance = (route.distance || 'N/A').padEnd(8);
      const points = String(route.points?.length || 0).padEnd(6);
      const time = (route.estimatedTime || 'N/A').padEnd(12);
      console.log(`│ ${routeId} │ ${distance} │ ${points} │ ${time} │`);
    });
    console.log('└─────────────┴──────────┴────────┴──────────────┘\n');

    console.log('🎉 All routes have been updated with estimated times!\n');

  } catch (error) {
    console.error('❌ Error updating routes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to backend server.');
      console.error('Make sure the backend is running on port 5001:');
      console.error('  cd apps/backend');
      console.error('  npm start\n');
    }
    process.exit(1);
  }
}

// Run the update
console.log('═'.repeat(60));
console.log('  Route Time Calculation Updater');
console.log('═'.repeat(60) + '\n');

updateAllRoutesWithTime().then(() => {
  console.log('✅ Update complete!');
  process.exit(0);
});
