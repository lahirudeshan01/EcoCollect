// Quick test script to verify route API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRouteAPI() {
  console.log('🧪 Testing Route API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Get all routes
    console.log('2️⃣ Testing GET /api/routes...');
    const routesResponse = await axios.get(`${BASE_URL}/routes`);
    console.log(`✅ Found ${routesResponse.data.length} routes`);
    console.log('');

    // Test 3: Get latest route
    console.log('3️⃣ Testing GET /api/routes/latest...');
    try {
      const latestResponse = await axios.get(`${BASE_URL}/routes/latest`);
      console.log('✅ Latest route:', latestResponse.data.routeId);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  No routes found (this is OK if database is empty)');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 4: Create a test route
    console.log('4️⃣ Testing POST /api/routes...');
    const testRoute = {
      routeId: `TEST-${Date.now()}`,
      truck: 'T-01',
      municipalCouncil: 'Test Council',
      distance: '10.5 km',
      status: 'Optimized',
      points: [
        { lat: 6.9271, lng: 79.8612, id: 'p1' },
        { lat: 6.9331, lng: 79.8502, id: 'p2' }
      ],
      route: [
        { lat: 6.9271, lng: 79.8612 },
        { lat: 6.9331, lng: 79.8502 }
      ],
      roadRoute: [
        { lat: 6.9271, lng: 79.8612 },
        { lat: 6.9331, lng: 79.8502 }
      ]
    };

    const createResponse = await axios.post(`${BASE_URL}/routes`, testRoute);
    console.log('✅ Route created:', createResponse.data.routeId);
    const createdRouteId = createResponse.data._id;
    console.log('');

    // Test 5: Get route by ID
    console.log('5️⃣ Testing GET /api/routes/:id...');
    const getRouteResponse = await axios.get(`${BASE_URL}/routes/${createdRouteId}`);
    console.log('✅ Route retrieved:', getRouteResponse.data.routeId);
    console.log('');

    // Test 6: Update route status
    console.log('6️⃣ Testing PUT /api/routes/:id...');
    const updateResponse = await axios.put(`${BASE_URL}/routes/${createdRouteId}`, {
      status: 'Dispatched',
      dispatched: true
    });
    console.log('✅ Route updated:', updateResponse.data.status);
    console.log('');

    // Test 7: Delete test route
    console.log('7️⃣ Testing DELETE /api/routes/:id...');
    const deleteResponse = await axios.delete(`${BASE_URL}/routes/${createdRouteId}`);
    console.log('✅ Route deleted:', deleteResponse.data.message);
    console.log('');

    console.log('🎉 All tests passed! Route API is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to backend server.');
      console.error('Make sure the backend is running on port 5000:');
      console.error('  cd apps/backend');
      console.error('  npm start\n');
    }
    process.exit(1);
  }
}

// Run tests
testRouteAPI();
