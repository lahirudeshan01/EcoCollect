import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routeAPI } from '../services/api';
import Map from '../components/Map';

export default function RouteDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        const routeData = await routeAPI.getRouteById(id);
        setRoute(routeData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch route details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoute();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading route details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Route not found.</p>
      </div>
    );
  }
  
  const routeForMap = route.roadRoute && route.roadRoute.length > 0 
    ? route.roadRoute.map(p => [p.lat, p.lng]) 
    : (route.route ? route.route.map(p => [p.lat, p.lng]) : []);
  const pointsForMap = route.points ? route.points.map(p => ({...p, position: [p.lat, p.lng]})) : [];


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

  const handleDispatchClick = () => {
    setShowDispatchDialog(true);
  };

  const handleConfirmDispatch = () => {
    // Add dispatch logic here (e.g., update route status, notify drivers, etc.)
    alert(`Route ${route.routeId} has been dispatched to ${route.truck}!`);
    setShowDispatchDialog(false);
    // Optional: navigate back to routes page
    // navigate('/routes');
  };

  const handleCancelDispatch = () => {
    setShowDispatchDialog(false);
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
          <a href="#" onClick={() => navigate('/routes')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Routes</a>
          <a href="#" onClick={handleLatestRouteNav} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Route Details</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Route ID: {route.routeId}</h1>
            <p className="text-sm text-gray-500">Area: {route.municipalCouncil}</p>
          </div>
          <button 
            onClick={handleDispatchClick}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg transition"
          >
            Dispatch
          </button>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <InfoCard title="Distance" value={route.distance} />
            <InfoCard title="Estimated Time" value={route.estimatedTime || 'N/A'} />
            <InfoCard title="Average Speed" value="22 km/h" />
            <InfoCard title="Truck Assigned" value={route.truck} />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Route Map</h2>
            <div className="h-96">
              <Map
                selectedArea={route.municipalCouncil}
                isRouteCreationMode={false}
                selectedPoints={pointsForMap}
                generatedRoute={routeForMap}
                showDefaultPoints={false}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Dispatch Confirmation Dialog */}
      {showDispatchDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 relative z-[10000]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11l3 3L22 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Dispatch</h3>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-gray-700">
                Are you sure you want to dispatch this route?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Route ID:</span>
                  <span className="font-semibold text-gray-900">{route.routeId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Truck:</span>
                  <span className="font-semibold text-gray-900">{route.truck}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-semibold text-gray-900">{route.municipalCouncil}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-semibold text-gray-900">{route.distance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-semibold text-gray-900">{route.estimatedTime || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDispatch}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-xl transition"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}
