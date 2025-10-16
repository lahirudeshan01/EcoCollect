"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/context/AuthContext';
import { fetchDashboardData, requestPickup } from '../services/api';
import RequestPickup from '../components/RequestPickup';

const PinithiDashboard = () => {
    const { user, signOut } = useAuth();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestingPickup, setIsRequestingPickup] = useState(false);
    const [apiMessage, setApiMessage] = useState(null);

    // 🔄 Fetch dashboard data
    const refreshDashboard = useCallback(() => {
        setIsLoading(true);
        fetchDashboardData()
            .then(res => {
                setData(res);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch dashboard data:", error);
                if (error.response?.status === 401) signOut();
                setIsLoading(false);
            });
    }, [signOut]);

    useEffect(() => {
        refreshDashboard();
    }, [refreshDashboard]);

    // 🧾 Handle pickup request confirmation
    const handleConfirmRequest = async (formData) => {
        setApiMessage(null);
        setIsRequestingPickup(false);

        try {
            const result = await requestPickup(formData);

            if (result.success) {
                setApiMessage({
                    type: 'success',
                    text: `Pickup scheduled successfully! ${result.data?.requiresPayment ? 'Please proceed to payment.' : ''}`
                });
                refreshDashboard();
            } else if (result.suggestion) {
                setApiMessage({
                    type: 'warning',
                    text: `No slots available. Suggested: ${result.suggestion}. Try again.`
                });
                setIsRequestingPickup(true);
            } else {
                setApiMessage({
                    type: 'error',
                    text: result.message || 'Request failed. Please try again.'
                });
            }
        } catch (err) {
            console.error("Pickup request error:", err);
            setApiMessage({
                type: 'error',
                text: 'An error occurred. Please try again.'
            });
        }
    };

    // 🕒 Loading state
    if (isLoading) {
        return (
            <Layout activeTab="Home">
                <p>Loading Dashboard...</p>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout activeTab="Home">
                <p>Please log in to view the dashboard.</p>
            </Layout>
        );
    }

    return (
        <Layout activeTab="Home">
            <h1>Welcome Back, {user?.name ?? 'Resident'}!</h1>

            {apiMessage && (
                <div style={{
                    ...styles.messageBox,
                    backgroundColor: styles.messageColors[apiMessage.type]
                }}>
                    {apiMessage.text}
                </div>
            )}

            {/* 📊 Dashboard Metrics */}
            <div style={styles.metricsContainer}>
                <div style={styles.metricCard}>
                    <h3>Total Waste Collected</h3>
                    <p style={styles.metricValue}>{(data.totalWaste ?? 0).toLocaleString()} kg</p>
                </div>
                <div style={styles.metricCard}>
                    <h3>Recycling Percentage</h3>
                    <p style={{ ...styles.metricValue, color: '#4CAF50' }}>
                        {data.recyclingPercentage ?? 0}%
                    </p>
                </div>
                <div style={styles.metricCard}>
                    <h3>Upcoming Pickups</h3>
                    <p style={styles.metricValue}>{data.upcomingPickups ?? 0}</p>
                </div>
            </div>

            {/* ♻ Request Pickup Button */}
            <button onClick={() => setIsRequestingPickup(true)} style={styles.pickupButton}>
                + Request Special Pickup
            </button>

            {/* 🧾 Pickup Request Modal */}
            {isRequestingPickup && (
                <RequestPickup
                    onClose={() => setIsRequestingPickup(false)}
                    onConfirm={handleConfirmRequest}
                />
            )}

            {/* 🕓 Recent Activity Section */}
            <div style={{ marginTop: '30px' }}>
                <h2>Recent Activity</h2>
                {data.recentActivity && data.recentActivity.length > 0 ? (
                    <ul style={styles.activityList}>
                        {data.recentActivity.map((activity, index) => (
                            <li key={index} style={styles.activityItem}>
                                <span>{activity.date}</span> - {activity.description}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent activity found.</p>
                )}
            </div>
        </Layout>
    );
};

// 💅 Inline Styles
const styles = {
    metricsContainer: { display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' },
    metricCard: { flex: 1, padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', minWidth: '250px' },
    metricValue: { fontSize: '2em', fontWeight: 'bold', margin: '5px 0' },
    pickupButton: { padding: '12px 25px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1em', cursor: 'pointer', marginBottom: '20px' },
    messageBox: { padding: '15px', borderRadius: '5px', color: 'white', marginBottom: '20px', fontWeight: 'bold' },
    messageColors: { success: '#4CAF50', warning: '#FF9800', error: '#F44336' },
    activityList: { listStyleType: 'none', paddingLeft: 0 },
    activityItem: { marginBottom: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }
};

export default PinithiDashboard;