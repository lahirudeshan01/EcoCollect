import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchWasteHistory } from '../services/api';

function WasteHistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWasteHistory()
            .then(data => {
                setHistory(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching waste history:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <Layout activeTab="History" variant="sidebar"><p className="p-8 text-lg">Loading Waste History...</p></Layout>;

    return (
        <Layout activeTab="History" variant="sidebar">
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Waste Collection History</h1>
                <p className="text-gray-500 mb-8">View detailed records of waste collected from your residence.</p>

                <div className="space-y-6">
                    {history.length > 0 ? history.map((record, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{record.type} Pickup</p>
                                <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500">{record.weight ? `${record.weight} kg` : 'Weight not recorded'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                record.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                record.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {record.status}
                            </span>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow">No history found.</div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
// Add simple table styles for clarity
const styles = {
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' }
};

export default WasteHistoryPage;
