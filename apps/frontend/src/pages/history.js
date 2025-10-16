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

    if (isLoading) return <Layout activeTab="History"><p>Loading Waste History...</p></Layout>;

    return (
        <Layout activeTab="History">
            <h1>Waste Collection History</h1>
            <p>View detailed records of waste collected from your residence.</p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Waste Type</th>
                        <th style={styles.th}>Weight (kg)</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? history.map((record, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{record.date}</td>
                            <td style={styles.td}>{record.type}</td>
                            <td style={styles.td}>{record.weight || 'N/A'}</td>
                            <td style={styles.td}>{record.status}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" style={styles.td}>No history found.</td></tr>
                    )}
                </tbody>
            </table>
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
