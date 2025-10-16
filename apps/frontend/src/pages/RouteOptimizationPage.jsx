import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { defaultWasteCollectionPoints } from '../components/Map';
import { routeAPI } from '../services/api';

export default function RouteOptimizationPage() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Colombo Municipal Council');
  const [isRouteCreationMode, setIsRouteCreationMode] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [generatedRoutes, setGeneratedRoutes] = useState([]);
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRoadRoute, setCurrentRoadRoute] = useState(null);

  // Load routes from database
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await routeAPI.getAllRoutes();
        setGeneratedRoutes(routes);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        alert('Failed to load routes. Please try again.');
      }
    };
    fetchRoutes();
  }, []);

  // Handle point selection on map
  const handlePointClick = (point, action = 'add') => {
    if (action === 'remove') {
      setSelectedPoints(prev => prev.filter(p => p.id !== point.id));
    } else {
      setSelectedPoints(prev => [...prev, point]);
    }
  };

  // Simple route optimization algorithm with municipal council as start/end point
  const optimizeRoute = (points) => {
    if (points.length < 2) return points.map(p => p.position);
    
    // Find the municipal council point for the selected area
    const municipalPoint = defaultWasteCollectionPoints.find(
      point => point.municipalCouncil === selectedArea
    );
    
    if (!municipalPoint) {
      // Fallback to original logic if no municipal point found
      const unvisited = [...points];
      const route = [];
      let current = unvisited.shift();
      route.push(current.position);
      
      while (unvisited.length > 0) {
        let nearest = unvisited[0];
        let nearestIndex = 0;
        let minDistance = getDistance(current.position, nearest.position);
        
        for (let i = 1; i < unvisited.length; i++) {
          const distance = getDistance(current.position, unvisited[i].position);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = unvisited[i];
            nearestIndex = i;
          }
        }
        
        route.push(nearest.position);
        current = nearest;
        unvisited.splice(nearestIndex, 1);
      }
      
      return route;
    }
    
    // Create route starting and ending at municipal council point
    const startEndPoint = { 
      id: 'municipal-start', 
      position: municipalPoint.position, 
      name: `${municipalPoint.name} (Depot)` 
    };
    
    // Optimize route through all selected points
    const unvisited = [...points];
    const route = [startEndPoint.position]; // Start at municipal point
    
    // Find nearest point from municipal point to start the collection
    if (unvisited.length > 0) {
      let nearest = unvisited[0];
      let nearestIndex = 0;
      let minDistance = getDistance(startEndPoint.position, nearest.position);
      
      for (let i = 1; i < unvisited.length; i++) {
        const distance = getDistance(startEndPoint.position, unvisited[i].position);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = unvisited[i];
          nearestIndex = i;
        }
      }
      
      let current = nearest;
      route.push(current.position);
      unvisited.splice(nearestIndex, 1);
      
      // Continue with nearest neighbor algorithm
      while (unvisited.length > 0) {
        nearest = unvisited[0];
        nearestIndex = 0;
        minDistance = getDistance(current.position, nearest.position);
        
        for (let i = 1; i < unvisited.length; i++) {
          const distance = getDistance(current.position, unvisited[i].position);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = unvisited[i];
            nearestIndex = i;
          }
        }
        
        route.push(nearest.position);
        current = nearest;
        unvisited.splice(nearestIndex, 1);
      }
    }
    
    // Return to municipal point (depot) at the end
    route.push(startEndPoint.position);
    
    return route;
  };

  // Calculate distance between two points (simple Euclidean distance)
  const getDistance = (point1, point2) => {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate total route distance for road routes
  const calculateRoadRouteDistance = (roadRoute) => {
    if (!roadRoute || roadRoute.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < roadRoute.length - 1; i++) {
      totalDistance += getDistance(roadRoute[i], roadRoute[i + 1]);
    }
    return (totalDistance * 111.32).toFixed(1); // Convert to approximate km
  };

  // Calculate total route distance (fallback for straight lines)
  const calculateRouteDistance = (route) => {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += getDistance(route[i], route[i + 1]);
    }
    return (totalDistance * 111.32).toFixed(1); // Convert to approximate km
  };

  // Handle route deletion
  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
      try {
        await routeAPI.deleteRoute(routeId);
        setGeneratedRoutes(prev => prev.filter(route => route.id !== routeId));
        alert('Route deleted successfully!');
      } catch (error) {
        console.error("Failed to delete route:", error);
        alert('Failed to delete route. Please try again.');
      }
    }
  };

  // Handle route dispatch
  const handleDispatchRoute = async (route) => {
    if (window.confirm(`Are you sure you want to dispatch route ${route.id} to truck ${route.truck}?`)) {
      try {
        const updatedRoute = await routeAPI.updateRouteStatus(route.id, { 
          status: 'Dispatched',
          dispatched: true,
        });
        setGeneratedRoutes(prev => 
          prev.map(r => (r.id === route.id ? updatedRoute : r))
        );
        alert(`Route ${route.id} has been dispatched to truck ${route.truck}!`);
      } catch (error) {
        console.error("Failed to dispatch route:", error);
        alert('Failed to dispatch route. Please try again.');
      }
    }
  };

  // Handle road route generation callback
  const handleRoadRouteGenerated = (roadRoute) => {
    setCurrentRoadRoute(roadRoute);
  };

  // Handle route generation
  const handleGenerateRoutes = () => {
    if (selectedPoints.length < 2) {
      alert('Please select at least 2 points to generate a route');
      return;
    }

    setIsGenerating(true);
    
    // First optimize the point order
    const optimizedRoute = optimizeRoute(selectedPoints);
    setGeneratedRoute(optimizedRoute);
    
    // The road route will be generated automatically by the Map component
    // Wait for the API calls to complete
    setTimeout(async () => {
      const routeDistance = currentRoadRoute ? 
        calculateRoadRouteDistance(currentRoadRoute) : 
        calculateRoadRouteDistance(optimizedRoute);
      
      const routeId = `R-${String(generatedRoutes.length + 101).padStart(3, '0')}`;
      const truckId = `T-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`;
      
      // Create new route object
      const newRouteData = {
        routeId: routeId,
        truck: truckId,
        municipalCouncil: selectedArea,
        distance: `${routeDistance} km`,
        status: 'Optimized',
        points: selectedPoints.map(p => ({ lat: p.position[0], lng: p.position[1], id: p.id })),
        route: optimizedRoute.map(p => ({ lat: p[0], lng: p[1] })),
        roadRoute: currentRoadRoute ? currentRoadRoute.map(p => ({ lat: p[0], lng: p[1] })) : [],
        dispatched: false
      };

      try {
        const savedRoute = await routeAPI.createRoute(newRouteData);
        setGeneratedRoutes(prev => [savedRoute, ...prev]);
        alert('Route created and saved successfully!');
      } catch (error) {
        console.error("Failed to save route:", error);
        alert('Failed to save the new route. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 3000); // Wait for road routing to complete
  };

  // Clear route creation
  const handleClearRoute = () => {
    setSelectedPoints([]);
    setGeneratedRoute(null);
    setCurrentRoadRoute(null);
    setIsRouteCreationMode(false);
  };

  // Toggle route creation mode
  const toggleRouteCreationMode = () => {
    setIsRouteCreationMode(prev => !prev);
    if (isRouteCreationMode) {
      handleClearRoute();
    }
  };
  const handleLatestRouteNav = async () => {
    try {
      const latestRoute = await routeAPI.getLatestRoute();
      if (latestRoute && latestRoute._id) {
        navigate(`/route-details/${latestRoute._id}`);
      } else {
        alert('No routes available to show details for.');
      }
    } catch (error) {
      alert('Failed to fetch the latest route.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div onClick={() => navigate('/')} className="p-6 flex items-center gap-4 border-b cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">EcoCollect</div>
            <div className="text-xs text-gray-500 -mt-0.5">Operator Dashboard</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Dashboard</a>
          <a href="#" onClick={() => navigate('/routes')} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Routes</a>
          <a href="#" onClick={handleLatestRouteNav} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Route Details</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-semibold">Optimize Collection Routes</h1>
        </header>

        <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
          {/* Left Panel: Controls */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold">Control Panel</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Select Municipal Council</label>
                <select 
                  id="area" 
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option>Colombo Municipal Council</option>
                  <option>Dehiwala-Mount Lavinia Municipal Council</option>
                  <option>Sri Jayawardenapura Kotte Municipal Council</option>
                  <option>Kaduwela Municipal Council</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={toggleRouteCreationMode}
                  className={`w-full px-4 py-2 rounded-md font-semibold shadow transition ${
                    isRouteCreationMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRouteCreationMode ? 'Cancel Route Creation' : 'Create New Route'}
                </button>
                
                {isRouteCreationMode && (
                  <>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      <p className="font-medium">Selected Points: {selectedPoints.length}</p>
                      <p className="text-xs mt-1">Click on the map to add collection points</p>
                    </div>
                    
                    <button 
                      onClick={handleGenerateRoutes}
                      disabled={selectedPoints.length < 2 || isGenerating}
                      className={`w-full px-4 py-2 rounded-md font-semibold shadow transition ${
                        selectedPoints.length < 2 || isGenerating
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isGenerating ? 'Generating...' : 'Generate Route'}
                    </button>
                    
                    {selectedPoints.length > 0 && (
                      <button 
                        onClick={handleClearRoute}
                        className="w-full px-4 py-2 rounded-md bg-gray-500 text-white font-semibold shadow hover:bg-gray-600 transition"
                      >
                        Clear Points
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Map */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="h-96">
              <Map 
                selectedArea={selectedArea}
                isRouteCreationMode={isRouteCreationMode}
                selectedPoints={selectedPoints}
                onPointClick={handlePointClick}
                generatedRoute={generatedRoute}
                showDefaultPoints={!isRouteCreationMode}
                onRouteGenerated={handleRoadRouteGenerated}
              />
            </div>
          </div>
        </main>

        {/* Bottom Panel: Route Table */}
        <div className="p-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Generated Routes</h2>
                  {generatedRoutes.length > 0 && (
                    <span className="text-sm text-gray-500">
                      Total Routes: {generatedRoutes.length}
                    </span>
                  )}
                </div>
                
                {generatedRoutes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No routes generated yet</p>
                    <p className="text-sm mt-1">Create a new route by clicking points on the map</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Route ID</th>
                                <th scope="col" className="px-6 py-3">Truck</th>
                                <th scope="col" className="px-6 py-3">Municipal Council</th>
                                <th scope="col" className="px-6 py-3">Distance</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedRoutes.map((route) => (
                              <tr key={route._id || route.id} className="bg-white border-b hover:bg-gray-50">
                                  <td 
                                    onClick={() => navigate(`/route-details/${route._id}`)} 
                                    className="px-6 py-4 font-medium text-emerald-600 hover:underline cursor-pointer"
                                  >
                                    {route.routeId}
                                  </td>
                                  <td className="px-6 py-4">{route.truck}</td>
                                  <td className="px-6 py-4">{route.municipalCouncil}</td>
                                  <td className="px-6 py-4">{route.distance}</td>
                                  <td className="px-6 py-4">
                                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                                      {route.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleDispatchRoute(route)}
                                        className="font-medium text-emerald-600 hover:underline"
                                      >
                                        Dispatch
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteRoute(route._id)}
                                        className="font-medium text-red-600 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
