import React from 'react';
import { useNavigate } from 'react-router-dom';

// Icons for the dashboard
const TruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V17H1V3Z" stroke="#10B981" strokeWidth="1.5" /><path d="M15 8H23L19 12H15" stroke="#10B981" strokeWidth="1.5" /><circle cx="6" cy="20" r="2" stroke="#10B981" strokeWidth="1.5" /><circle cx="18" cy="20" r="2" stroke="#10B981" strokeWidth="1.5" /></svg>;
const RouteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17L10 11L4 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 17L18 11L12 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CollectionIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10L12 14L16 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="4" width="18" height="16" rx="2" stroke="#10B981" strokeWidth="1.5" /></svg>;
const DistanceIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7.00005L12 11L20 7" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12.0001L12 16L20 12" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function DashboardPage() {
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
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Dashboard</a>
          <a href="#" onClick={() => navigate('/routes')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Routes</a>
          <a href="#" onClick={() => navigate('/route-details')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100">Route Details</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Operations Overview</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/routes')} className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg transition">Go to Route Optimization</button>
          </div>
        </header>

        {/* Dashboard Cards */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Routes" value="24" icon={<RouteIcon />} />
            <DashboardCard title="Total Trucks" value="12" icon={<TruckIcon />} />
            <DashboardCard title="Pending Collections" value="3" icon={<CollectionIcon />} />
            <DashboardCard title="Average Route Distance" value="8.2 km" icon={<DistanceIcon />} />
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
    </div>
  );
}
