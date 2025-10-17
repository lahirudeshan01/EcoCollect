import React from 'react';
import Layout from '../components/Layout';

function SettingsPage() {
    return (
        <Layout activeTab="Settings" variant="sidebar">
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Settings</h1>
                <p className="text-gray-500 mb-8">Manage your account, billing, notifications, rewards, and app preferences.</p>

                {/* 1. Account & Profile Management */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Account & Profile</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Your Name" defaultValue="Resident User" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" className="w-full border rounded-lg px-3 py-2" placeholder="Email" defaultValue="resident@test.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                            <input type="tel" className="w-full border rounded-lg px-3 py-2" placeholder="Phone" />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <button className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Change Password</button>
                        <button className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Setup 2FA</button>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Primary Collection Address</label>
                        <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="123 Main St, City" />
                        <a href="#" className="text-blue-600 text-sm mt-2 inline-block">View Assigned Collection Area/Route</a>
                    </div>
                </section>

                {/* 2. Billing & Payment */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Billing & Payment</h2>
                    <div className="flex gap-4 mb-4">
                        <button className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Add Payment Method</button>
                        <button className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Manage Payment Methods</button>
                    </div>
                    <a href="/resident/payments" className="text-emerald-600 text-sm mt-2 inline-block">View Billing History</a>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Subscription/Plan</label>
                        <select className="w-full border rounded-lg px-3 py-2">
                            <option>Weekly Collection</option>
                            <option>Bi-Weekly Collection</option>
                        </select>
                        <button className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Change Plan</button>
                    </div>
                </section>

                {/* 3. Notifications & Communication */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Notifications & Communication</h2>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-emerald-600" /> Pickup Reminders
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-emerald-600" /> Status Updates
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-emerald-600" /> System Alerts
                        </label>
                    </div>
                </section>

                {/* 4. Waste Service Configuration */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Waste Service & Rewards</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Default Waste Types</label>
                        <select className="w-full border rounded-lg px-3 py-2">
                            <option>General</option>
                            <option>Recycling</option>
                            <option>Bulky</option>
                            <option>Hazardous</option>
                        </select>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4">
                        <div>
                            <div className="text-sm text-gray-600">Current Reward Points</div>
                            <div className="text-2xl font-bold text-green-700">120</div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">Redeem Rewards</button>
                        <a href="#" className="text-green-600 text-sm">View Reward Rules</a>
                    </div>
                </section>

                {/* 5. App & Interface */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">App & Interface</h2>
                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-blue-600" /> Dark Mode
                        </label>
                        <label className="flex items-center gap-2">
                            <span className="text-sm">Language:</span>
                            <select className="border rounded-lg px-2 py-1">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </label>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default SettingsPage;
