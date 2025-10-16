import React from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder for a map component
const RouteMap = () => (
  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
    <p className="text-gray-500">Route Map</p>
  </div>
);

export default function RouteDetailsPage() {
  const navigate = useNavigate();
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
          <a href="#" onClick={() => navigate('/route-details')} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Route Details</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Route ID: R-101</h1>
            <p className="text-sm text-gray-500">Area: North Zone</p>
          </div>
          <button className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg transition">Adjust Route</button>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InfoCard title="Distance" value="12.5 km" />
            <InfoCard title="Estimated Time" value="45 mins" />
            <InfoCard title="Truck Assigned" value="T-05" />
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Route Map</h2>
            <RouteMap />
          </div>
        </main>
      </div>
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
