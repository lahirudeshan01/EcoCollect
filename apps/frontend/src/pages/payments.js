import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchPaymentHistory } from '../services/api';


function PaymentHistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPaymentHistory()
            .then(data => {
                setHistory(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching payment history:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <Layout activeTab="Payment History"><p className="p-8 text-lg">Loading Payment History...</p></Layout>;

    return (
        <Layout activeTab="Payment History">
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Payment & Payback History</h1>
                <p className="text-gray-500 mb-8">Track your charges and recycling credits/paybacks.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {history.length > 0 ? history.map((record, idx) => (
                        <div key={idx} className={`rounded-xl shadow-lg p-6 flex flex-col gap-2 ${record.type === 'Payback' ? 'bg-green-50' : 'bg-white'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">{record.type === 'Payback' ? 'Recycling Credit' : record.type}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Paid' ? 'bg-blue-100 text-blue-700' : record.status === 'Credited' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{record.status}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{record.type === 'Payback' ? `+${record.amount.toFixed(2)}` : `-${record.amount.toFixed(2)}`} <span className="text-base font-normal text-gray-600">USD</span></div>
                            <div className="text-sm text-gray-500">{record.date}</div>
                        </div>
                    )) : (
                        <div className="col-span-2 p-8 text-center text-gray-500 bg-white rounded-xl shadow">No financial records found.</div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Payments Trend</h2>
                    <div className="w-full h-48 flex items-center justify-center text-gray-400">
                        {/* Placeholder for chart */}
                        <span>Chart coming soon...</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PaymentHistoryPage;
