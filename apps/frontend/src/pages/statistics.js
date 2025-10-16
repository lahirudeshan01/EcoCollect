import React from 'react';
import Layout from '../components/Layout';

function StatisticsPage() {
    // Example stats data
    const stats = [
        { label: 'Total Waste Collected', value: '1,250 kg', color: 'bg-green-100', icon: '🗑️' },
        { label: 'Recycling Rate', value: '62%', color: 'bg-blue-100', icon: '♻️' },
        { label: 'Special Pickups', value: '15', color: 'bg-yellow-100', icon: '🚚' },
        { label: 'Pending Requests', value: '3', color: 'bg-red-100', icon: '⏳' },
    ];

    return (
        <Layout activeTab="Statistics">
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Statistics</h1>
                <p className="text-gray-500 mb-8">Your waste management and recycling performance at a glance.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`rounded-xl shadow-lg p-6 flex items-center gap-4 ${stat.color}`}>
                            <span className="text-3xl">{stat.icon}</span>
                            <div>
                                <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Waste Trend</h2>
                    <div className="w-full h-48 flex items-center justify-center text-gray-400">
                        {/* Placeholder for chart */}
                        <span>Chart coming soon...</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default StatisticsPage;
