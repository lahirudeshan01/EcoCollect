import React from 'react';
import Layout from '../components/Layout';

function StatisticsPage() {
    // KPIs and sample breakdown (placeholder values)
    const kpis = [
        { label: 'Total Collected', value: '1,250', unit: 'kg', sub: '+8% MoM' },
        { label: 'Recycling Rate', value: '62', unit: '%', sub: '+3 pts' },
        { label: 'Avg. Pickup Time', value: '36', unit: 'hrs', sub: '-5 hrs' },
        { label: 'Missed Pickups', value: '2', unit: '', sub: '-1' },
    ];
    const categories = [
        { name: 'General', value: 55 },
        { name: 'Recycling', value: 32 },
        { name: 'Bulky', value: 9 },
        { name: 'Hazardous', value: 4 },
    ];

    return (
        <Layout activeTab="Statistics" variant="sidebar">
            <div className="max-w-6xl mx-auto p-6 md:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Statistics</h1>
                    <p className="text-gray-500">Your waste and recycling performance at a glance.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                            <div className="text-sm text-gray-500">{kpi.label}</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                {kpi.value}
                                {kpi.unit && <span className="text-base font-semibold text-gray-500 ml-1">{kpi.unit}</span>}
                            </div>
                            <div className="mt-1 text-xs font-medium text-emerald-700">{kpi.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Monthly Waste Trend</h2>
                        <div className="mt-4 h-60 rounded-md bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center text-emerald-600">
                            Chart placeholder
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Category Breakdown</h2>
                        <div className="mt-4 space-y-4">
                            {categories.map((c) => (
                                <div key={c.name}>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{c.name}</span>
                                        <span>{c.value}%</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${c.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Service Quality Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <div className="text-sm text-gray-500">On-time Pickup Rate</div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">93%</div>
                        <div className="mt-1 text-xs text-emerald-700 font-medium">+2 pts this month</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <div className="text-sm text-gray-500">Customer Satisfaction</div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">4.6/5</div>
                        <div className="mt-1 text-xs text-emerald-700 font-medium">New record</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <div className="text-sm text-gray-500">Route Efficiency</div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">78%</div>
                        <div className="mt-1 text-xs text-emerald-700 font-medium">+5% efficiency</div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Highlights</h2>
                    <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
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
