import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RequestPickup from '../components/RequestPickup';
import { fetchDashboardData, requestPickup } from '../services/residentApi';

// --- KPI Card Component ---
const KPICard = ({ title, value, unit, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        {value} <span className="text-base font-normal text-gray-600">{unit}</span>
      </p>
    </div>
    <div className="text-emerald-600 bg-emerald-100 p-3 rounded-full">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

// --- Status Tag Component ---
const StatusTag = ({ status }) => {
  let colorClasses = '';
  switch (status.toLowerCase()) {
    case 'completed':
      colorClasses = 'bg-green-100 text-green-800';
      break;
    case 'scheduled':
      colorClasses = 'bg-blue-100 text-blue-800';
      break;
    case 'pending payment':
      colorClasses = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
      {status}
    </span>
  );
};

// --- Icons ---
const TrashIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalendarIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const loadDashboard = async () => {
    try {
      const result = await fetchDashboardData();
      setData(result || { recentActivity: [] });
    } catch (err) {
      console.error('❌ Failed to fetch dashboard data:', err);
      setData({ recentActivity: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Handle pickup submission
  const handleConfirmRequest = async (formData) => {
    try {
      const result = await requestPickup(formData);

      if (result.error) {
        alert(result.error);
        return;
      }

      alert('✅ Pickup scheduled successfully!');
      // Refresh data from backend after successful request
      await loadDashboard();
      setIsRequesting(false);
    } catch (err) {
      console.error('❌ Pickup request failed:', err);
      alert('Failed to submit pickup request. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout activeTab="Home" variant="sidebar">
        <p className="p-8 text-lg">Loading dashboard data...</p>
      </Layout>
    );
  }

  const { totalWaste = 0, nextPickupDate = null, pendingPickups = 0, recentActivity = [] } = data || {};

  return (
    <Layout activeTab="Home" variant="sidebar">
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Resident Dashboard</h1>
          <button
            onClick={() => setIsRequesting(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Request New Pickup</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <KPICard title="Total Waste Collected" value={totalWaste} unit="kg" icon={TrashIcon} />
          <KPICard
            title="Next Scheduled Pickup"
            value={nextPickupDate ? new Date(nextPickupDate).toLocaleDateString() : 'N/A'}
            unit=""
            icon={CalendarIcon}
          />
          <KPICard title="Pending Pickups" value={pendingPickups} unit="requests" icon={ClockIcon} />
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Pickup Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <tr key={activity._id || activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.weight || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.notes || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusTag status={activity.status || 'Scheduled'} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No recent pickup activity. Click 'Request New Pickup' to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Pickup Modal */}
      {isRequesting && (
        <RequestPickup
          onClose={() => setIsRequesting(false)}
          onConfirm={handleConfirmRequest}
        />
      )}
    </Layout>
  );
}

export default Dashboard;
