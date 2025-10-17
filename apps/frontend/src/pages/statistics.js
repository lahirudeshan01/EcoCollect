import React from 'react';
import Layout from '../components/Layout';
import { FaRecycle, FaTruck, FaClock, FaSmile } from 'react-icons/fa';

function StatisticsPage() {
  const kpis = [
    { label: 'Total Collected', value: '1,250', unit: 'kg', sub: '+8% MoM', icon: <FaRecycle className="text-emerald-500 w-6 h-6" /> },
    { label: 'Recycling Rate', value: '62', unit: '%', sub: '+3 pts', icon: <FaRecycle className="text-blue-500 w-6 h-6" /> },
    { label: 'Avg. Pickup Time', value: '36', unit: 'hrs', sub: '-5 hrs', icon: <FaClock className="text-yellow-500 w-6 h-6" /> },
    { label: 'Missed Pickups', value: '2', unit: '', sub: '-1', icon: <FaTruck className="text-red-500 w-6 h-6" /> },
  ];

  const categories = [
    { name: 'General', value: 55 },
    { name: 'Recycling', value: 32 },
    { name: 'Bulky', value: 9 },
    { name: 'Hazardous', value: 4 },
  ];

  const serviceMetrics = [
    { label: 'On-time Pickup Rate', value: '93%', sub: '+2 pts this month', icon: <FaTruck className="text-emerald-500 w-5 h-5" /> },
    { label: 'Customer Satisfaction', value: '4.6/5', sub: 'New record', icon: <FaSmile className="text-yellow-500 w-5 h-5" /> },
    { label: 'Route Efficiency', value: '78%', sub: '+5% efficiency', icon: <FaClock className="text-blue-500 w-5 h-5" /> },
  ];

  return (
    <Layout activeTab="Statistics" variant="sidebar">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Statistics</h1>
          <p className="text-gray-500">Your waste and recycling performance at a glance.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-gradient-to-r from-emerald-50 to-white rounded-xl shadow-lg p-5 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{kpi.label}</div>
                {kpi.icon}
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                {kpi.value}
                {kpi.unit && <span className="text-base font-semibold text-gray-500 ml-1">{kpi.unit}</span>}
              </div>
              <div className="mt-1 text-xs font-medium text-emerald-700">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Waste Trend</h2>
            <div className="h-60 rounded-md bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg animate-pulse">
              Chart Placeholder
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h2>
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>{c.name}</span>
                    <span>{c.value}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Quality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceMetrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-emerald-50 rounded-full flex items-center justify-center">
                {metric.icon}
              </div>
              <div>
                <div className="text-sm text-gray-500">{metric.label}</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="mt-1 text-xs text-emerald-700 font-medium">{metric.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Highlights</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Recycling campaigns increased participation by 12%.</li>
            <li>Bulky item pickups reduced average wait time to 2 days.</li>
            <li>New routes cut fuel use by ~6% across the district.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default StatisticsPage;
