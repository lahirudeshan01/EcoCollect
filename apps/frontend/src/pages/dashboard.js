import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Assume these imports handle the actual API calls
import Layout from '../components/Layout';
import RequestPickup from '../components/RequestPickup';
import { fetchDashboardData, requestPickup } from '../services/residentApi';

// --- Helper Components for UI (would be separate files in a real app) ---

// Component for the Key Performance Indicator (KPI) Cards
const KPICard = ({ title, value, unit, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
                {value} <span className="text-base font-normal text-gray-600">{unit}</span>
            </p>
        </div>
        <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

// Component for a styled Status Tag in the table
const StatusTag = ({ status }) => {
    let colorClasses = "";
    switch (status.toLowerCase()) {
        case 'completed':
            colorClasses = "bg-green-100 text-green-800";
            break;
        case 'scheduled':
            colorClasses = "bg-blue-100 text-blue-800";
            break;
        case 'pending payment':
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        default:
            colorClasses = "bg-gray-100 text-gray-800";
    }
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

// Placeholder icons (replace with real icon library like Heroicons)
const TrashIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ClockIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalendarIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// ---------------------------------------------------------------------


function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null); // Initialize as null to handle loading
    const [isRequesting, setIsRequesting] = useState(false);
    
    useEffect(() => {
        // Mock data structure if API fails for UI preview
        fetchDashboardData().then(setData).catch(() => {
            // Fallback for UI if API fails (REMOVE THIS IN PROD)
            setData({
                totalWaste: 150.5,
                nextPickupDate: '2025-10-25',
                pendingPickups: 2,
                recentActivity: [
                    { id: 1, date: 'Oct 10, 2025', type: 'Mixed', weight: 4.2, status: 'Completed' },
                    { id: 2, date: 'Oct 15, 2025', type: 'Recycling', weight: 0, status: 'Scheduled' },
                    { id: 3, date: 'Sep 28, 2025', type: 'Large Item', weight: 15, status: 'Pending Payment' },
                ]
            });
            // navigate('/'); // Keep the original redirect on actual auth error
        }); 
    }, []);

    const handleConfirmRequest = async (formData) => {
        setIsRequesting(false); // Close panel immediately on request submission
        const result = await requestPickup(formData);
        
        if (result.suggestion) {
            alert(`No slots available on that day. System suggests: ${result.suggestion}`);
        } else if (result.requiresPayment) {
            alert('Large item pickup requested. Redirecting to payment...');
            navigate('/resident/payment');
        } else {
            alert('Pickup scheduled successfully!');
            fetchDashboardData().then(setData); // Refresh data
        }
    };

    if (data === null) {
        // Enhanced Loading State (Skeleton screen highly recommended here)
        return <Layout activeTab="Home"><p className="p-8 text-lg">Loading dashboard data...</p></Layout>;
    }

    // --- Destructure data for cleaner usage ---
    const { totalWaste, nextPickupDate, pendingPickups, recentActivity } = data;


    return (
        <Layout activeTab="Home">
            <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
                
                {/* Header and CTA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Resident Dashboard</h1>
                    <button 
                        onClick={() => setIsRequesting(true)}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                    >
                        <TrashIcon className="w-5 h-5"/>
                        <span>Request New Pickup</span>
                    </button>
                </div>
                
                {/* 1. KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <KPICard 
                        title="Total Waste Collected" 
                        value={totalWaste} 
                        unit="kg" 
                        icon={TrashIcon} 
                    />
                    <KPICard 
                        title="Next Scheduled Pickup" 
                        value={nextPickupDate ? new Date(nextPickupDate).toLocaleDateString() : 'N/A'}
                        unit="" 
                        icon={CalendarIcon} 
                    />
                    <KPICard 
                        title="Pending Pickups" 
                        value={pendingPickups} 
                        unit="requests" 
                        icon={ClockIcon} 
                    />
                    {/* Add more metrics here */}
                </div>

                {/* 2. Recent Activity Table */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Pickup Activity</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentActivity && recentActivity.length > 0 ? (
                                    recentActivity.map(activity => (
                                        <tr key={activity.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.weight > 0 ? activity.weight : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusTag status={activity.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-purple-600 hover:text-purple-900">View</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No recent pickup activity. Click 'Request New Pickup' to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            {/* 3. Request Pickup Side Panel */}
            {isRequesting && (
                <RequestPickup 
                    onClose={() => setIsRequesting(false)} 
                    onConfirm={handleConfirmRequest}
                    // This component should now be styled as a clean side-drawer or modal
                />
            )}
        </Layout>
    );
}

export default Dashboard;