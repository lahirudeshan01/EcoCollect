// Dummy service for dashboard data and pickup request
export async function fetchDashboardData() {
  const token = localStorage.getItem('token');
  // Fetch recent activity and compute simple totals client-side for now
  const res = await fetch('/api/resident/recent-activity', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    // Graceful fallback for unauthenticated or server issues
    return { totalWaste: 0, nextPickupDate: null, pendingPickups: 0, recentActivity: [] };
  }
  const recentActivity = await res.json();
  const totalWaste = recentActivity.reduce((sum, r) => sum + (r.weight || 0), 0);
  const pendingPickups = recentActivity.filter(r => String(r.status).toLowerCase() !== 'completed').length;
  const nextPickupDate = recentActivity.find(r => String(r.status).toLowerCase() === 'scheduled')?.date || null;
  return { totalWaste, nextPickupDate, pendingPickups, recentActivity };
}

export async function requestPickup(formData) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/resident/pickup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || 'Failed to schedule pickup' };
  }
  return await res.json();
}
