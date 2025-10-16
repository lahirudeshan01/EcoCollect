import React from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder for a map component
const MapPlaceholder = () => (
  <div className="bg-gray-200 rounded-lg h-full flex items-center justify-center">
    <p className="text-gray-500">Map View</p>
  </div>
);

export default function RouteOptimizationPage() {
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
          <a href="#" onClick={() => navigate('/routes')} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Routes</a>
          <a href="#" onClick={() => navigate('/route-details')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Route Details</a>
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
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Select Area</label>
                <select id="area" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                  <option>North Zone</option>
                  <option>South Zone</option>
                  <option>East Zone</option>
                  <option>West Zone</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold shadow hover:shadow-lg transition">Generate Routes</button>
            </div>
          </div>

          {/* Right Panel: Map */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <MapPlaceholder />
          </div>
        </main>

        {/* Bottom Panel: Route Table */}
        <div className="p-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold">Generated Routes</h2>
                <table className="w-full mt-4 text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Route ID</th>
                            <th scope="col" className="px-6 py-3">Truck</th>
                            <th scope="col" className="px-6 py-3">Stops</th>
                            <th scope="col" className="px-6 py-3">Distance</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b">
                            <td onClick={() => navigate('/route-details')} className="px-6 py-4 font-medium text-emerald-600 hover:underline cursor-pointer">R-101</td>
                            <td className="px-6 py-4">T-05</td>
                            <td className="px-6 py-4">23</td>
                            <td className="px-6 py-4">12.5 km</td>
                            <td className="px-6 py-4 text-green-600">Optimized</td>
                            <td className="px-6 py-4"><button className="font-medium text-emerald-600 hover:underline">Dispatch</button></td>
                        </tr>
                        <tr className="bg-white border-b">
                            <td className="px-6 py-4">R-102</td>
                            <td className="px-6 py-4">T-08</td>
                            <td className="px-6 py-4">18</td>
                            <td className="px-6 py-4">9.8 km</td>
                            <td className="px-6 py-4 text-yellow-600">Pending</td>
                            <td className="px-6 py-4"><button className="font-medium text-emerald-600 hover:underline">Dispatch</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
