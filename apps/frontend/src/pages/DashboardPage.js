import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routeAPI } from '../services/api';

// Icons for the dashboard
const TruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V17H1V3Z" stroke="#10B981" strokeWidth="1.5" /><path d="M15 8H23L19 12H15" stroke="#10B981" strokeWidth="1.5" /><circle cx="6" cy="20" r="2" stroke="#10B981" strokeWidth="1.5" /><circle cx="18" cy="20" r="2" stroke="#10B981" strokeWidth="1.5" /></svg>;
const RouteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17L10 11L4 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 17L18 11L12 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const AssignedTruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V17H1V3Z" stroke="#3B82F6" strokeWidth="1.5" /><path d="M15 8H23L19 12H15" stroke="#3B82F6" strokeWidth="1.5" /><circle cx="6" cy="20" r="2" stroke="#3B82F6" strokeWidth="1.5" /><circle cx="18" cy="20" r="2" stroke="#3B82F6" strokeWidth="1.5" /><path d="M8 9L11 12L16 7" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const AvailableTruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V17H1V3Z" stroke="#F59E0B" strokeWidth="1.5" /><path d="M15 8H23L19 12H15" stroke="#F59E0B" strokeWidth="1.5" /><circle cx="6" cy="20" r="2" stroke="#F59E0B" strokeWidth="1.5" /><circle cx="18" cy="20" r="2" stroke="#F59E0B" strokeWidth="1.5" /></svg>;
const CouncilIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12H15V22" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DistanceIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const TimeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#06B6D4" strokeWidth="1.5"/><path d="M12 6V12L16 14" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalRoutes: 0,
    totalTrucks: 36,
    assignedTrucks: 0,
    availableTrucks: 36,
    municipalCouncils: 4,
    avgRouteDistance: '0 km',
    avgCompletionTime: '0m'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all routes
        const routes = await routeAPI.getAllRoutes();
        
        const totalRoutes = routes.length;
        const assignedTrucks = totalRoutes; // Each route has one truck
        const totalTrucks = 36; // Always 36
        const availableTrucks = totalTrucks - assignedTrucks;
        const municipalCouncils = 4; // Fixed value

        // Calculate average route distance
        let avgRouteDistance = '0 km';
        if (routes.length > 0) {
          const totalDistance = routes.reduce((sum, route) => {
            const distanceKm = parseFloat(route.distance?.replace(/[^\d.]/g, '') || 0);
            return sum + distanceKm;
          }, 0);
          const avgDistance = (totalDistance / routes.length).toFixed(1);
          avgRouteDistance = `${avgDistance} km`;
        }

        // Calculate average route completion time
        let avgCompletionTime = '0m';
        if (routes.length > 0) {
          const totalMinutes = routes.reduce((sum, route) => {
            return sum + (route.estimatedTimeMinutes || 0);
          }, 0);
          const avgMinutes = Math.round(totalMinutes / routes.length);
          
          // Format the time
          const hours = Math.floor(avgMinutes / 60);
          const minutes = avgMinutes % 60;
          if (hours > 0) {
            avgCompletionTime = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
          } else {
            avgCompletionTime = `${minutes}m`;
          }
        }

        setDashboardData({
          totalRoutes,
          totalTrucks,
          assignedTrucks,
          availableTrucks,
          municipalCouncils,
          avgRouteDistance,
          avgCompletionTime
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Row 1 */}
              <DashboardCard 
                title="Total Routes" 
                value={dashboardData.totalRoutes} 
                icon={<RouteIcon />} 
                color="emerald"
              />
              <DashboardCard 
                title="Total Trucks" 
                value={dashboardData.totalTrucks} 
                icon={<TruckIcon />} 
                color="emerald"
              />
              <DashboardCard 
                title="Assigned Trucks" 
                value={dashboardData.assignedTrucks} 
                icon={<AssignedTruckIcon />} 
                color="blue"
              />
              <DashboardCard 
                title="Available Trucks" 
                value={dashboardData.availableTrucks} 
                icon={<AvailableTruckIcon />} 
                color="amber"
              />
              
              {/* Row 2 */}
              <DashboardCard 
                title="Municipal Councils" 
                value={dashboardData.municipalCouncils} 
                icon={<CouncilIcon />} 
                color="purple"
              />
              <DashboardCard 
                title="Avg Route Distance" 
                value={dashboardData.avgRouteDistance} 
                icon={<DistanceIcon />} 
                color="pink"
              />
              <DashboardCard 
                title="Avg Completion Time" 
                value={dashboardData.avgCompletionTime} 
                icon={<TimeIcon />} 
                color="cyan"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color = 'emerald' }) {
  const colorClasses = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    purple: 'bg-purple-50',
    pink: 'bg-pink-50',
    cyan: 'bg-cyan-50'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
    </div>
  );
}
